// Carimba ?v=<hash do conteúdo> nas referências a ./assets/ do index.html e do style.css.
// O servidor manda o navegador guardar /assets/ por 1 hora; com a versão na URL, uma arte
// re-renderizada com o mesmo nome nunca aparece velha. Rode depois de mudar assets: npm run versao
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const hashes = new Map();

async function hash(caminho) {
  if (!hashes.has(caminho)) {
    const dados = await readFile(new URL(caminho, dist));
    hashes.set(caminho, createHash('sha1').update(dados).digest('hex').slice(0, 8));
  }
  return hashes.get(caminho);
}

export async function versionar(texto) {
  const refs = [...texto.matchAll(/\.\/(assets\/[^"'\s?)#,]+)(\?v=[0-9a-z]+)?/g)];
  let saida = texto;
  for (const m of refs.reverse()) {
    saida = saida.slice(0, m.index) + `./${m[1]}?v=${await hash(m[1])}` + saida.slice(m.index + m[0].length);
  }
  return saida;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const nome of ['index.html', 'style.css']) {
    const arquivo = new URL(nome, dist);
    const antes = await readFile(arquivo, 'utf8');
    const depois = await versionar(antes);
    if (depois !== antes) await writeFile(arquivo, depois);
    console.log(nome, depois === antes ? 'já estava versionado' : 'versionado');
  }
}
