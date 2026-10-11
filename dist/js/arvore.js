// Árvore de habilidades em forma de roda, na tela do terminal, com duas telas separadas:
// - desktop: roda em SVG com ficha ao lado; hover ou foco acendem o caminho até o centro, põem uma mira no nó e
//   preenchem a ficha (com a miniatura da captura); no toque, o primeiro toque seleciona e o segundo abre;
// - celular: roda compacta só de enfeite, abas grandes por área, linguagens como filtro e cartões com miniaturas.
// Do centro saem as três áreas; em cada área, as linguagens que ela usa; na borda, os projetos, ligados às
// linguagens que usam. As ligações são trilhas de uma placa redonda: um trecho no raio, outro no arco e via nas
// dobras, com cada linguagem correndo na própria faixa. Tudo é desenhado uma vez; a interação só troca classes,
// e a tela fica parada: nada de glitch ou chiado ao passar de um nó para outro.
import { projects, areas, languages } from '../data.js';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const captura = (nome, pasta = '') => './assets/screenshots/' + pasta + encodeURIComponent(nome);
const porId = Object.fromEntries(projects.map(p => [p.id, p]));
const porArea = Object.fromEntries(areas.map(a => [a.id, a]));
const ling = Object.fromEntries(languages.map(l => [l.id, l]));
const categoria = { Web: 'WEB & FULL-STACK', Desktop: 'DESKTOP & MOBILE', Backend: 'APIS & AUTOMAÇÃO' };
const linguagensDe = ls => ls.map(l => esc(ling[l].label)).join(' · ');
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

const LARGURA = 960;
const C = { x: 480, y: 350 };
const R = { nucleo: 46, area: 112, ling: 200, proj: 290 };
const FAIXA = { base: R.ling + 24, passo: 10 };
const GRAU = Math.PI / 180;
const f = v => v.toFixed(1);
const ponto = (r, a) => ({ x: C.x + Math.cos(a) * r, y: C.y + Math.sin(a) * r });
const xy = p => `${f(p.x)} ${f(p.y)}`;

// Cada área ganha uma fatia proporcional aos projetos (e às linguagens) que tem; a primeira fica à esquerda.
// Linguagens se espalham pela fatia na ordem da área; projetos ficam perto da média das suas linguagens.
function layout() {
  const naRoda = projects.filter(p => p.area);
  const peso = a => Math.max(naRoda.filter(p => p.area === a.id).length, a.langs.length * 2, 2.5);
  const total = areas.reduce((t, a) => t + peso(a), 0);
  const setores = {}, pos = {}, ordem = {};
  let inicio = 180 - peso(areas[0]) / total * 180;
  for (const a of areas) {
    const arco = peso(a) / total * 360;
    const a0 = inicio * GRAU, a1 = (inicio + arco) * GRAU, margem = Math.min(7, arco / 5) * GRAU, util = a1 - a0 - 2 * margem;
    setores[a.id] = { a0, a1, meio: (a0 + a1) / 2 };
    a.langs.forEach((l, j) => { pos[`${a.id}|${l}`] = a0 + margem + (j + .5) * util / a.langs.length; });
    const indice = l => a.langs.indexOf(l);
    ordem[a.id] = naRoda.filter(p => p.area === a.id)
      .map((p, i) => ({ p, i, chave: p.langs.reduce((t, l) => t + indice(l), 0) / p.langs.length }))
      .sort((u, v) => u.chave - v.chave || u.i - v.i).map(({ p }) => p);
    ordem[a.id].forEach((p, i, lista) => { pos[p.id] = a0 + margem + (i + .5) * util / lista.length; });
    inicio += arco;
  }
  return { setores, pos, ordem, naRoda };
}

