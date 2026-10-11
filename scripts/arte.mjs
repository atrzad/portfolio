// Renderiza as cenas de scripts/arte/cenas.mjs em pixel art no espírito dos adventures de PC-98:
// o SVG é renderizado no Chromium do Playwright, reduzido por média de área para uma grade baixa
// (640 × 400 nas cenas grandes, a resolução do PC-98) e mapeado para a paleta própria da cena com
// pontilhado ordenado (Bayer 4×4): cada pixel mistura as duas cores da paleta que melhor o explicam,
// então degradês viram tramas de pontos e áreas chapadas continuam chapadas. O navegador amplia
// com image-rendering: pixelated.
// Uso: node scripts/arte.mjs [nome...]   (sem nomes = todas as cenas)
import { chromium } from '/home/ayo/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { cenas } from './arte/cenas.mjs';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const fontesSite = raiz + 'dist/assets/fonts/';
const fontesArte = raiz + 'scripts/arte/fontes/';
const saida = raiz + 'dist/assets/cena/';
const tmp = raiz + '.runtime/arte/';
const pedidas = process.argv.slice(2);

const html = cena => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:BlackOps;src:url('file://${fontesArte}BlackOpsOne-Regular.woff2')}
@font-face{font-family:Marker;src:url('file://${fontesArte}PermanentMarker-Regular.woff2')}
@font-face{font-family:Cinzel;src:url('file://${fontesArte}Cinzel.woff2');font-weight:400 900}
@font-face{font-family:Letreiro;src:url('file://${fontesArte}AlfaSlabOne-Regular.ttf')}
@font-face{font-family:Lambe;src:url('file://${fontesArte}Anton-Regular.ttf')}
@font-face{font-family:Pixel;src:url('file://${fontesSite}Silkscreen-Bold.woff2')}
@font-face{font-family:Term;src:url('file://${fontesSite}VT323-Regular.woff2')}
html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}
</style>${cena.svg}`;

// ── cor: sRGB → Oklab, onde distância e mistura se aproximam do que o olho percebe
const linear = Float64Array.from({ length: 256 }, (_, i) => { const c = i / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
function oklab(r, g, b) {
  const lr = linear[r], lg = linear[g], lb = linear[b];
  const l = Math.cbrt(.4122214708 * lr + .5363325363 * lg + .0514459929 * lb);
  const m = Math.cbrt(.2119034982 * lr + .6806995451 * lg + .1073969566 * lb);
  const s = Math.cbrt(.0883024619 * lr + .2817188376 * lg + .6299787005 * lb);
  return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s];
}
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);

// Para cada cor de entrada: a cor mais próxima da paleta (c1), a melhor parceira de mistura (c2) e a
// proporção t. Misturas entre cores distantes são penalizadas, para a trama não virar chuvisco.
function misturador(paleta, rigor) {
  const cores = paleta.map(hex), lab = cores.map(c => oklab(...c));
  const memo = new Map();
  return (r, g, b) => {
    const chave = (r << 16) | (g << 8) | b;
    let m = memo.get(chave);
    if (m) return m;
    const p = oklab(r, g, b);
    let c1 = 0, d1 = Infinity;
    lab.forEach((c, i) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if (d < d1) { d1 = d; c1 = i; } });
    m = { c1: cores[c1], c2: cores[c1], t: 0 };
    let melhor = d1;
    const a = lab[c1];
    lab.forEach((c, i) => {
      if (i === c1) return;
      const dx = c[0] - a[0], dy = c[1] - a[1], dz = c[2] - a[2], dd = dx * dx + dy * dy + dz * dz;
      const t = Math.min(1, Math.max(0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy + (p[2] - a[2]) * dz) / dd));
      const erro = (p[0] - a[0] - t * dx) ** 2 + (p[1] - a[1] - t * dy) ** 2 + (p[2] - a[2] - t * dz) ** 2 + rigor * dd * t * (1 - t);
      if (erro < melhor) { melhor = erro; m = { c1: cores[c1], c2: cores[i], t: t < 1 / 32 ? 0 : t > 31 / 32 ? 1 : t }; }
    });
    memo.set(chave, m);
    return m;
  };
}

function pixelar(png, destino, cena) {
  const k = cena.grade ?? .4;
  const w = Math.round(cena.w * k), h = Math.round(cena.h * k);
  const bruto = execFileSync('magick', [png, '-filter', 'Box', '-resize', `${w}x${h}!`, '-depth', '8', 'rgba:-'], { maxBuffer: 1 << 26 });
  const mistura = misturador(cena.paleta, cena.rigor ?? .18);
  const out = Buffer.alloc(w * h * 4);
  const usadas = new Set();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4, limiar = BAYER[(y & 3) * 4 + (x & 3)];
    let alfa = 255;
    if (cena.alfa) {
      const a = bruto[i + 3] / 255;
      alfa = (cena.alfa === 'pontilhado' ? a > limiar : a >= .5) ? 255 : 0;
    }
    if (alfa) {
      const { c1, c2, t } = mistura(bruto[i], bruto[i + 1], bruto[i + 2]);
      const c = t > limiar ? c2 : c1;
      out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2];
      usadas.add(c.join());
    }
    out[i + 3] = alfa;
  }
  execFileSync('magick', ['-size', `${w}x${h}`, '-depth', '8', 'rgba:-', '-define', 'webp:lossless=true', '-define', 'webp:method=6', destino], { input: out });
  return { w, h, cores: usadas.size };
}

await mkdir(saida, { recursive: true });
await mkdir(tmp, { recursive: true });
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
    await page.screenshot({ path: png, omitBackground: Boolean(cena.alfa) });
    await page.close();
    const r = pixelar(png, saida + cena.nome + '.webp', cena);
    console.log(`cena ${cena.nome}: ${r.w}×${r.h}, ${r.cores} de ${cena.paleta.length} cores`);
  }
  // Ruído VHS: ladrilho pequeno em tons de cinza, ampliado em blocos no CSS e animado só por transform.
  if (!pedidas.length || pedidas.includes('ruido')) {
    execFileSync('magick', ['-size', '96x96', 'xc:gray50', '-seed', '9', '+noise', 'Random', '-colorspace', 'Gray', '-define', 'webp:lossless=true', saida + 'ruido.webp']);
    console.log('cena ruido ok');
  }
} finally {
  await browser.close();
}
