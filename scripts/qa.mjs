// QA no Chromium: portão, árvore, modal, teclado, celular, movimento reduzido, CSP e segurança básica.
// Uso: npm run qa   (BASE=http://127.0.0.1:4322 npm run qa para testar outra porta)
import assert from 'node:assert/strict';
import { chromium } from '/home/ayo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { projects } from '../dist/data.js';

const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const naArvore = projects.filter(p => p.skills.length);
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
  const distancia = await page.evaluate(() => document.querySelector('#terminal').getBoundingClientRect().top / innerHeight);
  assert.ok(distancia < 1.35, 'terminal longe demais depois do portão: ' + distancia);
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos' }).click();
  await page.waitForTimeout(900);
  const tela = await page.locator('#terminal').boundingBox();
  assert.ok(tela.y >= 56 && tela.y + tela.height <= 900 + 1, 'terminal não cabe inteiro na janela: ' + JSON.stringify(tela));

  // árvore
  await page.locator('#terminal').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#skill-tree .skill').count(), 8);
  assert.equal(await page.locator('#skill-tree .proj').count(), naArvore.length);
  assert.equal(await page.locator('#offtree-list button').count(), projects.length - naArvore.length);
  await page.locator('.proj[data-project="financeiro"] .dia').hover();
  assert.ok(await page.locator('#skill-tree.lit').count(), 'hover não acendeu a árvore');
  assert.equal(await page.locator('#skill-tree .skill.on').count(), 5);
  assert.equal(await page.locator('#skill-tree .edge-proj.on').count(), 5);
  assert.ok(await page.locator('#skill-tree .edge-skill.on').count() >= 3, 'caminho de habilidades não acendeu');
  assert.ok((await page.locator('#osd-live').textContent()).includes('SINC. 62,5%'), 'tela sem a sincronia do projeto');
  // trocar de projeto só acende outro caminho: a tela não pisca nem anima
  await page.locator('.proj[data-project="duelo"] .dia').hover();
  await page.locator('.proj[data-project="desk"] .dia').hover();
  const animandoNaTela = await page.locator('#terminal').evaluate(t => t.getAnimations({ subtree: true })
    .filter(a => a instanceof CSSAnimation && !a.effect.target.classList.contains('cursor')).map(a => a.animationName));
  assert.deepEqual(animandoNaTela, [], 'tela animando ao trocar de projeto');
  await page.locator('.proj[data-project="financeiro"] .dia').hover();
  assert.ok(await page.locator('#skill-tree .graticula line').count() > 50, 'graticula do osciloscópio ausente');
  assert.equal(await page.locator('.term-frame').evaluate(i => getComputedStyle(i).imageRendering), 'pixelated', 'moldura do terminal sem pixel art');
  assert.equal(await page.locator('#door').evaluate(i => getComputedStyle(i).imageRendering), 'pixelated', 'portão sem pixel art');
  await page.waitForTimeout(450);
  await page.mouse.move(5, 300);
  assert.equal(await page.locator('#skill-tree.lit').count(), 0, 'árvore não apagou ao sair');

  // teclado: Tab até um losango, Enter abre, Escape fecha e devolve o foco
  await page.locator('.proj').first().focus();
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
  await page.locator('.proj[data-project="duelo"] .dia').click();
  await page.locator('#project-dialog').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.btn-repo').textContent(), '[ ABRIR REPOSITÓRIO ]');
  assert.equal(await page.locator('.btn-repo').getAttribute('href'), 'https://github.com/atrzad/duelo-de-termos');
  await page.locator('.shot').click();
  assert.ok(await page.locator('#image-dialog').isVisible());
  await page.keyboard.press('Escape');
  assert.ok(await page.locator('#project-dialog').isVisible());
  await page.keyboard.press('Escape');
  await page.locator('#offtree-list button').first().click();
  assert.ok(await page.locator('#project-dialog').isVisible());
  await page.keyboard.press('Escape');
  await page.locator('.proj[data-project="nossos"] .dia').click();
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

  // ── celular: árvore vira lista
  for (const largura of [320, 390, 768]) {
    const m = await browser.newPage({ viewport: { width: largura, height: 844 } });
    const em = vigiar(m);
    await m.goto(BASE + '/', { waitUntil: 'networkidle' });
    assert.ok(await semOverflow(m), `overflow em ${largura}px`);
    if (largura < 760) {
      assert.ok(!(await m.locator('#skill-tree').isVisible()), 'SVG deveria sumir no celular');
      assert.equal(await m.locator('#tree-list .tree-item').count(), naArvore.length);
      await m.locator('#tree-list .tree-item').nth(2).click();
      assert.ok(await m.locator('#project-dialog').isVisible());
      await m.keyboard.press('Escape');
    }
    assert.deepEqual(em, []);
    await m.close();
  }

  // ── movimento reduzido: sem portão em rolagem, sem animações
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  const r = await ctx.newPage();
  const er = vigiar(r);
  await r.goto(BASE + '/', { waitUntil: 'networkidle' });
  assert.equal(await r.locator('#inicio.is-scrolly').count(), 0);
  assert.equal(await r.locator('#door').evaluate(d => getComputedStyle(d).transform), 'none');
  await r.locator('.proj[data-project="rest"] .dia').hover();
  await r.locator('.proj[data-project="rest"] .dia').click();
  assert.equal(await r.locator('#terminal.glitching').count(), 0, 'glitch da TV com movimento reduzido');
  const animacoes = await r.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length);
  assert.equal(animacoes, 0, 'animações rodando com movimento reduzido');
  assert.equal(await r.locator('#banner').evaluate(b => getComputedStyle(b).display), 'none', 'aviso dourado com movimento reduzido');
  await r.keyboard.press('Escape');
  assert.deepEqual(er, []);
  await ctx.close();

  console.log(`PASS: portão (abre inteiro e segue direto para o terminal, que cabe na janela; som), árvore ${naArvore.length}+${projects.length - naArvore.length} projetos com sincronia e graticula, hover/foco acendem caminhos sem a tela piscar, modal (teclado, clique, captura, Escape, foco), SEO ${projects.length} itens, contatos e aviso dourado, 320/390/768/1440px, texto 200%, movimento reduzido, sem erros JS/HTTP/CSP.`);
} finally {
  await browser.close();
}