// Trilha de placa redonda: sai pelo raio, corre no arco de raio rm e entra pelo raio do destino, com via nas dobras.
function trilha(r1, a1, r2, a2, rm) {
  const p1 = ponto(r1, a1), p2 = ponto(r2, a2);
  if (Math.abs(a2 - a1) < 1e-3) return { d: `M${xy(p1)} L${xy(p2)}`, vias: [] };
  const q1 = ponto(rm, a1), q2 = ponto(rm, a2);
  return { d: `M${xy(p1)} L${xy(q1)} A${rm} ${rm} 0 ${Math.abs(a2 - a1) > Math.PI ? 1 : 0} ${a2 > a1 ? 1 : 0} ${xy(q2)} L${xy(p2)}`, vias: [q1, q2] };
}
const ligacao = (classe, chave, { d, vias }) =>
  `<g class="lig ${classe}" data-k="${chave}"><path d="${d}"/>${vias.map(v => `<circle cx="${f(v.x)}" cy="${f(v.y)}" r="3.5"/>`).join('')}</g>`;

function hexagono(rx, ry) {
  return Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i; return `${f(Math.cos(a) * rx)},${f(Math.sin(a) * ry)}`; }).join(' ');
}
// Etiqueta de linguagem com cantos chanfrados, do tamanho do nome.
function etiqueta(w, h = 30) {
  const x = w / 2, y = h / 2, c = 6;
  return `${f(-x + c)},${-y} ${f(x - c)},${-y} ${f(x)},${-y + c} ${f(x)},${y - c} ${f(x - c)},${y} ${f(-x + c)},${y} ${f(-x)},${y - c} ${f(-x)},${-y + c}`;
}
// Mira de seleção, como nos menus de jogo: quatro cantos em volta do nó.
function mira(w, h) {
  const c = Math.min(11, w * .4);
  return `M${f(-w)} ${f(-h + c)}V${f(-h)}H${f(-w + c)}M${f(w - c)} ${f(-h)}H${f(w)}V${f(-h + c)}M${f(w)} ${f(h - c)}V${f(h)}H${f(w - c)}M${f(-w + c)} ${f(h)}H${f(-w)}V${f(h - c)}`;
}

// Fundo da roda: fatias apagadas de cada área, órbitas, divisas e o mostrador em volta do núcleo.
function mostrador(setores) {
  const fatia = (r0, r1, a0, a1) => {
    const g = a1 - a0 > Math.PI ? 1 : 0;
    return `M${xy(ponto(r0, a0))} L${xy(ponto(r1, a0))} A${r1} ${r1} 0 ${g} 1 ${xy(ponto(r1, a1))} L${xy(ponto(r0, a1))} A${r0} ${r0} 0 ${g} 0 ${xy(ponto(r0, a0))} Z`;
  };
  let g = areas.map(a => `<path class="fatia a-${a.id}" d="${fatia(64, 308, setores[a.id].a0, setores[a.id].a1)}"/>`).join('');
  g += [R.area, R.ling, R.proj].map(r => `<circle class="orbita" cx="${C.x}" cy="${C.y}" r="${r}"/>`).join('');
  for (let i = 0; i < 72; i++) { const a = i * 5 * GRAU, p1 = ponto(56, a), p2 = ponto(i % 6 ? 61 : 67, a); g += `<line class="marca" x1="${f(p1.x)}" y1="${f(p1.y)}" x2="${f(p2.x)}" y2="${f(p2.y)}"/>`; }
  for (const a of areas) { const p1 = ponto(64, setores[a.id].a0), p2 = ponto(318, setores[a.id].a0); g += `<line class="divisa" x1="${f(p1.x)}" y1="${f(p1.y)}" x2="${f(p2.x)}" y2="${f(p2.y)}"/>`; }
  return `<g class="mostrador">${g}</g>`;
}

