// Cenas do site geradas como SVG e depois renderizadas em WebP por scripts/arte.mjs.
// Cada cena devolve { nome, w, h, alfa, svg }. O sorteio é determinístico (semente fixa).
import { simbolos } from './simbolos.mjs';

export const cor = {
  preto: '#0a0a0a', fosforo: '#39ff6a', vermelho: '#ff2a2a', magenta: '#ff2bd6',
  ciano: '#22e6ff', cinza: '#8d8f8c', ferrugem: '#8a3f1d', papel: '#cfc6ae'
};

function sorteio(semente) {
  let a = semente >>> 0;
  const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  r.entre = (min, max) => min + r() * (max - min);
  r.um = lista => lista[Math.floor(r() * lista.length)];
  return r;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const usar = (id, x, y, w, h, fill, extra = '') => `<use href="#${id}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" color="${fill}" ${extra}/>`;
const texto = (t, x, y, { fonte = 'BlackOps', tam = 40, fill = cor.vermelho, rot = 0, ancora = 'start', extra = '' } = {}) =>
  `<text x="${x}" y="${y}" font-family="${fonte}" font-size="${tam}" fill="${fill}" text-anchor="${ancora}" transform="rotate(${rot} ${x} ${y})" ${extra}>${esc(t)}</text>`;

function filtros() {
  return `
  <filter id="tinta" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="2" result="s"/>
    <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.25" result="furos"/>
    <feComposite in="d" in2="furos" operator="in" result="gasta"/>
    <feGaussianBlur in="gasta" stdDeviation="2.2" result="nevoa"/>
    <feComponentTransfer in="nevoa" result="nevoa2"><feFuncA type="linear" slope=".45"/></feComponentTransfer>
    <feMerge><feMergeNode in="nevoa2"/><feMergeNode in="gasta"/></feMerge>
  </filter>
  <filter id="papelf" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="10" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="ferrugem" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".011 .028" numOctaves="4" seed="11"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .52  0 0 0 0 .23  0 0 0 0 .09  4.2 0 0 0 -2.15"/>
  </filter>
  <filter id="ferrugem2" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".02 .05" numOctaves="4" seed="23"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .22  0 0 0 0 .09  0 0 0 0 .04  5 0 0 0 -2.75"/>
  </filter>
  <filter id="grao" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <filter id="sujeira" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".006 .02" numOctaves="5" seed="31"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -1.05"/>
  </filter>
  <filter id="madeira" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".004 .09" numOctaves="4" seed="17"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .14  0 0 0 0 .07  0 0 0 0 .03  2.2 0 0 0 -.75"/>
  </filter>
  <filter id="sombra" x="-20%" y="-20%" width="150%" height="150%">
    <feOffset in="SourceAlpha" dx="16" dy="20" result="o"/>
    <feFlood flood-color="#000" flood-opacity=".72"/><feComposite in2="o" operator="in" result="s"/>
    <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="sombraP" x="-20%" y="-20%" width="150%" height="150%">
    <feOffset in="SourceAlpha" dx="6" dy="8" result="o"/>
    <feFlood flood-color="#000" flood-opacity=".7"/><feComposite in2="o" operator="in" result="s"/>
    <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <pattern id="pontos" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.7" fill="#111"/></pattern>
  <pattern id="pontosV" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.6" fill="${cor.vermelho}"/></pattern>
  <pattern id="listras" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="14" fill="#111"/></pattern>`;
}

const grao = (w, h, op = .22) => `<rect width="${w}" height="${h}" filter="url(#grao)" opacity="${op}" style="mix-blend-mode:overlay"/>`;

function papelRasgado(r, x, y, w, h, fill, rot = 0, conteudo = '') {
  const pts = [];
  const passo = 18;
  for (let i = 0; i <= w; i += passo) pts.push([x + i, y + r.entre(-4, 4)]);
  for (let i = 0; i <= h; i += passo) pts.push([x + w + r.entre(-4, 4), y + i]);
  for (let i = w; i >= 0; i -= passo) pts.push([x + i, y + h + r.entre(-4, 4)]);
  for (let i = h; i >= 0; i -= passo) pts.push([x + r.entre(-4, 4), y + i]);
  const cx = x + w / 2, cy = y + h / 2;
  return `<g transform="rotate(${rot} ${cx} ${cy})" filter="url(#sombraP)"><polygon points="${pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}" fill="${fill}"/>${conteudo}</g>`;
}

function fita(x, y, w, rot) {
  return `<rect x="${x}" y="${y}" width="${w}" height="22" fill="#d8d2b8" opacity=".62" transform="rotate(${rot} ${x + w / 2} ${y + 11})"/>`;
}

function escorrido(r, x, y, largura, fill, n = 5) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const xx = x + r() * largura, comp = r.entre(14, 70), esp = r.entre(2, 4.5);
    s += `<rect x="${xx.toFixed(1)}" y="${y}" width="${esp.toFixed(1)}" height="${comp.toFixed(1)}" fill="${fill}"/><circle cx="${(xx + esp / 2).toFixed(1)}" cy="${(y + comp).toFixed(1)}" r="${(esp * .8).toFixed(1)}" fill="${fill}"/>`;
  }
  return s;
}

function arranhoes(r, w, h, n, fill = '#d9d9d0', op = .22) {
  let s = `<g stroke="${fill}" stroke-width="1" opacity="${op}" fill="none">`;
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, dx = r.entre(-80, 80), dy = r.entre(-20, 20);
    s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q${(dx / 2).toFixed(0)} ${(dy * 2).toFixed(0)} ${dx.toFixed(0)} ${dy.toFixed(0)}"/>`;
  }
  return s + '</g>';
}

