import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { projects, areas, languages, contacts } from '../dist/data.js';
import { listaSeo } from './build-seo.mjs';
import { versionar } from './versionar.mjs';
const root = new URL('../dist/', import.meta.url);
const linguagens = new Set(languages.map(l => l.id));
const porArea = Object.fromEntries(areas.map(a => [a.id, a]));
assert.equal(new Set(projects.map(p => p.id)).size, projects.length, 'IDs duplicados');
for (const a of areas) for (const l of a.langs) assert.ok(linguagens.has(l), `Linguagem desconhecida na área ${a.id}: ${l}`);
for (const a of areas) for (const l of a.langs) assert.ok(projects.some(p => p.area === a.id && p.langs.includes(l)), `${l} está na área ${a.id} sem nenhum projeto`);
for (const p of projects) {
  assert.ok(p.name && p.short && p.description && p.detail && p.motivation, `Campos faltando: ${p.id}`);
  for (const l of p.langs) assert.ok(linguagens.has(l), `Linguagem desconhecida em ${p.id}: ${l}`);
  if (p.area) {
    assert.ok(porArea[p.area], `Área desconhecida em ${p.id}: ${p.area}`);
    assert.ok(p.langs.length, `${p.id} está na roda sem linguagem`);
    for (const l of p.langs) assert.ok(porArea[p.area].langs.includes(l), `${p.id} usa ${l}, que não está na área ${p.area}`);
  }
  if (p.image) for (const pasta of ['miniaturas/', 'medias/']) assert.ok((await stat(new URL('assets/screenshots/' + pasta + p.image, root))).size > 500, `Miniatura ausente (${pasta}): ${p.id}; rode npm run miniaturas`);
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
// Chaves equilibradas no CSS: uma chave sobrando derruba em silêncio a regra seguinte.
{
  let prof = 0;
  for (const c of css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'[^']*'|"[^"]*"/g, '')) { if (c === '{') prof++; else if (c === '}') assert.ok(--prof >= 0, 'Chave } sobrando no CSS'); }
  assert.equal(prof, 0, 'Chave { sem fechar no CSS');
}
assert.ok(html.includes('lang="pt-BR"'));
assert.ok(!/\sstyle="/.test(html), 'Atributo style inline bloqueado pelo CSP');
assert.ok(html.includes(listaSeo()), 'Lista SEO desatualizada: rode npm run seo');
// Cada imagem de cena aparece uma vez só no site.
const cenas = [...(html + css).matchAll(/assets\/cena\/([\w-]+\.webp)/g)].map(m => m[1]);
const repetidas = cenas.filter((c, i) => cenas.indexOf(c) !== i);
assert.deepEqual(repetidas, [], 'Imagem de cena repetida: ' + repetidas.join(', '));
// Animações só mexem em transform, opacity e recortes curtos: nada que force layout ou repintura pesada a cada quadro.
for (const m of css.matchAll(/@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^}]*\})*)\s*\}/g)) {
  assert.ok(!/letter-spacing|width|height|\btop\b|\bleft\b|margin|padding|box-shadow|filter|background|stroke/.test(m[2]), `Animação ${m[1]} mexe em propriedade cara`);
}
if (html.includes('id="contato"')) for (const c of contacts) assert.ok(html.includes(`href="${c.href}"`), `Contato ausente no HTML: ${c.label}`);
console.log(`Dados validados: ${projects.length} projetos (${projects.filter(p => p.area).length} na roda), ${areas.length} áreas e ${languages.length} linguagens, lista SEO e referências locais presentes.`);