// Desenha a roda. Na compacta (celular) os projetos não têm rótulo nem foco e as linguagens viram siglas.
function desenhar({ setores, pos, naRoda }, compacta = false) {
  const ligNucleo = areas.map(a => { const m = setores[a.id].meio; return ligacao(`a-${a.id}`, `nucleo|${a.id}`, { d: `M${xy(ponto(R.nucleo, m))} L${xy(ponto(R.area, m))}`, vias: [] }); }).join('');
  const ligArea = areas.flatMap(a => a.langs.map(l =>
    ligacao(`a-${a.id}`, `${a.id}|${l}`, trilha(R.area, setores[a.id].meio, R.ling, pos[`${a.id}|${l}`], (R.area + R.ling) / 2)))).join('');
  const ligProj = naRoda.flatMap(p => p.langs.map(l =>
    ligacao(`a-${p.area}`, `${p.area}|${l}|${p.id}`, trilha(R.ling, pos[`${p.area}|${l}`], R.proj, pos[p.id], FAIXA.base + porArea[p.area].langs.indexOf(l) * FAIXA.passo)))).join('');
  const noNucleo = `<g class="nucleo" data-no="nucleo" transform="translate(${C.x} ${C.y})"><circle class="halo" r="${R.nucleo}"/><circle r="${R.nucleo - 9}"/><text>G·A</text><path class="mira" d="${mira(R.nucleo + 7, R.nucleo + 7)}"/></g>`;
  const nosArea = areas.map(a => `<g class="area a-${a.id}" data-area="${a.id}" transform="translate(${xy(ponto(R.area, setores[a.id].meio))})"><polygon points="${hexagono(66, 52)}"/><text>${esc(a.label)}</text><path class="mira" d="${mira(74, 54)}"/></g>`).join('');
  const nosLing = areas.flatMap(a => a.langs.map(l => {
    const nome = compacta ? ling[l].code : ling[l].label.toUpperCase();
    const w = compacta ? nome.length * 16 + 28 : nome.length * 9.5 + 24, h = compacta ? 40 : 30;
    return `<g class="ling a-${a.id}" data-ling="${a.id}|${l}" transform="translate(${xy(ponto(R.ling, pos[`${a.id}|${l}`]))})"><polygon points="${etiqueta(w, h)}"/><text>${esc(nome)}</text><path class="mira" d="${mira(w / 2 + 7, h / 2 + 7)}"/></g>`;
  })).join('');
  const nosProj = naRoda.map(p => {
    const a = pos[p.id], { x, y } = ponto(R.proj, a), cos = Math.cos(a), sin = Math.sin(a);
    const forma = `<circle class="hit" r="30"/><rect class="ring" x="-17" y="-17" width="34" height="34" transform="rotate(45)"/><rect class="dia" x="-11" y="-11" width="22" height="22" transform="rotate(45)"/><path class="mira" d="${mira(27, 27)}"/>`;
    if (compacta) return `<g class="proj a-${p.area}" data-project="${p.id}" transform="translate(${f(x)} ${f(y)})">${forma}</g>`;
    const ancora = cos > .2 ? 'start' : cos < -.2 ? 'end' : 'middle';
    const lx = cos * 25, ly = sin * 25 + (ancora === 'middle' ? (sin > 0 ? 16 : -6) : 7);
    return `<g class="proj a-${p.area}" data-project="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}. Área: ${esc(porArea[p.area].name)}. Linguagens: ${esc(p.langs.map(l => ling[l].label).join(', '))}. Abrir detalhes" transform="translate(${f(x)} ${f(y)})">
      ${forma}<text x="${f(lx)}" y="${f(ly)}" text-anchor="${ancora}">${esc(p.short)}</text></g>`;
  }).join('');
  return `${mostrador(setores)}<g>${ligNucleo}${ligArea}</g><g>${ligProj}</g><g>${noNucleo}${nosArea}${nosLing}</g><g>${nosProj}</g>`;
}

