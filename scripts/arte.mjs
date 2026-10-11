// Renderiza as cenas de scripts/arte/cenas.mjs em pixel art: o SVG é renderizado no Chromium do Playwright,
// reduzido por média de área para uma grade baixa (640 px de largura nas cenas grandes) e mapeado para uma
// paleta fixa, sem anti-aliasing nem cores intermediárias. O navegador amplia com image-rendering: pixelated.
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

// Escala da grade de pixel por cena (unidades da cena → pixels finais) e tratamento da transparência.
const grade = { selo: .32, neblina: .2 };
const alfaPontilhado = new Set(['neblina']);

// Paleta: cinzas, fósforo, vermelho, magenta, ciano, ferrugem/tijolo, madeira, papel, ouro e aço.
const paleta = [
  '#050505', '#0a0a0a', '#141414', '#1c1c1c', '#262626', '#333333', '#444444', '#555555', '#6d706b', '#8d8f8c', '#b5b5ad', '#d9d9d0', '#f0eee6',
  '#052a10', '#0b3a17', '#1d4a28', '#1f9e43', '#39ff6a', '#a6ffbf',
  '#3a0e0e', '#7a1414', '#c4161c', '#ff2a2a', '#5a1050', '#a3178a', '#ff2bd6', '#0e4a55', '#1592a6', '#22e6ff',
  '#2a1712', '#3a1d14', '#4e231b', '#5a2a20', '#6b2f22', '#7a3a28', '#8a3f1d', '#a0522d', '#c27a4a',
  '#3d2614', '#4a2f1a', '#5b3b22', '#6b4529', '#7d5634',
  '#6b6047', '#9a8d6a', '#a99d7b', '#bdb293', '#bfb495', '#cbc1a6', '#d6cdb4', '#ddd4bb', '#e6e0cc',
  '#c9a227', '#e0b95e', '#ff9a3c', '#1c3d9e', '#173a52', '#2f3235', '#3a3e41', '#5a5f63', '#9aa3a6'
];

await mkdir(saida, { recursive: true });
await mkdir(tmp, { recursive: true });
const arquivoPaleta = tmp + 'paleta.png';
execFileSync('magick', [...paleta.map(c => `xc:${c}`), '+append', arquivoPaleta]);

const html = cena => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:BlackOps;src:url('file://${fontes}BlackOpsOne-Regular.woff2')}
@font-face{font-family:Marker;src:url('file://${fontes}PermanentMarker-Regular.woff2')}
@font-face{font-family:Pixel;src:url('file://${fontes}Silkscreen-Bold.woff2')}
@font-face{font-family:Cinzel;src:url('file://${fontes}Cinzel.woff2');font-weight:400 900}
html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}
</style>${cena.svg}`;

function pixelar(png, destino, cena) {
  const k = grade[cena.nome] ?? .4;
  const tamanho = `${Math.round(cena.w * k)}x${Math.round(cena.h * k)}!`;
  const webp = ['-define', 'webp:lossless=true', '-define', 'webp:method=6', destino];
  if (!cena.alfa) {
    execFileSync('magick', [png, '-filter', 'Box', '-resize', tamanho, '-dither', 'None', '-remap', arquivoPaleta, ...webp]);
    return;
  }
  const alfa = alfaPontilhado.has(cena.nome) ? ['-ordered-dither', 'o4x4'] : ['-threshold', '50%'];
  execFileSync('magick', [png, '-filter', 'Box', '-resize', tamanho, '-write', 'mpr:cena', '+delete',
    '(', 'mpr:cena', '-alpha', 'off', '-dither', 'None', '-remap', arquivoPaleta, ')',
    '(', 'mpr:cena', '-alpha', 'extract', ...alfa, ')',
    '-compose', 'CopyOpacity', '-composite', ...webp]);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const fazer of cenas) {
    const cena = fazer();
    if (pedidas.length && !pedidas.includes(cena.nome)) continue;
    const arquivo = tmp + cena.nome + '.html';
    await writeFile(arquivo, html(cena));
    await writeFile(tmp + cena.nome + '.svg', cena.svg);
    const page = await browser.newPage({ viewport: { width: cena.w, height: cena.h } });
    await page.goto('file://' + arquivo);
    await page.evaluate(() => document.fonts.ready);
    const png = tmp + cena.nome + '.png';
    await page.screenshot({ path: png, omitBackground: cena.alfa });
    await page.close();
    pixelar(png, saida + cena.nome + '.webp', cena);
    console.log('cena', cena.nome, 'ok');
  }
  // Ruído VHS: ladrilho pequeno em tons de cinza, ampliado em blocos no CSS e animado só por transform.
  if (!pedidas.length || pedidas.includes('ruido')) {
    execFileSync('magick', ['-size', '96x96', 'xc:gray50', '-seed', '9', '+noise', 'Random', '-colorspace', 'Gray', '-define', 'webp:lossless=true', saida + 'ruido.webp']);
    console.log('cena ruido ok');
  }
} finally {
  await browser.close();
}
