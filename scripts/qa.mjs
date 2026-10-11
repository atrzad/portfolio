// QA no Chromium: portão, árvore, modal, teclado, celular, movimento reduzido, CSP e segurança básica.
// Uso: npm run qa   (BASE=http://127.0.0.1:4322 npm run qa para testar outra porta)
import assert from 'node:assert/strict';
import { chromium } from '/home/ayo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { projects, areas } from '../dist/data.js';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const naArvore = projects.filter(p => p.area);
const daArea = id => projects.filter(p => p.area === id);
const browser = await chromium.launch({ headless: true });
const vigiar = page => {
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('response', r => { if (r.url().startsWith(BASE) && r.status() >= 400) erros.push(r.status() + ' ' + r.url()); });
  return erros;
};
const semOverflow = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
const rolarPortao = (page, p) => page.evaluate(p => { const g = document.querySelector('#inicio'); scrollTo({ top: g.offsetTop + (g.offsetHeight - innerHeight) * p, behavior: 'instant' }); }, p);

try {
  // ── desktop
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const erros = vigiar(page);
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  assert.ok(await page.locator('#inicio.is-scrolly').count(), 'portão deveria estar em modo de rolagem');
  assert.equal((await page.locator('#hero-title').textContent()).replace(/\s+/g, ' ').trim(), 'GLAYDSON DE OLIVEIRA');
  await rolarPortao(page, .35); await page.waitForTimeout(150);
  const meio = await page.locator('#door').evaluate(d => getComputedStyle(d).transform);
  assert.notEqual(meio, 'none', 'portão não se moveu');
  assert.equal(await page.getByRole('link', { name: /Experimente rolar/ }).count(), 1, 'dica do início sem nome acessível');
  await page.locator('#sound').click();
  assert.equal(await page.locator('#sound').getAttribute('aria-pressed'), 'true', 'botão de som não alternou');
  // aberto, o portão solta o palco e a próxima tela já é o terminal: sem câmera, faixas, lente ou linha de energia
  await rolarPortao(page, 1); await page.waitForTimeout(150);
  const aberto = await page.locator('#door').evaluate(d => new DOMMatrix(getComputedStyle(d).transform).m42 / d.offsetHeight);
  assert.ok(aberto < -.99, 'portão não abriu inteiro: ' + aberto);
  assert.equal(await page.locator('#bar-top, #lens, #power, #plane-front, .roll').count(), 0, 'restos da animação depois da abertura');
  assert.equal(await page.locator('#sound').evaluate(b => getComputedStyle(b).visibility), 'hidden', 'botão de som deveria sumir com o portão aberto');
  const distancia = await page.evaluate(() => document.querySelector('#terminal').getBoundingClientRect().top / innerHeight);
  assert.ok(distancia < 1.35, 'terminal longe demais depois do portão: ' + distancia);
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos' }).click();
  await page.waitForTimeout(900);
  const tela = await page.locator('#terminal').boundingBox();
  assert.ok(tela.y >= 56 && tela.y + tela.height <= 900 + 1, 'terminal não cabe inteiro na janela: ' + JSON.stringify(tela));

  // roda (desktop): centro → áreas → linguagens → projetos, com mira no nó e ficha ao lado
  await page.locator('#terminal').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#skill-tree .area').count(), areas.length);
  assert.equal(await page.locator('#skill-tree .ling').count(), areas.reduce((t, a) => t + a.langs.length, 0));
  assert.equal(await page.locator('#skill-tree .proj').count(), naArvore.length);
  assert.equal(await page.locator('#offtree-list button').count(), projects.length - naArvore.length);
  assert.ok(await page.locator('#ficha').isVisible(), 'ficha ausente no desktop');
  assert.ok(!(await page.locator('#tela-movel').isVisible()), 'tela do celular aparecendo no desktop');
  await page.locator('#skill-tree .proj[data-project="financeiro"] .dia').hover();
  assert.ok(await page.locator('#skill-tree.lit').count(), 'hover não acendeu a roda');
  assert.equal(await page.locator('#skill-tree .area.on').count(), 1);
  assert.equal(await page.locator('#skill-tree .ling.on').count(), 2);
  assert.equal(await page.locator('#skill-tree .lig.on').count(), 5, 'caminho até o centro incompleto');
  await page.waitForTimeout(250);
  assert.equal(await page.locator('#skill-tree .proj.sel .mira').evaluate(m => getComputedStyle(m).opacity), '1', 'mira não apareceu no hover');
  assert.ok((await page.locator('#osd-live').textContent()).includes('SINC. 50%'), 'tela sem a sincronia do projeto');
  assert.equal(await page.locator('#ficha .ficha-nome').textContent(), 'Sistema Financeiro', 'ficha não mostrou o projeto');
  await page.locator('#ficha .ficha-mini').evaluate(i => i.complete && i.naturalWidth ? null : new Promise(ok => i.addEventListener('load', ok, { once: true })));
  assert.ok(await page.locator('#ficha .ficha-mini').evaluate(i => i.currentSrc.includes('/miniaturas/') && i.naturalWidth === 360), 'ficha sem a miniatura leve');
  await page.locator('#skill-tree .ling[data-ling="fullstack|typescript"] polygon').hover();
  assert.equal(await page.locator('#skill-tree .proj.on').count(), daArea('fullstack').filter(p => p.langs.includes('typescript')).length);
  assert.equal(await page.locator('#ficha .ficha-nome').textContent(), 'TypeScript');
  await page.locator('#skill-tree .area[data-area="automacao"] polygon').hover();
  assert.equal(await page.locator('#skill-tree .proj.on').count(), daArea('automacao').length);
  assert.equal(await page.locator('#skill-tree .ling.on').count(), areas.find(a => a.id === 'automacao').langs.length);
  // trocar de nó só acende outro caminho: a tela não pisca nem anima
  await page.locator('#skill-tree .proj[data-project="duelo"] .dia').hover();
  await page.locator('#skill-tree .proj[data-project="desk"] .dia').hover();
  const animandoNaTela = await page.locator('#terminal').evaluate(t => t.getAnimations({ subtree: true })
    .filter(a => a instanceof CSSAnimation && !a.effect.target.classList.contains('cursor')).map(a => a.animationName));
  assert.deepEqual(animandoNaTela, [], 'tela animando ao trocar de projeto');
  assert.equal(await page.locator('.term-frame').evaluate(i => getComputedStyle(i).imageRendering), 'pixelated', 'moldura do terminal sem pixel art');
  assert.equal(await page.locator('#door').evaluate(i => getComputedStyle(i).imageRendering), 'pixelated', 'portão sem pixel art');
  await page.waitForTimeout(450);
  await page.mouse.move(5, 300);
  assert.equal(await page.locator('#skill-tree.lit').count(), 0, 'roda não apagou ao sair');
  assert.equal(await page.locator('#ficha .ficha-nome').textContent(), 'Roda de habilidades', 'ficha não voltou à legenda');

  // teclado: Tab até um losango, Enter abre, Escape fecha e devolve o foco
  await page.locator('#skill-tree .proj').first().focus();
  const primeiro = await page.evaluate(() => document.activeElement.dataset.project);
  assert.ok(await page.locator('#skill-tree.lit').count(), 'foco não acendeu a árvore');
  await page.keyboard.press('Enter');
  await page.locator('#project-dialog').waitFor({ state: 'visible' });
  const texto = await page.locator('#dialog-content').textContent();
  for (const trecho of ['// DESCRIÇÃO', '// MOTIVAÇÃO']) assert.ok(texto.includes(trecho), 'modal sem ' + trecho);
  await page.keyboard.press('Escape');
  assert.ok(!(await page.locator('#project-dialog').isVisible()));
  assert.equal(await page.evaluate(() => document.activeElement.dataset.project), primeiro, 'foco não voltou ao losango');

  // clique, repositório, captura ampliada e Escape empilhado
  await page.locator('#skill-tree .proj[data-project="duelo"] .dia').click();
  await page.locator('#project-dialog').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.btn-repo').textContent(), '[ ABRIR REPOSITÓRIO ]');
  assert.equal(await page.locator('.btn-repo').getAttribute('href'), 'https://github.com/atrzad/duelo-de-termos');
  await page.locator('.shot').click();
  assert.ok(await page.locator('#image-dialog').isVisible());
  assert.ok(!(await page.locator('#expanded-image').getAttribute('src')).includes('/medias/'), 'imagem ampliada deveria ser a captura original');
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('#project-dialog').isVisible());
  await page.keyboard.press('Escape');
  await page.locator('#offtree-list button').first().click();
  assert.ok(await page.locator('#project-dialog').isVisible());
  await page.keyboard.press('Escape');
  await page.locator('#skill-tree .proj[data-project="nossos"] .dia').click();
  assert.ok((await page.locator('#dialog-content').textContent()).includes('CÓDIGO PRIVADO'));
  await page.keyboard.press('Escape');

  // SEO, contatos e todas as imagens
  assert.equal(await page.locator('.seo-list li').count(), projects.length);
  assert.ok(await page.locator('.seo-list').evaluate(n => n.getBoundingClientRect().width <= 1), 'lista SEO deveria estar oculta visualmente');
  assert.equal(await page.locator('#contact-links a').count(), 4);
  await page.locator('#note').evaluate(n => n.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#banner.aceso').count(), 1, 'aviso SINAL ACESO não acendeu');
  await page.waitForFunction(() => [...document.images].filter(i => i.currentSrc && i.loading !== 'lazy').every(i => i.complete && i.naturalWidth > 0));
  assert.ok(await semOverflow(page), 'overflow em 1440px');
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  assert.ok(await semOverflow(page), 'overflow com texto ampliado');
  assert.ok(!(await page.locator('footer').textContent()).includes('reino esquecido'), 'frase antiga no rodapé');
  assert.equal((await page.request.get(BASE + '/.env')).status(), 404);
  assert.equal((await page.request.get(BASE + '/../server.mjs')).status(), 404);
  assert.deepEqual(erros, []);

  // ── celular e tablet em pé: tela própria com roda compacta, abas por área, filtro de linguagens e cartões
  for (const largura of [320, 390, 768, 1024]) {
    const ctxM = await browser.newContext({ viewport: { width: largura, height: largura > 900 ? 768 : 844 }, hasTouch: true });
    const m = await ctxM.newPage();
    const em = vigiar(m);
    await m.goto(BASE + '/', { waitUntil: 'networkidle' });
    assert.ok(await semOverflow(m), `overflow em ${largura}px`);
    if (largura > 900) {
      assert.ok(await m.locator('#skill-tree').isVisible() && await m.locator('#ficha').isVisible(), `roda do desktop ausente em ${largura}px`);
      assert.ok(!(await m.locator('#tela-movel').isVisible()), `tela do celular em ${largura}px`);
      // tablet deitado, no toque: o primeiro toque seleciona e mostra a ficha, o segundo abre o projeto
      await m.locator('#terminal').evaluate(t => t.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const losango = m.locator('#skill-tree .proj[data-project="rest"] .dia');
      await losango.tap();
      assert.ok(!(await m.locator('#project-dialog').isVisible()), 'primeiro toque não deveria abrir o projeto');
      assert.equal(await m.locator('#ficha .ficha-nome').textContent(), 'Rest System', 'toque não preencheu a ficha');
      await losango.tap();
      assert.ok(await m.locator('#project-dialog').isVisible(), 'segundo toque deveria abrir o projeto');
      await m.keyboard.press('Escape');
    } else {
      assert.ok(!(await m.locator('#skill-tree').isVisible()), 'roda do desktop deveria sumir no celular');
      assert.ok(await m.locator('#mini-tree').isVisible(), 'roda compacta ausente no celular');
      assert.equal(await m.locator('#abas .aba').count(), areas.length);
      assert.equal(await m.locator('#tree-list .cartao').count(), daArea('fullstack').length);
      await m.locator('#abas [data-aba="automacao"]').click();
      assert.equal(await m.locator('#abas [data-aba="automacao"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await m.locator('#tree-list .cartao').count(), daArea('automacao').length);
      await m.locator('#filtro-ling [data-filtro="python"]').click();
      const comPython = daArea('automacao').filter(p => p.langs.includes('python')).length;
      assert.equal(await m.locator('#tree-list .cartao').count(), comPython);
      assert.ok((await m.locator('#movel-resumo').textContent()).includes('com Python'), 'resumo do filtro ausente');
      assert.equal(await m.locator('#mini-tree .ling.sel').count(), 1, 'roda compacta não acompanhou o filtro');
      const minis = m.locator('#tree-list .cartao img');
      for (let i = 0; i < await minis.count(); i++) {
        await minis.nth(i).scrollIntoViewIfNeeded();
        await minis.nth(i).evaluate(img => img.complete && img.naturalWidth ? null : new Promise(ok => img.addEventListener('load', ok, { once: true })));
        assert.ok(await minis.nth(i).evaluate(img => img.naturalWidth === 360 && img.currentSrc.includes('/miniaturas/')), 'cartão sem a miniatura leve');
      }
      await m.locator('#tree-list .cartao').first().click();
      assert.ok(await m.locator('#project-dialog').isVisible());
      const shot = m.locator('#project-dialog .shot img');
      await shot.scrollIntoViewIfNeeded();
      await shot.evaluate(i => i.complete && i.naturalWidth ? null : new Promise(ok => i.addEventListener('load', ok, { once: true })));
      assert.ok(await shot.evaluate(i => i.currentSrc.includes('/medias/')), 'modal no celular sem a imagem média');
      const caixa = await shot.boundingBox();
      assert.ok(caixa.width <= largura - 40 && caixa.height <= Math.min(844 * .56, 420) + 1, 'miniatura do modal estourando: ' + JSON.stringify(caixa));
      await m.keyboard.press('Escape');
      assert.ok(await semOverflow(m), `overflow em ${largura}px depois do filtro`);
    }
    assert.deepEqual(em, []);
    await ctxM.close();
  }

  // ── movimento reduzido: sem portão em rolagem, sem animações
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  const r = await ctx.newPage();
  const er = vigiar(r);
  await r.goto(BASE + '/', { waitUntil: 'networkidle' });
  assert.equal(await r.locator('#inicio.is-scrolly').count(), 0);
  assert.equal(await r.locator('#door').evaluate(d => getComputedStyle(d).transform), 'none');
  await r.locator('#skill-tree .proj[data-project="rest"] .dia').hover();
  await r.locator('#skill-tree .proj[data-project="rest"] .dia').click();
  assert.equal(await r.locator('#terminal.glitching').count(), 0, 'glitch da TV com movimento reduzido');
  const animacoes = await r.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length);
  assert.equal(animacoes, 0, 'animações rodando com movimento reduzido');
  assert.equal(await r.locator('#banner').evaluate(b => getComputedStyle(b).display), 'none', 'aviso dourado com movimento reduzido');
  await r.keyboard.press('Escape');
  assert.deepEqual(er, []);
  await ctx.close();

  console.log(`PASS: portão (abre inteiro e segue direto para o terminal, que cabe na janela; som), roda ${areas.length} áreas e ${naArvore.length}+${projects.length - naArvore.length} projetos com mira, ficha e sincronia, sem a tela piscar; celular com abas, filtro e miniaturas, modal (teclado, clique, captura, Escape, foco), SEO ${projects.length} itens, contatos e aviso dourado, 320/390/768/1024/1440px (1024 no toque), texto 200%, movimento reduzido, sem erros JS/HTTP/CSP.`);
} finally {
  await browser.close();
}