// Acende caminhos numa roda (as duas telas usam): o nó escolhido ganha a mira, o resto apaga.
function realce(svg, { ordem }) {
  const el = sel => svg.querySelector(sel);
  const acesos = new Set();
  let selecionado = null;
  const marcar = e => { if (e) { e.classList.add('on'); acesos.add(e); } };
  const ligar = chave => { const e = el(`.lig[data-k="${chave}"]`); if (e) { marcar(e); e.parentNode.appendChild(e); } };
  const selecionar = no => { selecionado = no; no.classList.add('sel'); marcar(no); svg.classList.add('lit'); };
  const r = {
    apagar() {
      for (const e of acesos) e.classList.remove('on');
      acesos.clear();
      selecionado?.classList.remove('sel');
      selecionado = null;
      svg.classList.remove('lit');
    },
    projeto(id) {
      const p = porId[id], aid = p.area;
      r.apagar();
      selecionar(el(`.proj[data-project="${id}"]`));
      marcar(el(`.area[data-area="${aid}"]`)); marcar(el('.nucleo')); ligar(`nucleo|${aid}`);
      for (const l of p.langs) { marcar(el(`.ling[data-ling="${aid}|${l}"]`)); ligar(`${aid}|${l}`); ligar(`${aid}|${l}|${id}`); }
    },
    ling(chave) {
      const [aid, l] = chave.split('|');
      r.apagar();
      selecionar(el(`.ling[data-ling="${chave}"]`));
      marcar(el(`.area[data-area="${aid}"]`)); marcar(el('.nucleo')); ligar(`nucleo|${aid}`); ligar(chave);
      for (const p of ordem[aid]) if (p.langs.includes(l)) { marcar(el(`.proj[data-project="${p.id}"]`)); ligar(`${chave}|${p.id}`); }
    },
    area(aid) {
      r.apagar();
      selecionar(el(`.area[data-area="${aid}"]`));
      marcar(el('.nucleo')); ligar(`nucleo|${aid}`);
      for (const l of porArea[aid].langs) { marcar(el(`.ling[data-ling="${aid}|${l}"]`)); ligar(`${aid}|${l}`); }
      for (const p of ordem[aid]) { marcar(el(`.proj[data-project="${p.id}"]`)); for (const l of p.langs) ligar(`${aid}|${l}|${p.id}`); }
    },
    nucleo() {
      r.apagar();
      selecionar(el('.nucleo'));
      for (const a of areas) { marcar(el(`.area[data-area="${a.id}"]`)); ligar(`nucleo|${a.id}`); }
    }
  };
  return r;
}

export function iniciarArvore() {
  const dados = layout();
  iniciarDesktop(dados);
  iniciarCelular(dados);
  document.querySelector('#offtree-list').innerHTML = projects.filter(p => !p.area).map(p => `<button class="term-btn" type="button" data-project="${p.id}">[ ${esc(p.name)} ]</button>`).join('');
  iniciarModal();
}

