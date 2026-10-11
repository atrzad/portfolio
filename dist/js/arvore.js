// Árvore de habilidades na tela da TV (SVG), lista vertical no celular e modal de projeto com glitch.
// Tudo é desenhado uma vez; hover/foco só trocam classes nos elementos envolvidos.
import { projects, skills, skillLinks } from '../data.js';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const imagem = nome => './assets/screenshots/' + encodeURIComponent(nome);
const rotulo = Object.fromEntries(skills.map(s => [s.id, s.label]));
const porId = Object.fromEntries(projects.map(p => [p.id, p]));
const categoria = { Web: 'WEB & FULL-STACK', Desktop: 'DESKTOP & MOBILE', Backend: 'APIS & AUTOMAÇÃO' };

const CENTRO = { x: 500, y: 385 };
const RAIZ = 'linux';
const ANEL = ['infra', 'servidor', 'fullstack', 'python', 'ml', 'c', 'automacao'];

function layout() {
  const pos = { [RAIZ]: { ...CENTRO } };
  ANEL.forEach((id, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / ANEL.length;
    pos[id] = { x: CENTRO.x + Math.cos(a) * 215, y: CENTRO.y + Math.sin(a) * 168 };
  });
  // Cada projeto vai para a borda, perto do "centro de massa" das suas habilidades, igualmente espaçados.
  const lista = projects.filter(p => p.skills.length).map(p => {
    const x = p.skills.reduce((t, s) => t + pos[s].x, 0) / p.skills.length - CENTRO.x;
    const y = p.skills.reduce((t, s) => t + pos[s].y, 0) / p.skills.length - CENTRO.y;
    return { p, a: Math.atan2(y, x) };
  }).sort((u, v) => u.a - v.a);
  const passo = 2 * Math.PI / lista.length;
  const dif = (a, b) => { const d = Math.abs(a - b) % (2 * Math.PI); return d > Math.PI ? 2 * Math.PI - d : d; };
  let melhor = 0, menor = Infinity;
  for (let k = 0; k < 120; k++) {
    const desloc = -Math.PI + k * 2 * Math.PI / 120;
    const custo = lista.reduce((t, item, i) => t + dif(desloc + i * passo, item.a) ** 2, 0);
    if (custo < menor) { menor = custo; melhor = desloc; }
  }
  for (const [i, item] of lista.entries()) {
    const a = melhor + i * passo;
    pos[item.p.id] = { x: CENTRO.x + Math.cos(a) * 340, y: CENTRO.y + Math.sin(a) * 300, a };
  }
  return { pos, naArvore: lista.map(i => i.p) };
}

// Menor caminho de uma habilidade até a raiz, pelas ligações da árvore.
function caminho(de) {
  const viz = {};
  for (const [a, b] of skillLinks) { (viz[a] ||= []).push(b); (viz[b] ||= []).push(a); }
  const veio = { [de]: null }, fila = [de];
  while (fila.length) {
    const atual = fila.shift();
    if (atual === RAIZ) break;
    for (const n of viz[atual] || []) if (!(n in veio)) { veio[n] = atual; fila.push(n); }
  }
  const arestas = [];
  for (let n = RAIZ; veio[n] != null; n = veio[n]) arestas.push([n, veio[n]]);
  return arestas;
}
const chave = (a, b) => [a, b].sort().join('|');

