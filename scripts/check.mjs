import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const root=new URL('../dist/',import.meta.url);
const projects=JSON.parse(await readFile(new URL('projects.json',root)));
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length,'IDs duplicados');
for(const p of projects){assert.ok(p.name&&p.description&&p.detail);if(p.image)assert.ok((await stat(new URL('assets/screenshots/'+p.image,root))).size>1000,`Captura ausente: ${p.id}`);if(p.repo)assert.match(p.repo,/^(glwydson|atrzad)\/[\w/-]+$/);}
const html=await readFile(new URL('index.html',root),'utf8');
for(const match of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g))await stat(new URL(match[1].split('?')[0],root));
assert.ok(html.includes('lang="pt-BR"'));
console.log(`Catálogo validado: ${projects.length} projetos, ${projects.filter(p=>p.image).length} capturas e referências locais presentes.`);