// ── tela do desktop: roda com rótulos e ficha ao lado
function iniciarDesktop(dados) {
  const { ordem, naRoda } = dados;
  const svg = document.querySelector('#skill-tree');
  const roda = document.querySelector('#roda');
  const fichaEl = document.querySelector('#ficha');
  const osd = document.querySelector('#osd-live');
  svg.innerHTML = desenhar(dados);
  const r = realce(svg, dados);

  // Depois que a fonte carrega: etiquetas do tamanho do nome e rótulos que sairiam da tela vão para fora do losango.
  document.fonts.ready.then(() => {
    for (const g of svg.querySelectorAll('.ling')) {
      const t = g.querySelector('text').getBBox();
      if (!t.width) continue;
      const w = Math.ceil(t.width + 24);
      g.querySelector('polygon').setAttribute('points', etiqueta(w));
      g.querySelector('.mira').setAttribute('d', mira(w / 2 + 7, 22));
    }
    for (const t of svg.querySelectorAll('.proj text')) {
      const caixa = t.getBBox();
      if (!caixa.width) continue;
      const m = t.parentNode.transform.baseVal.consolidate().matrix;
      if (m.e + caixa.x < 6 || m.e + caixa.x + caixa.width > LARGURA - 6) { t.setAttribute('text-anchor', 'middle'); t.setAttribute('x', '0'); t.setAttribute('y', m.f > C.y ? '42' : '-30'); }
    }
  });

  // ficha: muda com o hover, o foco ou o toque e volta à legenda quando o ponteiro sai da roda
  const padrao = fichaEl.innerHTML;
  const pct = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  const tags = ls => ls.map(l => `<span class="tag-ling">${esc(ling[l].label)}</span>`).join('');
  const barra = (n, total) => `<span class="barra">${Array.from({ length: total }, (_, i) => `<i${i < n ? ' class="on"' : ''}></i>`).join('')}</span>`;
  const preencher = (classe, tipo, nome, corpo) => { fichaEl.className = `ficha ${classe}`; fichaEl.innerHTML = `<p class="ficha-tipo">${tipo}</p><p class="ficha-nome">${nome}</p>${corpo}`; };
  const sinc = p => p.langs.length / porArea[p.area].langs.length * 100;
  const fichas = {
    projeto(p) {
      const a = porArea[p.area];
      preencher(`a-${a.id}`, `PROJETO · ${esc(a.label)}`, esc(p.name), `${p.image ? `<img class="ficha-mini" src="${captura(p.image, 'miniaturas/')}" alt="" width="360" height="240" decoding="async">` : ''}
        <p class="ficha-desc">${esc(p.description)}</p>
        <dl class="ficha-dados"><div><dt>LINGUAGENS</dt><dd>${tags(p.langs)}</dd></div><div><dt>STACK</dt><dd>${p.stack.map(esc).join(' · ')}</dd></div>
        <div><dt>SINC.</dt><dd>${barra(p.langs.length, a.langs.length)} ${pct.format(sinc(p))}%</dd></div></dl>
        <p class="ficha-acao">[ ENTER ] ou clique para abrir</p>`);
      osd.textContent = `● SINC. ${pct.format(sinc(p))}%`;
    },
    ling(chave) {
      const [aid, l] = chave.split('|'), usam = ordem[aid].filter(p => p.langs.includes(l));
      preencher(`a-${aid}`, `LINGUAGEM · ${esc(porArea[aid].label)}`, esc(ling[l].label), `<p class="ficha-desc">${usam.length === 1 ? 'Usada em 1 projeto' : `Usada em ${usam.length} projetos`} da área:</p>
        <ul class="ficha-lista">${usam.map(p => `<li>${esc(p.name)}</li>`).join('')}</ul>`);
      osd.textContent = `● ${plural(usam.length, 'PROJETO', 'PROJETOS')}`;
    },
    area(aid) {
      const a = porArea[aid];
      preencher(`a-${aid}`, 'ÁREA', esc(a.label), `<p class="ficha-desc">${esc(a.short)}</p>
        <dl class="ficha-dados"><div><dt>LINGUAGENS</dt><dd>${tags(a.langs)}</dd></div><div><dt>PROJETOS</dt><dd>${ordem[aid].length}</dd></div></dl>`);
      osd.textContent = `● ${plural(ordem[aid].length, 'PROJETO', 'PROJETOS')} · ${plural(a.langs.length, 'LINGUAGEM', 'LINGUAGENS')}`;
    },
    nucleo() {
      preencher('', 'NÚCLEO', 'Glaydson de Oliveira', `<p class="ficha-desc">Desenvolvedor full-stack em Manaus. Cada área puxa as linguagens que usa, e cada linguagem, os projetos feitos com ela.</p>
        <dl class="ficha-dados"><div><dt>ÁREAS</dt><dd>${areas.length}</dd></div><div><dt>LINGUAGENS</dt><dd>${new Set(areas.flatMap(a => a.langs)).size}</dd></div>
        <div><dt>PROJETOS</dt><dd>${naRoda.length} na roda, ${projects.length - naRoda.length} fora dela</dd></div></dl>`);
      osd.textContent = `● ${plural(areas.length, 'ÁREA', 'ÁREAS')}`;
    }
  };
  function apagar() { r.apagar(); osd.textContent = '● AO VIVO'; fichaEl.className = 'ficha'; fichaEl.innerHTML = padrao; }
  const chaveDo = no => no.dataset.project ? 'p:' + no.dataset.project : no.dataset.ling ? 'l:' + no.dataset.ling : no.dataset.area ? 'a:' + no.dataset.area : 'n';
  function acender(no) {
    if (no.dataset.project) { r.projeto(no.dataset.project); fichas.projeto(porId[no.dataset.project]); }
    else if (no.dataset.ling) { r.ling(no.dataset.ling); fichas.ling(no.dataset.ling); }
    else if (no.dataset.area) { r.area(no.dataset.area); fichas.area(no.dataset.area); }
    else { r.nucleo(); fichas.nucleo(); }
  }

  // Mouse: o espaço vazio entre dois nós mantém a última seleção (dá para ler a ficha); sair da roda apaga.
  // Toque: o primeiro toque num nó seleciona; o segundo toque no mesmo projeto abre o modal. A seleção de antes
  // do toque é guardada no pointerdown, porque o foco que o toque dá ao losango já o selecionaria.
  let atual = null, toque = false, antes = null;
  svg.addEventListener('pointerdown', e => { toque = e.pointerType !== 'mouse'; antes = atual; });
  svg.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const no = e.target.closest('.proj, .ling, .area, .nucleo');
    if (!no || chaveDo(no) === atual) return;
    atual = chaveDo(no);
    acender(no);
  });
  svg.addEventListener('click', e => {
    const no = e.target.closest('.proj, .ling, .area, .nucleo');
    if (!no || !toque) return;
    if (no.dataset.project && chaveDo(no) === antes) return;
    e.stopPropagation();
    atual = chaveDo(no);
    acender(no);
  });
  roda.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { atual = null; apagar(); } });
  svg.addEventListener('focusin', e => { const proj = e.target.closest('.proj'); if (proj) { atual = chaveDo(proj); acender(proj); } });
  svg.addEventListener('focusout', e => { if (!svg.contains(e.relatedTarget)) { atual = null; apagar(); } });
  svg.addEventListener('keydown', e => {
    const proj = e.target.closest('.proj');
    if (proj && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abrirProjeto(proj.dataset.project); }
  });
}

