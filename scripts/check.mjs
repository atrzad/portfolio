import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { projects, skills, skillLinks, contacts } from '../dist/data.js';
import { listaSeo } from './build-seo.mjs';
import { versionar } from './versionar.mjs';
const root = new URL('../dist/', import.meta.url);
const ids = new Set(skills.map(s => s.id));
assert.equal(new Set(projects.map(p => p.id)).size, projects.length, 'IDs duplicados');
for (const [a, b] of skillLinks) assert.ok(ids.has(a) && ids.has(b), `Ligação inválida ${a}-${b}`);
for (const p of projects) {
  assert.ok(p.name && p.short && p.description && p.detail && p.motivation, `Campos faltando: ${p.id}`);
  for (const s of p.skills) assert.ok(ids.has(s), `Habilidade desconhecida em ${p.id}: ${s}`);
  if (p.image) assert.ok((await stat(new URL('assets/screenshots/' + p.image, root))).size > 1000, `Captura ausente: ${p.id}`);
  if (p.repo) assert.match(p.repo, /^(glwydson|atrzad)\/[\w/-]+$/);
}
assert.ok(contacts.length >= 3);
const html = await readFile(new URL('index.html', root), 'utf8');
for (const m of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)) await stat(new URL(m[1].split('?')[0], root));
for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const c of m[1].split(',')) await stat(new URL(c.trim().split(' ')[0].split('?')[0], root));
const css = await readFile(new URL('style.css', root), 'utf8');
for (const m of css.matchAll(/url\('\.\/([^']+)'\)/g)) await stat(new URL(m[1].split('?')[0], root));
assert.equal(html, await versionar(html), 'Versões de assets desatualizadas no HTML: rode npm run versao');
assert.equal(css, await versionar(css), 'Versões de assets desatualizadas no CSS: rode npm run versao');
assert.ok(html.includes('lang="pt-BR"'));
assert.ok(!/\sstyle="/.test(html), 'Atributo style inline bloqueado pelo CSP');
assert.ok(html.includes(listaSeo()), 'Lista SEO desatualizada: rode npm run seo');
if (html.includes('id="contato"')) for (const c of contacts) assert.ok(html.includes(`href="${c.href}"`), `Contato ausente no HTML: ${c.label}`);
console.log(`Dados validados: ${projects.length} projetos (${projects.filter(p => p.skills.length).length} na árvore), ${skills.length} habilidades, lista SEO e referências locais presentes.`);
