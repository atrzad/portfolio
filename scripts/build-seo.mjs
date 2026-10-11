// Gera, a partir de dist/data.js, a lista de projetos oculta visualmente no index.html
// (para leitores de tela e indexação). Rode depois de editar os projetos: npm run seo
import { readFile, writeFile } from 'node:fs/promises';
import { projects, areas, languages } from '../dist/data.js';

const arquivo = new URL('../dist/index.html', import.meta.url);
const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const area = Object.fromEntries(areas.map(a => [a.id, a.name]));
const ling = Object.fromEntries(languages.map(l => [l.id, l.label]));

export function listaSeo() {
  const itens = projects.map(p => {
    const nome = p.repo ? `<a href="https://github.com/${esc(p.repo)}">${esc(p.name)}</a>` : `${esc(p.name)} (código privado)`;
    const hab = (p.area ? ` Área: ${area[p.area]}.` : '') + (p.langs.length ? ` Linguagens: ${p.langs.map(l => ling[l]).join(', ')}.` : '');
    const tec = p.stack.length && p.kind !== 'Em preparação' ? ` Tecnologias: ${p.stack.map(esc).join(', ')}.` : '';
    return `      <li>${nome}: ${esc(p.description)}${esc(hab)}${tec}</li>`;
  });
  return `<!-- seo:start -->\n    <ul>\n${itens.join('\n')}\n    </ul>\n    <!-- seo:end -->`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const html = await readFile(arquivo, 'utf8');
  const novo = html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, listaSeo());
  await writeFile(arquivo, novo);
  console.log(novo === html ? 'Lista SEO já estava atualizada.' : 'Lista SEO atualizada.');
}