function hexagono(r) {
  return Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r * .9).toFixed(1)}`; }).join(' ');
}

export function iniciarArvore({ reduz }) {
  const svg = document.querySelector('#skill-tree');
  const tv = document.querySelector('#tv');
  const listaEl = document.querySelector('#tree-list');
  const foraEl = document.querySelector('#offtree-list');
  const dialogo = document.querySelector('#project-dialog');
  const dialogoImg = document.querySelector('#image-dialog');
  const { pos, naArvore } = layout();

  const linhasSkill = skillLinks.map(([a, b]) =>
    `<line class="edge-skill" data-k="${chave(a, b)}" x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}"/>`).join('');
  const linhasProj = naArvore.flatMap(p => p.skills.map(s =>
    `<line class="edge-proj" data-k="${p.id}|${s}" x1="${pos[p.id].x.toFixed(1)}" y1="${pos[p.id].y.toFixed(1)}" x2="${pos[s].x.toFixed(1)}" y2="${pos[s].y.toFixed(1)}"/>`)).join('');
  const nosSkill = skills.map(s => `<g class="skill${s.id === RAIZ ? ' root' : ''}" data-skill="${s.id}" transform="translate(${pos[s.id].x.toFixed(1)} ${pos[s.id].y.toFixed(1)})"><polygon points="${hexagono(s.id === RAIZ ? 62 : 54)}"/><text>${esc(s.label)}</text></g>`).join('');
  const nosProj = naArvore.map(p => {
    const { x, y, a } = pos[p.id];
    const cos = Math.cos(a), sin = Math.sin(a);
    const ancora = cos > .35 ? 'start' : cos < -.35 ? 'end' : 'middle';
    const lx = cos * 22, ly = sin * 26 + (ancora === 'middle' ? (sin > 0 ? 14 : -4) : 6);
    const nomes = p.skills.map(s => rotulo[s]).join(', ');
    return `<g class="proj" data-project="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}. Habilidades: ${esc(nomes)}. Abrir detalhes" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle class="hit" r="24"/><rect class="ring" x="-17" y="-17" width="34" height="34" transform="rotate(45)"/><rect class="dia" x="-11" y="-11" width="22" height="22" transform="rotate(45)"/>
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${ancora}">${esc(p.short)}</text></g>`;
  }).join('');
  svg.innerHTML = `<g>${linhasSkill}</g><g>${linhasProj}</g><g>${nosSkill}</g><g>${nosProj}</g>`;

  listaEl.innerHTML = naArvore.map(p => `<li><button class="tree-item" type="button" data-project="${p.id}"><strong>${esc(p.name)}</strong><span>${p.skills.map(s => esc(rotulo[s])).join(' · ')}</span></button></li>`).join('');
  foraEl.innerHTML = projects.filter(p => !p.skills.length).map(p => `<button class="term-btn" type="button" data-project="${p.id}">[ ${esc(p.name)} ]</button>`).join('');

  // ── acender caminhos
  const el = sel => svg.querySelector(sel);
  const acesos = new Set();
  const marcar = e => { if (e) { e.classList.add('on'); acesos.add(e); } };
  function apagar() { for (const e of acesos) e.classList.remove('on'); acesos.clear(); svg.classList.remove('lit'); }
  function acenderProjeto(id) {
    const p = porId[id];
    apagar();
    svg.classList.add('lit');
    marcar(el(`.proj[data-project="${id}"]`));
    const usadas = new Set(p.skills);
    for (const s of p.skills) {
      marcar(el(`.skill[data-skill="${s}"]`));
      marcar(el(`.edge-proj[data-k="${id}|${s}"]`));
      for (const [a, b] of caminho(s)) marcar(el(`.edge-skill[data-k="${chave(a, b)}"]`));
    }
    for (const [a, b] of skillLinks) if (usadas.has(a) && usadas.has(b)) marcar(el(`.edge-skill[data-k="${chave(a, b)}"]`));
    glitch();
  }
  function acenderSkill(sid) {
    apagar();
    svg.classList.add('lit');
    marcar(el(`.skill[data-skill="${sid}"]`));
    for (const p of naArvore) if (p.skills.includes(sid)) { marcar(el(`.proj[data-project="${p.id}"]`)); marcar(el(`.edge-proj[data-k="${p.id}|${sid}"]`)); }
  }

  // ── glitch de sinal na TV, limitado a hover/abertura e com intervalo mínimo
  let ultimoGlitch = 0;
  function glitch() {
    if (reduz.matches || tv.classList.contains('glitching')) return;
    const agora = performance.now();
    if (agora - ultimoGlitch < 280) return;
    ultimoGlitch = agora;
    tv.classList.add('glitching');
  }
  tv.addEventListener('animationend', e => { if (e.animationName === 'sinal') tv.classList.remove('glitching'); });

  let atual = null;
  svg.addEventListener('pointerover', e => {
    const proj = e.target.closest('.proj'), skill = e.target.closest('.skill');
    const alvo = proj ? 'p:' + proj.dataset.project : skill ? 's:' + skill.dataset.skill : null;
    if (alvo === atual) return;
    atual = alvo;
    if (proj) acenderProjeto(proj.dataset.project); else if (skill) acenderSkill(skill.dataset.skill); else apagar();
  });
  svg.addEventListener('pointerleave', () => { atual = null; apagar(); });
  svg.addEventListener('focusin', e => { const proj = e.target.closest('.proj'); if (proj) { atual = 'p:' + proj.dataset.project; acenderProjeto(proj.dataset.project); } });
  svg.addEventListener('focusout', e => { if (!svg.contains(e.relatedTarget)) { atual = null; apagar(); } });
  svg.addEventListener('keydown', e => {
    const proj = e.target.closest('.proj');
    if (proj && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abrir(proj.dataset.project); }
  });
  listaEl.addEventListener('pointerover', e => { if (e.target.closest('.tree-item')) glitch(); });

  // ── modal
  function abrir(id) {
    const p = porId[id];
    if (!p) return;
    glitch();
    document.querySelector('#dialog-category').textContent = `ARQUIVO://${p.id}.proj · ${categoria[p.category] || p.category}`;
    const habilidades = p.skills.length ? `<ul class="chips" aria-label="Habilidades usadas">${p.skills.map(s => `<li class="chip">${esc(rotulo[s])}</li>`).join('')}</ul>` : '';
    const tecnologias = p.stack.length ? `<ul class="chips" aria-label="Tecnologias">${p.stack.map(s => `<li class="chip stack">${esc(s)}</li>`).join('')}</ul>` : '';
    document.querySelector('#dialog-content').innerHTML = `
      <h2 id="dialog-title"><span class="glitch" data-text="${esc(p.name)}">${esc(p.name)}</span></h2>
      ${habilidades}${tecnologias}
      <h3>// DESCRIÇÃO</h3><p>${esc(p.description)}</p><p>${esc(p.detail)}</p>
      <h3>// MOTIVAÇÃO</h3><p>${esc(p.motivation)}</p>
      <h3>// ${p.kind === 'Em preparação' ? 'ESTADO ATUAL' : 'O QUE TEM'}</h3><ul>${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      ${p.image ? `<button class="shot" type="button" data-expand="${esc(p.id)}" aria-label="Ampliar captura de ${esc(p.name)}"><img src="${imagem(p.image)}" alt="${esc(p.caption)}" width="1440" height="960" loading="lazy"></button>` : ''}
      <p class="caption">${esc(p.caption)}</p>
      <div class="actions">${p.repo ? `<a class="btn-repo" href="https://github.com/${esc(p.repo)}" target="_blank" rel="noopener noreferrer">[ ABRIR REPOSITÓRIO ]</a>` : '<p class="private">// CÓDIGO PRIVADO: SEM REPOSITÓRIO PÚBLICO</p>'}</div>`;
    dialogo.showModal();
    dialogo.scrollTop = 0;
  }
  function ampliar(p) {
    const img = document.querySelector('#expanded-image');
    img.src = imagem(p.image);
    img.alt = p.caption;
    document.querySelector('#expanded-caption').textContent = p.caption;
    dialogoImg.showModal();
  }
  document.addEventListener('click', e => {
    const alvo = e.target.closest('[data-project]');
    if (alvo) return abrir(alvo.dataset.project);
    const zoom = e.target.closest('[data-expand]');
    if (zoom) ampliar(porId[zoom.dataset.expand]);
  });
  document.querySelector('#close-dialog').addEventListener('click', () => dialogo.close());
  document.querySelector('#close-image').addEventListener('click', () => dialogoImg.close());
  for (const d of [dialogo, dialogoImg]) d.addEventListener('click', e => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
}