function svg(w, h, corpo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${filtros()}${simbolos}</defs>${corpo}</svg>`;
}

// ───────────────────────── Portão (encaixa no vão da fachada) ─────────────────────────
export function portao() {
  const w = 1280, h = 860, r = sorteio(2003);
  let s = `<rect width="${w}" height="${h}" fill="#3a3e41"/>`;
  for (let y = 0; y < h - 50; y += 44) {
    s += `<rect y="${y}" width="${w}" height="7" fill="#5a5f63"/><rect y="${y + 7}" width="${w}" height="3" fill="#6d7276"/>`;
    s += `<rect y="${y + 21}" width="${w}" height="2" fill="#2f3235"/><rect y="${y + 33}" width="${w}" height="11" fill="#222528"/>`;
  }
  s += `<rect width="${w}" height="${h}" filter="url(#ferrugem)" opacity=".5"/>`;
  s += `<rect width="${w}" height="${h}" filter="url(#ferrugem2)" opacity=".7"/>`;
  for (let i = 0; i < 40; i++) {
    const x = r() * w;
    s += `<rect x="${x.toFixed(0)}" y="${r.entre(0, 300).toFixed(0)}" width="${r.entre(1, 5).toFixed(1)}" height="${r.entre(120, 600).toFixed(0)}" fill="#120a06" opacity="${r.entre(.12, .35).toFixed(2)}"/>`;
  }
  // grafite
  let g = '';
  // colagem de zine à esquerda
  g += papelRasgado(r, 40, 52, 250, 330, cor.papel, -4,
    `<rect x="52" y="64" width="226" height="306" fill="url(#pontos)" opacity=".35"/>
     ${usar('androide', 70, 92, 180, 222, '#111', 'style="--corte:#cfc6ae"')}
     ${texto('ZINE Nº 03', 60, 358, { tam: 26, fill: '#111' })}
     ${texto('BITS · NEON · RUA', 62, 86, { fonte: 'Pixel', tam: 14, fill: cor.vermelho })}`);
  g += papelRasgado(r, 210, 320, 190, 150, cor.vermelho, 6,
    `${usar('olho', 245, 334, 120, 70, '#111', 'style="--corte:#ff2a2a"')}
     ${texto('VIGIADO', 305, 432, { fonte: 'Pixel', tam: 18, fill: '#111', ancora: 'middle' })}
     ${texto('24/7', 305, 456, { fonte: 'Pixel', tam: 18, fill: '#111', ancora: 'middle' })}`);
  g += papelRasgado(r, 30, 420, 200, 120, '#151515', -7,
    `${texto('SEM', 46, 470, { tam: 34, fill: cor.fosforo })}${texto('SINAL', 46, 512, { tam: 40, fill: cor.fosforo })}`);
  g += fita(70, 40, 90, -12) + fita(240, 300, 80, 18) + fita(40, 410, 70, -20);
  // faixa central
  g += `<g filter="url(#tinta)">${usar('planeta', 565, 26, 150, 108, cor.ciano, 'style="--corte:#3a3e41"')}
    ${texto('HIGH TECH', 390, 205, { tam: 70, fill: cor.magenta, rot: -2 })}
    ${texto('LOW LIFE', 535, 270, { tam: 78, fill: cor.vermelho, rot: -2 })}
    ${escorrido(r, 545, 264, 400, cor.vermelho, 9)}${escorrido(r, 400, 205, 400, cor.magenta, 6)}</g>`;
  // androide, parabólica e sinal à direita
  g += `<g filter="url(#tinta)">${usar('robo', 970, 110, 200, 300, cor.fosforo, 'style="--corte:#3a3e41"')}
    ${usar('estrela', 1150, 70, 60, 60, cor.vermelho)}${usar('raio', 920, 90, 46, 80, cor.ciano)}
    ${usar('parabolica', 1010, 430, 210, 176, cor.ciano, 'style="--corte:#3a3e41"')}
    ${usar('sinal', 1180, 350, 80, 72, cor.magenta)}
    ${texto('root@garagem:~# _', 860, 655, { fonte: 'Pixel', tam: 30, fill: cor.fosforo })}</g>`;
  // punho gigante e silhuetas embaixo
  g += `<g filter="url(#tinta)">${usar('chip', 540, 520, 230, 230, cor.vermelho, 'style="--corte:#3a3e41"')}
    ${usar('drone', 300, 600, 220, 173, cor.magenta, 'style="--corte:#3a3e41"')}
    ${usar('lata', 250, 690, 46, 92, cor.fosforo)}
    ${usar('ovni', 820, 690, 170, 112, cor.magenta, 'style="--corte:#3a3e41"')}
    ${usar('cctv', 112, 580, 120, 80, cor.ciano, 'style="--corte:#3a3e41"')}
    ${texto('AYO', 1040, 790, { fonte: 'Marker', tam: 96, fill: cor.fosforo, rot: -8 })}
    ${texto('2099', 80, 760, { fonte: 'Marker', tam: 58, fill: '#d6d6cf', rot: 6 })}
    ${texto('GLWYD 03', 1110, 300, { fonte: 'Marker', tam: 34, fill: cor.ciano, rot: -14 })}
    ${texto('ROOT ≠ CRIME', 40, 590, { fonte: 'Pixel', tam: 18, fill: cor.vermelho, rot: -4 })}
    ${escorrido(r, 1040, 760, 220, cor.fosforo, 7)}</g>`;
  g += `<g filter="url(#tinta)" opacity=".92">${texto('ÁREA RESTRITA · NÍVEL 3', 640, 796, { tam: 30, fill: '#e2e2da', ancora: 'middle' })}</g>`;
  s += g;
  s += arranhoes(r, w, h, 120);
  // barra inferior, puxador e cadeado
  s += `<rect y="${h - 50}" width="${w}" height="50" fill="#26292b"/><rect y="${h - 50}" width="${w}" height="5" fill="#4b5054"/>`;
  s += `<rect x="560" y="${h - 40}" width="160" height="16" rx="5" fill="#16181a"/>`;
  s += usar('cadeado', 618, h - 96, 44, 60, '#9a8d6a', 'style="--corte:#2a2219"');
  s += `<rect width="${w}" height="${h}" filter="url(#sujeira)" opacity=".85"/>`;
  s += grao(w, h, .3);
  return { nome: 'portao', w, h, alfa: false, svg: svg(w, h, s) };
}

// ───────────────────────── Fachada com o vão do portão (transparente) ─────────────────────────
export const vao = { x: 160, y: 140, w: 1280, h: 860 };
export function fachada() {
  const w = 1600, h = 1000, r = sorteio(77);
  let blocos = '';
  for (let y = 0, linha = 0; y < h; y += 52, linha++) {
    for (let x = linha % 2 ? -60 : 0; x < w; x += 122) {
      const tom = Math.round(r.entre(64, 86));
      blocos += `<rect x="${x + 2}" y="${y + 2}" width="118" height="48" fill="rgb(${tom},${tom - 2},${tom - 6})"/>`;
    }
  }
  const furo = `M0 0 H${w} V${h} H0 Z M${vao.x} ${vao.y} V${vao.y + vao.h} H${vao.x + vao.w} V${vao.y} Z`;
  let s = `<defs><clipPath id="parede"><path d="${furo}" clip-rule="evenodd"/></clipPath></defs>
  <g clip-path="url(#parede)"><rect width="${w}" height="${h}" fill="#262624"/>${blocos}
  <rect width="${w}" height="${h}" filter="url(#sujeira)"/>
  <rect width="${w}" height="${h}" filter="url(#ferrugem2)" opacity=".6"/>`;
  // pichações nas laterais
  s += `<g filter="url(#tinta)">
    ${texto('LAN HOUSE', 40, 560, { fonte: 'Marker', tam: 54, fill: cor.magenta, rot: -90 })}
    ${texto('ONLINE', 120, 560, { fonte: 'Marker', tam: 52, fill: cor.fosforo, rot: -90 })}
    ${usar('perigo', 30, 650, 90, 81, cor.vermelho, 'style="--corte:#4a4946"')}
    ${usar('cctv', 18, 168, 104, 70, cor.ciano, 'style="--corte:#4a4946"')}
    ${usar('planeta', 1470, 190, 100, 72, cor.ciano, 'style="--corte:#4a4946"')}
    ${texto('ZONA', 1560, 360, { fonte: 'BlackOps', tam: 44, fill: cor.vermelho, rot: 90 })}
    ${texto('FRANCA', 1490, 380, { fonte: 'BlackOps', tam: 44, fill: cor.fosforo, rot: 90 })}
    ${usar('sinal', 1470, 836, 90, 81, cor.magenta)}
  </g>`;
  s += papelRasgado(r, 1456, 640, 120, 160, cor.papel, 5,
    `${texto('PROCURA-SE', 1516, 662, { fonte: 'Pixel', tam: 11, fill: '#111', ancora: 'middle' })}${usar('androide', 1476, 668, 80, 99, '#111', 'style="--corte:#cfc6ae"')}${texto('ANDROIDE', 1516, 788, { tam: 17, fill: cor.vermelho, ancora: 'middle' })}`);
  s += arranhoes(r, w, h, 80);
  s += grao(w, h, .28);
  s += `</g>`;
  // batente de aço, viga e luminária
  s += `<rect x="${vao.x - 26}" y="${vao.y - 26}" width="26" height="${vao.h + 26}" fill="#1d1f20"/><rect x="${vao.x + vao.w}" y="${vao.y - 26}" width="26" height="${vao.h + 26}" fill="#1d1f20"/>`;
  s += `<rect x="${vao.x - 26}" y="${vao.y - 60}" width="${vao.w + 52}" height="60" fill="#232526"/><rect x="${vao.x - 26}" y="${vao.y - 60}" width="${vao.w + 52}" height="5" fill="#46494b"/>`;
  for (let x = vao.x - 12; x < vao.x + vao.w + 20; x += 64) s += `<circle cx="${x}" cy="${vao.y - 30}" r="4" fill="#5a5d5f"/>`;
  s += `<g filter="url(#tinta)">${texto('GARAGEM 03', 800, vao.y - 18, { tam: 34, fill: '#d6d3c4', ancora: 'middle' })}</g>`;
  s += `<rect x="740" y="0" width="120" height="30" fill="#151515"/><rect x="752" y="30" width="96" height="18" fill="${cor.fosforo}"/><path d="M752 48 L700 ${vao.y - 60} L900 ${vao.y - 60} L848 48 Z" fill="${cor.fosforo}" opacity=".12"/>`;
  s += `<path d="M0 60 C200 90 300 40 520 70 S900 50 1100 80 S1450 40 1600 70" fill="none" stroke="#0c0c0c" stroke-width="7"/>`;
  s += `<path d="M0 34 C260 70 420 20 700 46" fill="none" stroke="#3a0f0f" stroke-width="5"/>`;
  return { nome: 'fachada', w, h, alfa: true, svg: svg(w, h, s) };
}

// ───────────────────────── Interior da garagem (fundo da TV) ─────────────────────────
export function garagem() {
  const w = 1600, h = 1000, r = sorteio(1983);
  const tons = ['#6b2f22', '#7a3a28', '#5a2a20', '#6e3526', '#4e231b', '#7f4030'];
  let s = `<rect width="${w}" height="${h}" fill="#1f1714"/>`;
  for (let y = 0, linha = 0; y < 870; y += 36, linha++) {
    for (let x = linha % 2 ? -42 : 0; x < w; x += 86) {
      s += `<rect x="${x + 3}" y="${y + 3}" width="80" height="30" fill="${r.um(tons)}"/>`;
      if (r() < .08) s += `<rect x="${x + 3}" y="${y + 3}" width="80" height="30" fill="#1a1210" opacity=".55"/>`;
    }
  }
  s += `<rect width="${w}" height="870" filter="url(#sujeira)"/>`;
  // piso
  s += `<rect y="860" width="${w}" height="140" fill="#1b1b1a"/><rect y="860" width="${w}" height="6" fill="#2d2c2a"/><rect y="860" width="${w}" height="140" filter="url(#ferrugem2)" opacity=".6"/>`;
  // brilho do CRT na parede (faixas duras, sem degradê suave)
  for (const [raio, op] of [[420, .035], [330, .045], [250, .055], [180, .065]]) s += `<ellipse cx="780" cy="540" rx="${raio * 1.3}" ry="${raio}" fill="${cor.fosforo}" opacity="${op}"/>`;
  // TV pequena acesa no centro (a luz de CRT que vaza pelo portão); na seção da árvore a TV real fica por cima
  s += `<g filter="url(#sombra)"><rect x="630" y="650" width="340" height="210" fill="#4a3220"/><rect x="630" y="650" width="340" height="210" filter="url(#madeira)"/>
    <path d="M630 720 H970 M630 790 H970 M700 650 V860 M900 650 V860" stroke="#2a1b10" stroke-width="6"/>
    <rect x="660" y="430" width="280" height="220" rx="16" fill="#2b2522"/><rect x="684" y="452" width="190" height="176" rx="18" fill="${cor.fosforo}" opacity=".85"/>
    <rect x="890" y="470" width="34" height="34" rx="17" fill="#141414"/><rect x="890" y="530" width="34" height="34" rx="17" fill="#141414"/>
    <path d="M800 430 L740 360 M800 430 L870 370" stroke="#8a8a82" stroke-width="5"/></g>`;
  for (let y = 456; y < 628; y += 4) s += `<rect x="684" y="${y}" width="190" height="1.5" fill="#052a10" opacity=".55"/>`;
  s += `<g stroke="#052a10" stroke-width="2.5" fill="none" opacity=".7"><path d="M779 540 L730 500 M779 540 L830 498 M779 540 L779 600 M730 500 L710 560"/></g>`;
  // cartazes
  s += papelRasgado(r, 90, 120, 240, 330, '#0e0e0e', -3,
    `<rect x="100" y="130" width="220" height="310" fill="none" stroke="${cor.magenta}" stroke-width="6"/>
     <circle cx="210" cy="250" r="72" fill="${cor.magenta}"/>
     <rect x="130" y="262" width="160" height="5" fill="#0e0e0e"/><rect x="130" y="276" width="160" height="7" fill="#0e0e0e"/><rect x="130" y="292" width="160" height="9" fill="#0e0e0e"/><rect x="130" y="310" width="160" height="12" fill="#0e0e0e"/>
     ${usar('predios', 110, 262, 200, 120, cor.fosforo, 'style="--corte:#0e0e0e"')}
     ${texto('MANAUS 2099', 210, 412, { tam: 32, fill: cor.ciano, ancora: 'middle' })}
     ${texto('ZONA FRANCA DIGITAL', 210, 432, { fonte: 'Pixel', tam: 12, fill: '#e6e6dc', ancora: 'middle' })}`);
  s += papelRasgado(r, 360, 400, 170, 240, cor.papel, 4,
    `<rect x="370" y="410" width="150" height="220" fill="url(#pontosV)" opacity=".45"/>
     ${usar('perigo', 395, 428, 100, 90, '#111', 'style="--corte:#cfc6ae"')}
     ${texto('PERIGO', 445, 568, { tam: 32, fill: '#111', ancora: 'middle' })}
     ${texto('ALTA TENSÃO', 445, 598, { tam: 19, fill: cor.vermelho, ancora: 'middle' })}`);
  s += papelRasgado(r, 1260, 110, 250, 340, '#101010', 2,
    `${usar('robo', 1300, 130, 170, 255, cor.ciano, 'style="--corte:#101010"')}
     ${texto('ANDROIDES', 1385, 400, { tam: 30, fill: cor.fosforo, ancora: 'middle' })}
     ${texto('ENTRE NÓS', 1385, 432, { tam: 30, fill: cor.fosforo, ancora: 'middle' })}`);
  s += papelRasgado(r, 1090, 450, 190, 260, cor.vermelho, -5,
    `${usar('parabolica', 1115, 470, 140, 117, '#111', 'style="--corte:#ff2a2a"')}
     ${texto('RÁDIO PIRATA', 1185, 630, { tam: 21, fill: '#111', ancora: 'middle' })}
     ${texto('CANAL 03 · 24H', 1185, 658, { fonte: 'Pixel', tam: 13, fill: '#111', ancora: 'middle' })}
     ${texto('SINAL ABERTO', 1185, 680, { fonte: 'Pixel', tam: 13, fill: '#111', ancora: 'middle' })}`);
  s += papelRasgado(r, 40, 480, 150, 110, cor.papel, 7,
    `${texto('CONEXÃO', 115, 525, { tam: 22, fill: '#111', ancora: 'middle' })}${texto('56K', 115, 562, { tam: 34, fill: cor.vermelho, ancora: 'middle' })}`);
  s += papelRasgado(r, 1420, 500, 150, 100, cor.magenta, -6,
    `${texto('NEON', 1495, 545, { tam: 30, fill: '#111', ancora: 'middle' })}${texto('NOITE', 1495, 580, { tam: 30, fill: '#111', ancora: 'middle' })}`);
  s += fita(150, 108, 80, -10) + fita(1340, 98, 90, 8) + fita(400, 390, 70, 12) + fita(1130, 440, 70, -14);
  // grafite direto no tijolo
  s += `<g filter="url(#tinta)">${usar('planeta', 560, 56, 120, 86, cor.ciano, 'style="--corte:#4e231b"')}${texto('AYO', 980, 130, { fonte: 'Marker', tam: 70, fill: cor.magenta, rot: -6 })}
    ${usar('estrela', 680, 90, 40, 40, cor.vermelho)}${texto('> sistema online_', 600, 220, { fonte: 'Pixel', tam: 22, fill: cor.fosforo, rot: -2 })}</g>`;
  // prateleira e equipamentos à esquerda
  s += `<g filter="url(#sombra)"><rect x="30" y="640" width="330" height="14" fill="#3b2a1c"/>
    <rect x="44" y="590" width="150" height="50" fill="#1c1c1c"/><rect x="54" y="600" width="70" height="10" fill="#0a0a0a"/><circle cx="170" cy="615" r="9" fill="#2e2e2e"/><rect x="54" y="622" width="10" height="5" fill="${cor.vermelho}"/>
    <rect x="204" y="560" width="140" height="80" fill="#262626"/><circle cx="240" cy="600" r="18" fill="#141414"/><circle cx="300" cy="600" r="18" fill="#141414"/><rect x="215" y="570" width="118" height="8" fill="${cor.fosforo}" opacity=".7"/>
    <rect x="60" y="690" width="200" height="190" fill="#151515"/><circle cx="160" cy="760" r="58" fill="#0b0b0b"/><circle cx="160" cy="760" r="22" fill="#222"/><circle cx="160" cy="845" r="20" fill="#0b0b0b"/></g>`;
  // rack e caixa à direita
  s += `<g filter="url(#sombra)"><rect x="1330" y="640" width="200" height="240" fill="#161616"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="1342" y="${652 + i * 36}" width="176" height="28" fill="#222"/><rect x="1350" y="${662 + i * 36}" width="6" height="6" fill="${i % 2 ? cor.fosforo : cor.vermelho}"/><rect x="1364" y="${663 + i * 36}" width="90" height="4" fill="#0b0b0b"/>`;
  s += `<rect x="1140" y="760" width="160" height="120" fill="#202020"/><rect x="1152" y="772" width="136" height="84" fill="#0c1a10"/><rect x="1160" y="780" width="60" height="6" fill="${cor.fosforo}" opacity=".6"/></g>`;
  // cabos pendurados
  s += `<g fill="none" stroke-linecap="round">
    <path d="M0 40 C300 160 520 30 800 120 S1300 30 1600 150" stroke="#0a0a0a" stroke-width="8"/>
    <path d="M200 0 C260 200 420 260 640 300" stroke="#0d0d0d" stroke-width="6"/>
    <path d="M1600 260 C1400 300 1200 240 980 330" stroke="#3a0e0e" stroke-width="6"/>
    <path d="M260 880 C400 820 560 900 700 840" stroke="#0a0a0a" stroke-width="7"/>
    <path d="M1330 880 C1200 830 1080 900 900 850" stroke="#102a16" stroke-width="6"/></g>`;
  s += `<rect width="${w}" height="${h}" fill="url(#vinheta)"/>`;
  s = s.replace('<rect width="1600" height="1000" fill="url(#vinheta)"/>',
    `<radialGradient id="vinheta" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></radialGradient><rect width="${w}" height="${h}" fill="url(#vinheta)"/>`);
  s += grao(w, h, .3);
  return { nome: 'garagem', w, h, alfa: false, svg: svg(w, h, s) };
}

// ───────────────────────── Moldura da TV CRT (tela transparente) ─────────────────────────
export const tela = { x: 90, y: 240, w: 780, h: 600, raio: 46 };
export function tv() {
  const w = 1200, h = 1040, r = sorteio(1999);
  const furo = `M0 0 H${w} V${h} H0 Z M${tela.x + tela.raio} ${tela.y} H${tela.x + tela.w - tela.raio} Q${tela.x + tela.w} ${tela.y} ${tela.x + tela.w} ${tela.y + tela.raio} V${tela.y + tela.h - tela.raio} Q${tela.x + tela.w} ${tela.y + tela.h} ${tela.x + tela.w - tela.raio} ${tela.y + tela.h} H${tela.x + tela.raio} Q${tela.x} ${tela.y + tela.h} ${tela.x} ${tela.y + tela.h - tela.raio} V${tela.y + tela.raio} Q${tela.x} ${tela.y} ${tela.x + tela.raio} ${tela.y} Z`;
  let s = `<defs><clipPath id="corpo"><path d="${furo}" clip-rule="evenodd"/></clipPath></defs>`;
  // antena
  s += `<g stroke="#9a9a92" stroke-width="7" stroke-linecap="round"><path d="M600 150 L410 18"/><path d="M600 150 L820 28"/></g><circle cx="410" cy="18" r="10" fill="#bdbdb4"/><circle cx="820" cy="28" r="10" fill="#bdbdb4"/><path d="M520 152 Q600 92 680 152 Z" fill="#202020"/>`;
  s += `<g clip-path="url(#corpo)">`;
  s += `<rect x="20" y="150" width="1160" height="840" rx="44" fill="#4a2f1c"/><rect x="20" y="150" width="1160" height="840" rx="44" filter="url(#madeira)"/>`;
  s += `<rect x="20" y="150" width="1160" height="12" rx="6" fill="#6b4529"/>`;
  s += `<rect x="58" y="200" width="842" height="700" rx="34" fill="#181716"/><rect x="58" y="200" width="842" height="700" rx="34" fill="none" stroke="#2c2a28" stroke-width="6"/>`;
  s += `<rect x="${tela.x - 10}" y="${tela.y - 10}" width="${tela.w + 20}" height="${tela.h + 20}" rx="${tela.raio + 8}" fill="#070707"/>`;
  // painel de controle
  s += `<rect x="920" y="210" width="226" height="720" rx="16" fill="#1e1d1c"/><rect x="934" y="224" width="198" height="44" fill="#0e0e0e"/>`;
  s += texto('CANAL 03', 1033, 255, { fonte: 'Pixel', tam: 22, fill: cor.fosforo, ancora: 'middle' });
  for (const [cy, rot] of [[360, 30], [530, -50]]) {
    s += `<circle cx="1033" cy="${cy}" r="66" fill="#121212"/><circle cx="1033" cy="${cy}" r="52" fill="#2b2a28"/><rect x="1028" y="${cy - 52}" width="10" height="36" fill="#d6d3c4" transform="rotate(${rot} 1033 ${cy})"/>`;
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; s += `<rect x="${(1033 + Math.cos(a) * 78 - 2).toFixed(1)}" y="${(cy + Math.sin(a) * 78 - 2).toFixed(1)}" width="4" height="4" fill="#77756e"/>`; }
  }
  s += texto('VHF', 960, 446, { fonte: 'Pixel', tam: 14, fill: '#8d8b84' }) + texto('UHF', 1070, 446, { fonte: 'Pixel', tam: 14, fill: '#8d8b84' });
  for (let y = 640; y < 900; y += 18) s += `<rect x="950" y="${y}" width="166" height="7" rx="3" fill="#0a0a0a"/>`;
  s += `<circle cx="1110" cy="612" r="8" fill="${cor.vermelho}"/>`;
  // adesivos hacktivistas e de representatividade
  const adesivo = (x, y, w2, h2, fill, rot, conteudo) => `<g transform="rotate(${rot} ${x + w2 / 2} ${y + h2 / 2})" filter="url(#sombraP)"><rect x="${x}" y="${y}" width="${w2}" height="${h2}" rx="6" fill="${fill}"/>${conteudo}</g>`;
  s += adesivo(48, 166, 230, 46, '#e9e4d2', -4, texto('SOFTWARE LIVRE', 163, 199, { tam: 26, fill: '#111', ancora: 'middle' }));
  s += `<g filter="url(#sombraP)"><circle cx="130" cy="900" r="62" fill="${cor.vermelho}"/>${usar('alien', 102, 862, 56, 70, '#111', 'style="--corte:#ff2a2a"')}</g>`;
  s += adesivo(270, 902, 230, 50, '#111', 3, texto('0xDEADBEEF', 385, 937, { fonte: 'Pixel', tam: 24, fill: cor.ciano, ancora: 'middle' }));
  s += adesivo(560, 896, 200, 54, cor.magenta, -3, texto('NÃO RASTREIE', 660, 931, { tam: 21, fill: '#111', ancora: 'middle' }));
  s += adesivo(938, 280, 190, 44, cor.fosforo, 6, texto('SUDO JUSTIÇA', 1033, 310, { fonte: 'Pixel', tam: 18, fill: '#111', ancora: 'middle' }));
  s += adesivo(940, 860, 180, 50, '#111', -5, texto('</> ONLINE', 1030, 894, { fonte: 'Pixel', tam: 20, fill: cor.fosforo, ancora: 'middle' }));
  s += adesivo(700, 176, 210, 40, cor.ciano, 3, texto('ROOT ≠ CRIME', 805, 204, { fonte: 'Pixel', tam: 18, fill: '#111', ancora: 'middle' }));
  s += `<g filter="url(#tinta)">${usar('planeta', 330, 158, 70, 50, cor.ciano, 'style="--corte:#4a2f1c"')}${texto('AYO', 790, 985, { fonte: 'Marker', tam: 40, fill: cor.fosforo, rot: -6 })}${usar('estrela', 40, 720, 34, 34, cor.magenta)}</g>`;
  s += fita(30, 640, 70, -70) + fita(860, 180, 60, 30);
  s += arranhoes(r, w, h, 60);
  s += `</g>`;
  // pés
  s += `<rect x="120" y="990" width="90" height="40" fill="#111"/><rect x="990" y="990" width="90" height="40" fill="#111"/>`;
  s += `<clipPath id="casca"><rect x="20" y="150" width="1160" height="840" rx="44"/></clipPath><g clip-path="url(#corpo)"><g clip-path="url(#casca)">${grao(w, h, .32)}</g></g>`;
  return { nome: 'tv', w, h, alfa: true, svg: svg(w, h, s) };
}

// ───────────────────────── Mesa de madeira (fundo dos contatos) ─────────────────────────
export function mesa() {
  const w = 1600, h = 1000, r = sorteio(1998);
  let s = `<rect width="${w}" height="${h}" fill="#140f0c"/>`;
  // parede escura ao fundo
  for (let y = 0, l = 0; y < 170; y += 30, l++) for (let x = l % 2 ? -36 : 0; x < w; x += 74) s += `<rect x="${x + 2}" y="${y + 2}" width="70" height="26" fill="${r.um(['#2a1712', '#331c15', '#24140f'])}"/>`;
  s += `<rect y="150" width="${w}" height="30" fill="#0b0806"/>`;
  // tábuas
  for (let y = 180, i = 0; y < h; y += 118, i++) {
    s += `<rect y="${y}" width="${w}" height="114" fill="${['#5b3b22', '#4f321c', '#563820', '#4a2f1a', '#5e3d23', '#523520', '#4d311b'][i]}"/><rect y="${y + 114}" width="${w}" height="4" fill="#120b07"/>`;
  }
  s += `<rect y="180" width="${w}" height="${h - 180}" filter="url(#madeira)"/><rect y="180" width="${w}" height="${h - 180}" filter="url(#sujeira)" opacity=".7"/>`;
  for (let i = 0; i < 5; i++) s += `<circle cx="${r.entre(200, 1400).toFixed(0)}" cy="${r.entre(260, 950).toFixed(0)}" r="${r.entre(38, 60).toFixed(0)}" fill="none" stroke="#2a1a0e" stroke-width="5" opacity=".5"/>`;
  // teclado mecânico gasto
  let tec = `<rect x="40" y="690" width="470" height="200" rx="12" fill="#232323"/>`;
  for (let row = 0; row < 5; row++) for (let col = 0; col < 14; col++) {
    const gasto = r() < .25;
    const fill = row === 0 && col === 0 ? cor.vermelho : row === 2 && col === 13 ? cor.fosforo : gasto ? '#5c5b56' : '#8b8a84';
    tec += `<rect x="${56 + col * 32}" y="${708 + row * 34}" width="27" height="28" rx="4" fill="${fill}"/><rect x="${59 + col * 32}" y="${710 + row * 34}" width="21" height="18" rx="3" fill="#fff" opacity="${gasto ? .02 : .08}"/>`;
  }
  s += `<g transform="rotate(-9 270 790)" filter="url(#sombra)">${tec}</g>`;
  // disquetes
  const disquete = (x, y, rot, fill, rotulo) => `<g transform="rotate(${rot} ${x + 90} ${y + 90})" filter="url(#sombra)"><rect x="${x}" y="${y}" width="180" height="180" rx="6" fill="${fill}"/><rect x="${x + 44}" y="${y}" width="92" height="58" fill="#a9aba8"/><rect x="${x + 100}" y="${y + 8}" width="22" height="42" fill="${fill}"/><rect x="${x + 22}" y="${y + 84}" width="136" height="88" fill="#e6e0cc"/>${texto(rotulo, x + 90, y + 132, { fonte: 'Marker', tam: 20, fill: '#1a1a1a', ancora: 'middle' })}</g>`;
  s += disquete(110, 230, -12, '#1d1d1d', 'DRIVERS 98') + disquete(220, 300, 9, '#7a1414', 'KERNEL') + disquete(70, 400, -3, '#173a52', 'BACKUP');
  // CDs riscados
  const cd = (cx, cy, raio) => {
    let c = `<g filter="url(#sombra)"><circle cx="${cx}" cy="${cy}" r="${raio}" fill="#b9bab6"/>`;
    const cores = [cor.ciano, cor.magenta, cor.fosforo, cor.vermelho];
    for (let i = 0; i < 8; i++) { const a1 = i / 8 * Math.PI * 2, a2 = a1 + .32; c += `<path d="M${cx} ${cy} L${(cx + Math.cos(a1) * raio).toFixed(1)} ${(cy + Math.sin(a1) * raio).toFixed(1)} A${raio} ${raio} 0 0 1 ${(cx + Math.cos(a2) * raio).toFixed(1)} ${(cy + Math.sin(a2) * raio).toFixed(1)} Z" fill="${cores[i % 4]}" opacity=".28"/>`; }
    c += `<circle cx="${cx}" cy="${cy}" r="${raio * .3}" fill="#d6d6d2"/><circle cx="${cx}" cy="${cy}" r="${raio * .11}" fill="#140f0c"/>`;
    for (let i = 0; i < 26; i++) { const a = r() * 6.28, rr = r.entre(raio * .35, raio * .95); c += `<path d="M${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)} l${r.entre(-30, 30).toFixed(1)} ${r.entre(-12, 12).toFixed(1)}" stroke="#fff" stroke-width="1" opacity=".55"/>`; }
    return c + '</g>';
  };
  s += cd(1300, 300, 110) + cd(1160, 820, 86);
  // placas de circuito
  let pcb = `<rect x="1180" y="540" width="300" height="200" rx="6" fill="#1d4a28"/>`;
  for (let i = 0; i < 18; i++) { const y = 556 + i * 10; pcb += `<path d="M1190 ${y} H${1220 + r() * 120} V${y + r.entre(-6, 16)} H${1300 + r() * 160}" stroke="#b47d3c" stroke-width="2" fill="none" opacity=".8"/>`; }
  pcb += `<rect x="1250" y="590" width="80" height="56" fill="#0e0e0e"/><rect x="1360" y="640" width="54" height="40" fill="#0e0e0e"/><circle cx="1450" cy="560" r="6" fill="${cor.vermelho}"/>`;
  for (let i = 0; i < 9; i++) pcb += `<rect x="${1252 + i * 9}" y="584" width="4" height="6" fill="#bbb"/><rect x="${1252 + i * 9}" y="646" width="4" height="6" fill="#bbb"/>`;
  s += `<g transform="rotate(8 1330 640)" filter="url(#sombra)">${pcb}</g>`;
  s += `<g transform="rotate(-20 1440 860)" filter="url(#sombra)"><rect x="1380" y="820" width="140" height="80" fill="#1a3d22"/><rect x="1400" y="840" width="40" height="30" fill="#0e0e0e"/><circle cx="1490" cy="840" r="5" fill="${cor.fosforo}"/></g>`;
  // papéis amassados
  const bola = (cx, cy, raio) => {
    let pts = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28; const rr = raio * r.entre(.72, 1.08); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    let b = `<g filter="url(#sombra)"><polygon points="${pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}" fill="#d7d0bb"/>`;
    for (let i = 0; i < 9; i++) { const p1 = r.um(pts), p2 = r.um(pts); b += `<path d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${(cx + r.entre(-10, 10)).toFixed(1)} ${(cy + r.entre(-10, 10)).toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z" fill="#000" opacity="${r.entre(.04, .18).toFixed(2)}"/>`; }
    return b + '</g>';
  };
  s += bola(440, 270, 52) + bola(1490, 420, 44) + bola(1040, 230, 38) + bola(560, 930, 46);
  // post-its
  s += `<g transform="rotate(-8 1450 230)" filter="url(#sombraP)"><rect x="1390" y="190" width="120" height="110" fill="${cor.fosforo}"/>${texto('TODO:', 1402, 228, { fonte: 'Marker', tam: 22, fill: '#111' })}${texto('deploy', 1402, 258, { fonte: 'Marker', tam: 22, fill: '#111' })}</g>`;
  // cabos
  s += `<g fill="none" stroke-linecap="round" filter="url(#sombraP)">
    <path d="M0 610 C160 560 260 680 420 620 S640 560 700 640" stroke="#0b0b0b" stroke-width="9"/>
    <path d="M1600 560 C1500 520 1440 600 1300 520" stroke="#7a1010" stroke-width="7"/>
    <path d="M1600 960 C1400 900 1300 980 1180 900 S980 960 900 1000" stroke="#0b0b0b" stroke-width="8"/>
    <path d="M330 1000 C340 950 420 940 470 900" stroke="#0f3a1a" stroke-width="7"/></g>`;
  // luz dura vindo de cima-direita e vinheta
  s += `<path d="M0 0 H${w} V${h} H0 Z" fill="url(#vinM)"/>`;
  s = s.replace(`<path d="M0 0 H${w} V${h} H0 Z" fill="url(#vinM)"/>`,
    `<radialGradient id="vinM" cx=".52" cy=".56" r=".72"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".82"/></radialGradient><path d="M0 0 H${w} V${h} H0 Z" fill="url(#vinM)"/>`);
  s += grao(w, h, .3);
  return { nome: 'mesa', w, h, alfa: false, svg: svg(w, h, s) };
}

