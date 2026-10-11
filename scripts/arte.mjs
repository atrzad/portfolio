// Renderiza as cenas de scripts/arte/cenas.mjs em WebP (desktop e celular) com o Chromium do Playwright.
// Uso: node scripts/arte.mjs [nome...]   (sem nomes = todas as cenas)
import { chromium } from '/home/ayo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { cenas } from './arte/cenas.mjs';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const fontes = raiz + 'dist/assets/fonts/';
const saida = raiz + 'dist/assets/cena/';
const tmp = raiz + '.runtime/arte/';
const pedidas = process.argv.slice(2);
await mkdir(saida, { recursive: true });
await mkdir(tmp, { recursive: true });

const html = cena => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:BlackOps;src:url('file://${fontes}BlackOpsOne-Regular.woff2')}
@font-face{font-family:Marker;src:url('file://${fontes}PermanentMarker-Regular.woff2')}
@font-face{font-family:Pixel;src:url('file://${fontes}Silkscreen-Bold.woff2')}
@font-face{font-family:Cinzel;src:url('file://${fontes}Cinzel.woff2');font-weight:400 900}
html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}
</style>${cena.svg}`;

const browser = await chromium.launch({ headless: true });
try {
  for (const fazer of cenas) {
    const cena = fazer();
    if (pedidas.length && !pedidas.includes(cena.nome)) continue;
    const arquivo = tmp + cena.nome + '.html';
    await writeFile(arquivo, html(cena));
    await writeFile(tmp + cena.nome + '.svg', cena.svg);
    const page = await browser.newPage({ viewport: { width: cena.w, height: cena.h }, deviceScaleFactor: 1.2 });
    await page.goto('file://' + arquivo);
    await page.evaluate(() => document.fonts.ready);
    const png = tmp + cena.nome + '.png';
    await page.screenshot({ path: png, omitBackground: cena.alfa });
    await page.close();
    for (const [sufixo, largura, q] of [['', Math.round(cena.w * 1.2), 70], ['-m', Math.round(cena.w * .6), 66]]) {
      const destino = saida + cena.nome + sufixo + '.webp';
      execFileSync('magick', [png, '-resize', `${largura}x`, '-quality', String(q), '-define', 'webp:method=6', '-define', 'webp:lossless=false', '-define', 'webp:alpha-quality=60', destino]);
    }
    console.log('cena', cena.nome, 'ok');
  }
  // Ruído VHS: ladrilho pequeno em tons de cinza, animado só por transform no CSS.
  if (!pedidas.length || pedidas.includes('ruido')) {
    execFileSync('magick', ['-size', '192x192', 'xc:gray50', '-seed', '9', '+noise', 'Random', '-colorspace', 'Gray', '-quality', '55', saida + 'ruido.webp']);
    console.log('cena ruido ok');
  }
} finally {
  await browser.close();
}