// ── tela do celular: roda compacta de enfeite, abas por área, linguagens como filtro e cartões com miniatura
function iniciarCelular(dados) {
  const { ordem } = dados;
  const mini = document.querySelector('#mini-tree');
  const abasEl = document.querySelector('#abas');
  const descEl = document.querySelector('#area-desc');
  const filtroEl = document.querySelector('#filtro-ling');
  const resumoEl = document.querySelector('#movel-resumo');
  const listaEl = document.querySelector('#tree-list');
  mini.innerHTML = desenhar(dados, true);
  const r = realce(mini, dados);
  let areaAtiva = areas[0].id, lingAtiva = null;

  abasEl.innerHTML = areas.map(a => `<button class="aba a-${a.id}" type="button" data-aba="${a.id}" aria-pressed="false">${esc(a.label)}<span>${plural(ordem[a.id].length, 'projeto', 'projetos')}</span></button>`).join('');
  function listar() {
    const lista = ordem[areaAtiva].filter(p => !lingAtiva || p.langs.includes(lingAtiva));
    listaEl.innerHTML = lista.map(p => `<li><button class="tree-item cartao a-${p.area}" type="button" data-project="${p.id}">
      ${p.image ? `<img src="${captura(p.image, 'miniaturas/')}" alt="" width="96" height="64" loading="lazy" decoding="async">` : '<span class="sem-mini" aria-hidden="true"></span>'}
      <span class="cartao-texto"><strong>${esc(p.name)}</strong><span class="cartao-ling">${linguagensDe(p.langs)}</span><span class="cartao-desc">${esc(p.description)}</span></span></button></li>`).join('');
    resumoEl.textContent = `${plural(lista.length, 'projeto', 'projetos')} em ${porArea[areaAtiva].name}${lingAtiva ? ` com ${ling[lingAtiva].label}` : ''}`;
    lingAtiva ? r.ling(`${areaAtiva}|${lingAtiva}`) : r.area(areaAtiva);
  }
  function mostrarArea(aid) {
    areaAtiva = aid;
    lingAtiva = null;
    for (const b of abasEl.children) b.setAttribute('aria-pressed', String(b.dataset.aba === aid));
    const a = porArea[aid];
    descEl.textContent = a.short;
    filtroEl.innerHTML = a.langs.map(l => `<button class="filtro a-${aid}" type="button" data-filtro="${l}" aria-pressed="false">${esc(ling[l].label)}<span>${ordem[aid].filter(p => p.langs.includes(l)).length}</span></button>`).join('');
    listar();
  }
  abasEl.addEventListener('click', e => { const b = e.target.closest('[data-aba]'); if (b) mostrarArea(b.dataset.aba); });
  filtroEl.addEventListener('click', e => {
    const b = e.target.closest('[data-filtro]');
    if (!b) return;
    lingAtiva = lingAtiva === b.dataset.filtro ? null : b.dataset.filtro;
    for (const x of filtroEl.children) x.setAttribute('aria-pressed', String(x.dataset.filtro === lingAtiva));
    listar();
  });
  mostrarArea(areaAtiva);
}