// ───────────────────────── Papel amassado do contato (bordas irregulares, transparente) ─────────────────────────
export function papel() {
  const w = 900, h = 1060, r = sorteio(1310);
  const pts = [];
  const m = 26;
  for (let x = m; x <= w - m; x += 22) pts.push([x, m + r.entre(-10, 12)]);
  for (let y = m; y <= h - m; y += 22) pts.push([w - m + r.entre(-12, 10), y]);
  for (let x = w - m; x >= m; x -= 22) pts.push([x, h - m + r.entre(-12, 10)]);
  for (let y = h - m; y >= m; y -= 22) pts.push([m + r.entre(-10, 12), y]);
  const contorno = pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
  let s = `<defs><clipPath id="folha"><polygon points="${contorno}"/></clipPath></defs>`;
  s += `<g clip-path="url(#folha)"><rect width="${w}" height="${h}" fill="#d6cdb4"/>`;
  // facetas do amassado: triângulos claros e escuros com borda dura
  for (let i = 0; i < 70; i++) {
    const cx = r() * w, cy = r() * h, t = r.entre(60, 220);
    const a = [cx + r.entre(-t, t), cy + r.entre(-t, t)], b = [cx + r.entre(-t, t), cy + r.entre(-t, t)];
    s += `<polygon points="${cx.toFixed(0)},${cy.toFixed(0)} ${a[0].toFixed(0)},${a[1].toFixed(0)} ${b[0].toFixed(0)},${b[1].toFixed(0)}" fill="${r() < .5 ? '#000' : '#fff'}" opacity="${r.entre(.025, .08).toFixed(3)}"/>`;
  }
  for (let i = 0; i < 16; i++) {
    const x1 = r() * w, y1 = r() * h, x2 = x1 + r.entre(-400, 400), y2 = y1 + r.entre(-400, 400);
    s += `<path d="M${x1.toFixed(0)} ${y1.toFixed(0)} L${x2.toFixed(0)} ${y2.toFixed(0)}" stroke="#5a503c" stroke-width="1.2" opacity=".35"/><path d="M${(x1 + 2).toFixed(0)} ${(y1 + 2).toFixed(0)} L${(x2 + 2).toFixed(0)} ${(y2 + 2).toFixed(0)}" stroke="#fff" stroke-width="1" opacity=".35"/>`;
  }
  // pauta de caderno, margem e mancha de café
  for (let y = 150; y < h - 40; y += 46) s += `<rect x="0" y="${y}" width="${w}" height="1.5" fill="#6aa0b8" opacity=".28"/>`;
  s += `<rect x="96" y="0" width="2" height="${h}" fill="${cor.vermelho}" opacity=".35"/>`;
  s += `<circle cx="720" cy="860" r="92" fill="none" stroke="#6b4423" stroke-width="10" opacity=".22"/><circle cx="726" cy="866" r="80" fill="none" stroke="#6b4423" stroke-width="3" opacity=".18"/>`;
  s += `<rect width="${w}" height="${h}" filter="url(#sujeira)" opacity=".35"/>`;
  s += grao(w, h, .35);
  // bordas encardidas
  s += `<polygon points="${contorno}" fill="none" stroke="#7a6a48" stroke-width="10" opacity=".35"/>`;
  s += `</g>`;
  return { nome: 'papel', w, h, alfa: true, svg: svg(w, h, s) };
}

export const cenas = [portao, fachada, garagem, tv, mesa, papel];
