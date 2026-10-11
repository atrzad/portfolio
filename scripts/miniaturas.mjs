// Gera, a partir das capturas dos projetos (dist/assets/screenshots/), versões leves para não pesar no celular:
//   miniaturas/<nome>: 360 × 240, recortada do topo (ficha da roda no desktop e cartões do celular);
//   medias/<nome>: 720 px de largura (imagem do modal em telas pequenas, via srcset).
// A captura original continua sendo usada na imagem ampliada. Uso: npm run miniaturas
import { execFileSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { projects } from '../dist/data.js';

const pasta = fileURLToPath(new URL('../dist/assets/screenshots/', import.meta.url));
await mkdir(pasta + 'miniaturas', { recursive: true });
await mkdir(pasta + 'medias', { recursive: true });
const webp = ['-strip', '-define', 'webp:method=6'];
for (const nome of new Set(projects.map(p => p.image).filter(Boolean))) {
  const origem = pasta + nome;
  execFileSync('magick', [origem, '-resize', '360x240^', '-gravity', 'north', '-extent', '360x240', '-quality', '74', ...webp, pasta + 'miniaturas/' + nome]);
  execFileSync('magick', [origem, '-resize', '720x>', '-quality', '78', ...webp, pasta + 'medias/' + nome]);
  console.log('miniatura', nome);
}