// ── modal de projeto (as duas telas e a fileira de fora da roda abrem o mesmo)
let abrirProjeto = () => {};
function iniciarModal() {
  const dialogo = document.querySelector('#project-dialog');
  const dialogoImg = document.querySelector('#image-dialog');
  abrirProjeto = id => {
    const p = porId[id];
    if (!p) return;
    const area = p.area ? porArea[p.area] : null;
    document.querySelector('#dialog-category').textContent = `ARQUIVO://${p.id}.proj · ${area ? area.label : categoria[p.category] || p.category}`;
    const marcadores = (area ? `<li class="chip chip-area a-${area.id}">${esc(area.label)}</li>` : '') + p.langs.map(l => `<li class="chip">${esc(ling[l].label)}</li>`).join('');
    const habilidades = marcadores ? `<ul class="chips" aria-label="Área e linguagens">${marcadores}</ul>` : '';
    const tecnologias = p.stack.length ? `<ul class="chips" aria-label="Tecnologias">${p.stack.map(s => `<li class="chip stack">${esc(s)}</li>`).join('')}</ul>` : '';
    const imagem = p.image ? `<button class="shot" type="button" data-expand="${esc(p.id)}" aria-label="Ampliar captura de ${esc(p.name)}"><img src="${captura(p.image, 'medias/')}" srcset="${captura(p.image, 'medias/')} 720w, ${captura(p.image)} 1440w" sizes="(max-width: 880px) calc(100vw - 72px), 760px" alt="${esc(p.caption)}" width="1440" height="960" loading="lazy"></button>` : '';
    document.querySelector('#dialog-content').innerHTML = `
      <h2 id="dialog-title"><span class="glitch" data-text="${esc(p.name)}">${esc(p.name)}</span></h2>
      ${habilidades}${tecnologias}
      <h3>// DESCRIÇÃO</h3><p>${esc(p.description)}</p><p>${esc(p.detail)}</p>
      <h3>// MOTIVAÇÃO</h3><p class="inscricao">${esc(p.motivation)}</p>
      <h3>// ${p.kind === 'Em preparação' ? 'ESTADO ATUAL' : 'O QUE TEM'}</h3><ul>${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      ${imagem}<p class="caption">${esc(p.caption)}</p>
      <div class="actions">${p.repo ? `<a class="btn-repo" href="https://github.com/${esc(p.repo)}" target="_blank" rel="noopener noreferrer">[ ABRIR REPOSITÓRIO ]</a>` : '<p class="private">// CÓDIGO PRIVADO: SEM REPOSITÓRIO PÚBLICO</p>'}</div>`;
    dialogo.showModal();
    dialogo.scrollTop = 0;
  };
  function ampliar(p) {
    const img = document.querySelector('#expanded-image');
    img.src = captura(p.image);
    img.alt = p.caption;
    document.querySelector('#expanded-caption').textContent = p.caption;
    dialogoImg.showModal();
  }
  document.addEventListener('click', e => {
    const alvo = e.target.closest('[data-project]');
    if (alvo) return abrirProjeto(alvo.dataset.project);
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
