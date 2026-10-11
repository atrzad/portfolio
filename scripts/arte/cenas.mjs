// Cenas do site geradas como SVG e depois renderizadas em pixel art por scripts/arte.mjs.
// Cada cena devolve { nome, w, h, alfa, paleta, svg } e, se precisar, grade (escala da grade de pixels)
// e rigor (quanto o pontilhado evita misturar cores distantes). O sorteio é determinístico.
//
// Referências gráficas: adventures japoneses de PC-98 (640 × 400, 16 cores por cena, pontilhado no lugar
// de degradê), o claro-escuro de Blasphemous (uma fonte de luz forte por cena), letreiro pintado à mão,
// lambe-lambe e pixação na rua, futurismo de fita cassete no terminal e xerox de flyer pós-punk no zine.
// Cada objeto aparece uma vez só no site inteiro.
//
// Iluminação: os objetos são pintados com a cor-base (albedo) e depois multiplicados por um mapa de luz;
// o que emite luz (lâmpadas, neon, tela, LEDs) é desenhado por cima, sem ser escurecido.
import { simbolos } from './simbolos.mjs';

function sorteio(semente) {
  let a = semente >>> 0;
  const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  r.entre = (min, max) => min + r() * (max - min);
  r.um = lista => lista[Math.floor(r() * lista.length)];
  return r;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = v => +v.toFixed(1);
const usar = (id, x, y, w, h, fill, extra = '') => `<use href="#${id}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" color="${fill}" ${extra}/>`;
const texto = (t, x, y, { fonte = 'Letreiro', tam = 40, fill = '#111', rot = 0, ancora = 'start', extra = '' } = {}) =>
  `<text x="${x}" y="${y}" font-family="${fonte}" font-size="${tam}" fill="${fill}" text-anchor="${ancora}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''} ${extra}>${esc(t)}</text>`;
// Um recorte (clip-path) isola o grupo: por isso ele vai no mesmo elemento da mistura, nunca num grupo por fora.
const multiplicar = (conteudo, recorte) => `<g style="mix-blend-mode:multiply"${recorte ? ` clip-path="url(#${recorte})"` : ''}>${conteudo}</g>`;
const somar = conteudo => `<g style="mix-blend-mode:screen">${conteudo}</g>`;
const radial = (id, paradas, { cx = .5, cy = .5, r = .5, fx, fy, unidades = '' } = {}) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${fx != null ? ` fx="${fx}" fy="${fy}"` : ''}${unidades ? ` gradientUnits="${unidades}"` : ''}>${paradas.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
const linear = (id, paradas, { x1 = 0, y1 = 0, x2 = 0, y2 = 1, unidades = '' } = {}) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${unidades ? ` gradientUnits="${unidades}"` : ''}>${paradas.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;

function filtros() {
  return `
  <filter id="borrao" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="borraoG" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="ferrugem" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".005 .016" numOctaves="3" seed="11"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .27  0 0 0 0 .13  5 0 0 0 -2.9"/>
  </filter>
  <filter id="mancha" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".008 .03" numOctaves="4" seed="31"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -1.25"/>
  </filter>
  <filter id="concreto" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="5"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.6 0 0 0 -.62"/>
  </filter>
  <filter id="gasto" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="2" seed="2" result="s"/>
    <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 0 0 0 2" result="furos"/>
    <feComposite in="SourceGraphic" in2="furos" operator="in"/>
  </filter>`;
}

function svg(w, h, corpo, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${filtros()}${simbolos}${defs}</defs>${corpo}</svg>`;
}

function papelRasgado(r, x, y, w, h, fill, rot = 0, conteudo = '') {
  const pts = [];
  const passo = 16;
  for (let i = 0; i <= w; i += passo) pts.push([x + i, y + r.entre(-5, 5)]);
  for (let i = 0; i <= h; i += passo) pts.push([x + w + r.entre(-5, 5), y + i]);
  for (let i = w; i >= 0; i -= passo) pts.push([x + i, y + h + r.entre(-5, 5)]);
  for (let i = h; i >= 0; i -= passo) pts.push([x + r.entre(-5, 5), y + i]);
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><polygon points="${pts.map(p => p.map(n).join(',')).join(' ')}" fill="${fill}"/>${conteudo}</g>`;
}

function escorrido(r, x, y, largura, fill, quantos = 4, maximo = 70) {
  let s = '';
  for (let i = 0; i < quantos; i++) {
    const xx = x + r() * largura, comp = r.entre(14, maximo), esp = r.entre(3, 5);
    s += `<rect x="${n(xx)}" y="${y}" width="${n(esp)}" height="${n(comp)}" fill="${fill}"/><circle cx="${n(xx + esp / 2)}" cy="${n(y + comp)}" r="${n(esp * .75)}" fill="${fill}"/>`;
  }
  return s;
}

// ───────────────────────── Rua à noite: fachada e portão dividem a paleta e a luz ─────────────────────────
const paletaRua = [
  '#07080c', '#10131b', '#1a1f2b', '#262d3b', '#363f50', '#4d5767', '#6d7684', '#9aa1a8',
  '#5e5248', '#8c7660', '#c49e72', '#f0c78a', '#fff1d0',
  '#4a2a1a', '#7a3e1f', '#b8662c',
  '#a3201b', '#e2b93b', '#1f4f9c', '#39ff6a', '#145c2e', '#d8c9a4'
];
// Duas arandelas de sódio na viga: as poças de luz são as mesmas no portão e na fachada.
export const vao = { x: 160, y: 140, w: 1280, h: 860 };
const lampadas = [{ x: 420, y: 112 }, { x: 1180, y: 112 }];

function mapaLuzRua(id, w, h, dx, dy) {
  const defs = lampadas.map((l, i) => radial(`${id}${i}`, [[0, '#fff4dc'], [.2, '#f7cd92'], [.45, '#c49470'], [.72, '#6a6f86', 0], [1, '#6a6f86', 0]],
    { cx: l.x - dx, cy: l.y - dy, r: 700, unidades: 'userSpaceOnUse' })).join('');
  const luz = multiplicar(`<rect width="${w}" height="${h}" fill="#434c62"/>${somar(lampadas.map((_, i) => `<rect width="${w}" height="${h}" fill="url(#${id}${i})"/>`).join(''))}`);
  return { defs, luz };
}

// Pixação: letras altas e angulosas (a pixação paulistana bebe em capas de metal e em runas).
const PIXO = {
  A: 'M6 180 V56 L32 6 L58 56 V180 M6 106 H58 M58 180 L72 166',
  Y: 'M4 6 L32 86 L60 6 M32 86 V180 M32 180 L18 166',
  O: 'M8 28 L32 6 L56 28 V154 L32 178 L8 154 Z',
  '0': 'M8 28 L32 6 L56 28 V154 L32 178 L8 154 Z M14 148 L50 34',
  '3': 'M6 14 H54 L28 86 H54 V156 L34 178 H6'
};
function pixo(palavra, x, y, escala, cor, r) {
  const passo = 82;
  const letras = [...palavra].map((c, i) => `<path d="${PIXO[c]}" transform="translate(${i * passo} 0)"/>`).join('');
  const fim = palavra.length * passo - 10;
  const traco = `<path d="M-14 198 H${fim} L${fim + 14} 184 M${fim / 2} 198 L${fim / 2 + 10} 212"/>`;
  const corpo = letras + traco;
  return `<g transform="translate(${x} ${y}) scale(${escala})" fill="none" stroke-linecap="square" stroke-linejoin="miter">
    <g stroke="${cor}" stroke-width="32" opacity=".2" filter="url(#borrao)">${corpo}</g>
    <g stroke="${cor}" stroke-width="14">${corpo}</g>
  </g>${escorrido(r, x + 30 * escala, y + 176 * escala, palavra.length * passo * escala * .8, cor, 3, 46)}`;
}

// ───────────────────────── Portão (encaixa no vão da fachada) ─────────────────────────
export function portao() {
  const w = 1280, h = 860, r = sorteio(2003);
  const { defs: defsLuz, luz } = mapaLuzRua('lp', w, h, vao.x, vao.y);
  const defs = defsLuz + linear('lamina', [[0, '#e2e5e8'], [.12, '#bfc4ca'], [.5, '#a3a8af'], [.82, '#7d828a'], [.9, '#44474d'], [1, '#2c2e33']])
    + linear('fresta', [[0, '#39ff6a', 0], [1, '#39ff6a', .9]])
    + linear('gotejo', [[0, '#7a3e1f', .9], [1, '#7a3e1f', 0]]);
  let s = `<rect width="${w}" height="${h}" fill="#5a5e64"/>`;
  for (let y = 0; y < h - 50; y += 45) s += `<rect y="${y}" width="${w}" height="45" fill="url(#lamina)"/>`;
  // ferrugem: manchas e escorridos que descem das emendas
  s += `<rect width="${w}" height="${h}" filter="url(#ferrugem)" opacity=".7"/>`;
  for (let i = 0; i < 30; i++) {
    const x = r() * w, y = Math.floor(r() * 16) * 45 + 38;
    s += `<rect x="${n(x)}" y="${y}" width="${n(r.entre(4, 8))}" height="${n(r.entre(40, 170))}" fill="url(#gotejo)"/>`;
  }
  s += `<rect width="${w}" height="${h}" filter="url(#mancha)" opacity=".22"/>`;
  // lambe-lambe de show colado à esquerda, com restos de um cartaz antigo por baixo
  s += papelRasgado(r, 40, 300, 200, 300, '#2f7f8f', 3);
  s += papelRasgado(r, 52, 312, 196, 296, '#e6dfcc', -2, `
    <rect x="62" y="324" width="176" height="10" fill="#141414"/>
    ${texto('SOM', 150, 432, { fonte: 'Lambe', tam: 118, fill: '#141414', ancora: 'middle' })}
    ${texto('PESADO', 150, 500, { fonte: 'Lambe', tam: 64, fill: '#b3201e', ancora: 'middle' })}
    <rect x="62" y="516" width="176" height="4" fill="#141414"/>
    ${texto('SEXTA · 23H', 150, 552, { fonte: 'Lambe', tam: 30, fill: '#141414', ancora: 'middle' })}
    ${texto('ENTRADA PELA LATERAL', 150, 582, { fonte: 'Pixel', tam: 13, fill: '#141414', ancora: 'middle' })}`);
  s += `<polygon points="196,300 248,296 250,372 226,346 214,360" fill="#5a5e64" opacity=".9"/>`;
  // pixação atravessando o meio do portão
  s += pixo('AYO', 470, 246, 1, '#121212', r);
  s += pixo('03', 742, 330, .58, '#121212', r);
  // estêncil de aviso, gasto
  s += `<g opacity=".3" filter="url(#borrao)">${texto('ÁREA RESTRITA · NÍVEL 3', 640, 752, { fonte: 'BlackOps', tam: 50, fill: '#ffffff', ancora: 'middle' })}</g>
    ${texto('ÁREA RESTRITA · NÍVEL 3', 640, 752, { fonte: 'BlackOps', tam: 50, fill: '#ffffff', ancora: 'middle' })}`;
  // barra inferior, puxador e cadeado de latão
  s += `<rect y="${h - 50}" width="${w}" height="50" fill="#45484e"/><rect y="${h - 50}" width="${w}" height="6" fill="#9aa0a6"/>`;
  s += `<rect x="560" y="${h - 38}" width="160" height="16" rx="6" fill="#26282c"/><rect x="566" y="${h - 36}" width="148" height="4" fill="#6b7077"/>`;
  s += `<path d="M626 ${h - 66} V${h - 86} C626 ${h - 112} 654 ${h - 112} 654 ${h - 86} V${h - 66}" fill="none" stroke="#5c5f64" stroke-width="8"/>
    <rect x="612" y="${h - 70}" width="56" height="46" rx="6" fill="#c19a4e"/><rect x="616" y="${h - 66}" width="48" height="8" fill="#e8c77a"/><circle cx="640" cy="${h - 46}" r="6" fill="#3a2a10"/><rect x="637" y="${h - 44}" width="6" height="12" fill="#3a2a10"/>`;
  // poeira mais escura no pé do portão
  s += `<rect y="${h - 220}" width="${w}" height="220" fill="url(#pe)"/>`;
  const pe = linear('pe', [[0, '#1a1410', 0], [1, '#1a1410', .35]]);
  s += luz;
  // luz verde do CRT vazando por baixo do portão fechado
  s += `<rect y="${h - 10}" width="${w}" height="10" fill="url(#fresta)"/>`;
  return { nome: 'portao', w, h, alfa: false, paleta: paletaRua, svg: svg(w, h, s, defs + pe) };
}

// ───────────────────────── Fachada com o vão do portão (transparente) ─────────────────────────
export function fachada() {
  const w = 1600, h = 1000, r = sorteio(77);
  const { defs: defsLuz, luz } = mapaLuzRua('lf', w, h, 0, 0);
  const defs = defsLuz
    + radial('neon', [[0, '#39ff6a', .7], [.5, '#39ff6a', .3], [1, '#39ff6a', 0]])
    + radial('cone', [[0, '#ffe2a8', .5], [.6, '#ffb860', .14], [1, '#ffb860', 0]], { cy: 0, r: 1 })
    + linear('escorre', [[0, '#1d1d1d', .7], [1, '#1d1d1d', 0]]);
  const furo = `M0 0 H${w} V${h} H0 Z M${vao.x} ${vao.y} V${vao.y + vao.h} H${vao.x + vao.w} V${vao.y} Z`;
  let blocos = '';
  for (let y = 0, linha = 0; y < h; y += 52, linha++) {
    for (let x = linha % 2 ? -61 : 0; x < w; x += 122) {
      const tom = Math.round(r.entre(150, 178));
      blocos += `<rect x="${x + 2}" y="${y + 2}" width="118" height="48" fill="rgb(${tom},${tom + 1},${tom + 4})"/>`;
    }
  }
  let s = `<defs><clipPath id="parede"><path d="${furo}" clip-rule="evenodd"/></clipPath></defs><g clip-path="url(#parede)">`;
  s += `<rect width="${w}" height="${h}" fill="#7c7f84"/>${blocos}`;
  s += `<rect width="${w}" height="${h}" filter="url(#mancha)" opacity=".22"/>`;
  // escorridos de água sob a viga
  for (let i = 0; i < 18; i++) { const x = r.entre(140, 1460); s += `<rect x="${n(x)}" y="140" width="${n(r.entre(6, 22))}" height="${n(r.entre(60, 220))}" fill="url(#escorre)"/>`; }
  // ── lado esquerdo: câmera de vigilância, placa de lan house e caixa de medição com aviso de alta tensão
  s += `<rect x="20" y="186" width="14" height="44" fill="#55595e"/><path d="M34 206 H58 L68 214" fill="none" stroke="#55595e" stroke-width="7"/>
    <path d="M60 192 L128 204 L126 228 L58 218 Z" fill="#eceef0"/><path d="M60 192 L128 204 L127 210 L59 199 Z" fill="#ffffff"/><path d="M128 200 L142 202 L140 232 L126 230 Z" fill="#a9adb2"/><circle cx="134" cy="216" r="6" fill="#141414"/>`;
  s += `<rect x="30" y="262" width="96" height="390" fill="#2a2a2a"/><rect x="36" y="268" width="84" height="378" fill="#f6d65a"/><rect x="42" y="274" width="72" height="366" fill="none" stroke="#a3201b" stroke-width="3"/>
    ${texto('LAN HOUSE', 96, 630, { tam: 52, fill: '#5a1410', rot: -90 })}${texto('LAN HOUSE', 92, 626, { tam: 52, fill: '#c4241e', rot: -90 })}`;
  s += `<rect x="28" y="770" width="104" height="132" fill="#8d9196"/><rect x="28" y="770" width="104" height="6" fill="#b8bcc0"/><rect x="40" y="790" width="80" height="44" fill="#26282c"/>
    <rect x="48" y="800" width="64" height="12" fill="#d8d4c4"/><rect x="52" y="803" width="7" height="6" fill="#141414"/><rect x="62" y="803" width="7" height="6" fill="#141414"/><rect x="72" y="803" width="7" height="6" fill="#141414"/><rect x="82" y="803" width="7" height="6" fill="#a3201b"/>
    <path d="M80 846 L106 890 L54 890 Z" fill="#e2b93b" stroke="#141414" stroke-width="4" stroke-linejoin="round"/><path d="M83 856 L72 874 L80 874 L76 886 L89 868 L81 868 Z" fill="#141414"/>`;
  // ── lado direito: placa de rua, eletroduto e cartaz de procura-se
  s += `<rect x="1456" y="170" width="136" height="86" rx="5" fill="#f4f2ea"/><rect x="1461" y="175" width="126" height="76" rx="4" fill="#2a63c4"/>
    ${texto('ZONA', 1524, 207, { fonte: 'Pixel', tam: 24, fill: '#f4f2ea', ancora: 'middle' })}${texto('FRANCA', 1524, 237, { fonte: 'Pixel', tam: 24, fill: '#f4f2ea', ancora: 'middle' })}`;
  s += `<rect x="1520" y="240" width="14" height="760" fill="#8a8e93"/><rect x="1520" y="240" width="4" height="760" fill="#b8bcc0"/>`;
  for (const y of [300, 520, 760, 940]) s += `<rect x="1514" y="${y}" width="26" height="10" fill="#55595e"/>`;
  s += `<rect x="1502" y="440" width="50" height="58" fill="#8d9196"/><rect x="1502" y="440" width="50" height="5" fill="#b8bcc0"/><circle cx="1527" cy="470" r="6" fill="#55595e"/>`;
  s += papelRasgado(r, 1454, 572, 130, 188, '#e2dccb', 4, `
    ${texto('PROCURA-SE', 1519, 602, { fonte: 'Lambe', tam: 26, fill: '#141414', ancora: 'middle' })}
    ${usar('androide', 1478, 610, 82, 102, '#141414', 'style="--corte:#e2dccb"')}
    ${texto('ANDROIDE', 1519, 742, { fonte: 'Lambe', tam: 28, fill: '#a3201b', ancora: 'middle' })}`);
  // fios soltos da rua
  s += `<g fill="none" stroke="#141414" stroke-linecap="round"><path d="M0 46 C300 96 520 40 800 70 S1300 30 1600 80" stroke-width="6"/><path d="M0 88 C120 120 140 180 150 250" stroke-width="5"/><path d="M1600 120 C1540 150 1500 190 1480 260" stroke-width="5"/></g>`;
  s += `</g>`;
  // ── batente de aço, viga com rebites, letreiro pintado à mão e as duas arandelas
  s += `<rect x="${vao.x - 26}" y="${vao.y - 26}" width="26" height="${vao.h + 26}" fill="#4a4e54"/><rect x="${vao.x - 26}" y="${vao.y - 26}" width="5" height="${vao.h + 26}" fill="#7d8186"/>`;
  s += `<rect x="${vao.x + vao.w}" y="${vao.y - 26}" width="26" height="${vao.h + 26}" fill="#3e4247"/>`;
  s += `<rect x="${vao.x - 26}" y="${vao.y - 62}" width="${vao.w + 52}" height="62" fill="#5a5e64"/><rect x="${vao.x - 26}" y="${vao.y - 62}" width="${vao.w + 52}" height="6" fill="#9aa0a6"/><rect x="${vao.x - 26}" y="${vao.y - 8}" width="${vao.w + 52}" height="8" fill="#2a2c30"/>`;
  for (let x = vao.x - 10; x < vao.x + vao.w + 20; x += 58) s += `<circle cx="${x}" cy="${vao.y - 32}" r="4" fill="#9aa0a6"/><circle cx="${x + 1}" cy="${vao.y - 31}" r="2" fill="#3a3d42"/>`;
  s += `<rect x="604" y="${vao.y - 58}" width="392" height="54" fill="#2a0e0b"/><rect x="608" y="${vao.y - 56}" width="384" height="48" fill="#a3271f"/><rect x="614" y="${vao.y - 51}" width="372" height="38" fill="none" stroke="#e8dcc0" stroke-width="2"/>
    ${texto('GARAGEM 03', 803, vao.y - 18, { tam: 34, fill: '#2a0e0b', ancora: 'middle' })}${texto('GARAGEM 03', 800, vao.y - 21, { tam: 34, fill: '#efe3c4', ancora: 'middle' })}`;
  for (const l of lampadas) s += `<rect x="${l.x - 30}" y="${l.y - 26}" width="60" height="22" fill="#26282c"/><rect x="${l.x - 24}" y="${l.y - 6}" width="48" height="10" fill="#3a3d42"/>`;
  s += luz.replace('<g style="mix-blend-mode:multiply">', multiplicar('', 'parede').replace('</g>', ''));
  // o que emite luz não é escurecido: lentes das arandelas, cone de luz, neon e LED da câmera
  for (const l of lampadas) s += `<path d="M${l.x - 70} ${l.y + 4} L${l.x + 70} ${l.y + 4} L${l.x + 26} ${l.y - 4} L${l.x - 26} ${l.y - 4} Z" fill="url(#cone)" transform="translate(0 0)"/><rect x="${l.x - 22}" y="${l.y + 2}" width="44" height="6" fill="#fff3d6"/>`;
  s += `<g clip-path="url(#parede)">`;
  for (let i = 0; i < 60; i++) {
    const l = r.um(lampadas), x = l.x + r.entre(-260, 260), y = r.entre(20, 130);
    if (x > vao.x - 30 && x < vao.x + vao.w + 30 && y > vao.y - 70) continue;
    s += `<path d="M${n(x)} ${n(y)} l-5 16" stroke="#ffe2a8" stroke-width="2" opacity="${n(r.entre(.3, .6))}"/>`;
  }
  s += `<ellipse cx="80" cy="704" rx="90" ry="50" fill="url(#neon)"/>${texto('ONLINE', 80, 716, { fonte: 'Pixel', tam: 26, fill: '#b8ffcb', ancora: 'middle' })}
    <rect x="22" y="726" width="116" height="3" fill="#39ff6a"/><circle cx="134" cy="216" r="3" fill="#ff3b30"/></g>`;
  return { nome: 'fachada', w, h, alfa: true, paleta: paletaRua, svg: svg(w, h, s, defs) };
}

// ───────────────────────── Interior da garagem (aparece atrás do portão) ─────────────────────────
// Só a tela do terminal acende o cômodo; pela porta entra um resto da luz de sódio da rua.
export function garagem() {
  const w = 1600, h = 1000, r = sorteio(1983);
  const tela = { x: 676, y: 492, w: 248, h: 156 };
  const defs = radial('crt', [[0, '#e6fff0'], [.12, '#9cf0b0'], [.32, '#3f9a5a'], [.6, '#173a24'], [1, '#0b130e', 0]], { cx: 800, cy: 600, r: 760, unidades: 'userSpaceOnUse' })
    + linear('sodioChao', [[0, '#ffb45c', 0], [1, '#ffb45c', .55]])
    + radial('halo', [[0, '#7dff9e', .55], [.5, '#39ff6a', .18], [1, '#39ff6a', 0]])
    + linear('vidro', [[0, '#b8ffcb'], [1, '#39ff6a']]);
  let s = `<rect width="${w}" height="${h}" fill="#3a2a22"/>`;
  // parede de tijolos e reboco descascado
  const tons = ['#8a4a34', '#7a4030', '#93533b', '#6e3a2b', '#9a5a40'];
  for (let y = 0, linha = 0; y < 770; y += 34, linha++) for (let x = linha % 2 ? -40 : 0; x < w; x += 82) s += `<rect x="${x + 3}" y="${y + 3}" width="76" height="28" fill="${r.um(tons)}"/>`;
  s += `<path d="M690 0 C700 50 660 90 712 128 C756 160 730 196 790 214 L842 210 C880 172 860 130 902 104 C930 76 900 40 916 0 Z" fill="#9c958a"/>`;
  s += `<rect width="${w}" height="770" filter="url(#mancha)" opacity=".35"/>`;
  // piso de cimento
  s += `<rect y="770" width="${w}" height="230" fill="#77746e"/><rect y="770" width="${w}" height="8" fill="#9a968e"/><rect y="770" width="${w}" height="230" filter="url(#mancha)" opacity=".3"/>`;
  // cartaz do kaiju na orla (Godzilla) e cartaz da megaestrutura (BLAME!)
  s += papelRasgado(r, 236, 190, 210, 280, '#e8e2d0', -3, `<rect x="250" y="204" width="182" height="200" fill="#2a2a2a"/>
    <rect x="250" y="330" width="182" height="74" fill="#1a1a1a"/>${usar('kaiju', 300, 214, 120, 128, '#d8d2c0', 'style="--corte:#2a2a2a"')}
    ${[[252, 360, 22], [276, 346, 18], [296, 366, 26], [324, 352, 16], [342, 340, 24], [368, 358, 20], [390, 346, 28], [420, 362, 12]].map(([x, y, l]) => `<rect x="${x}" y="${y}" width="${l}" height="${404 - y}" fill="#0e0e0e"/>`).join('')}
    ${texto('KAIJU NA ORLA', 341, 446, { fonte: 'Lambe', tam: 34, fill: '#1a1a1a', ancora: 'middle' })}`);
  let mega = '';
  for (const [x, y, l] of [[1166, 196, 34], [1204, 180, 22], [1230, 210, 46], [1280, 176, 26], [1310, 200, 30]]) {
    mega += `<rect x="${x}" y="${y}" width="${l}" height="${400 - y}" fill="#3c3c3c"/>`;
    for (let yy = y + 10; yy < 398; yy += 16) mega += `<rect x="${x}" y="${yy}" width="${l}" height="3" fill="#202020"/>`;
  }
  mega += `<rect x="1160" y="300" width="190" height="5" fill="#6a6a6a"/><rect x="1236" y="296" width="3" height="9" fill="#0a0a0a"/>`;
  s += papelRasgado(r, 1150, 170, 212, 290, '#1a1a1a', 2, `<rect x="1160" y="180" width="192" height="222" fill="#5a5a5a"/>${mega}
    ${texto('MANAUS 2099', 1256, 432, { fonte: 'Lambe', tam: 34, fill: '#d8d2c0', ancora: 'middle' })}${texto('MEGAESTRUTURA · NÍVEL -3000', 1256, 450, { fonte: 'Pixel', tam: 11, fill: '#a8a294', ancora: 'middle' })}`);
  // flyer pós-punk com o sinal do pulsar, acima da bancada
  let pulsar = '';
  for (let i = 0; i < 14; i++) {
    const base = 318 + i * 6, pts = [];
    for (let x = 990; x <= 1080; x += 3) { const env = Math.exp(-((x - 1035) ** 2) / (2 * 13 ** 2)); pts.push(`${x},${n(base - env * 18 * (.45 + r() * .55) - r() * 1.2)}`); }
    pulsar += `<polygon points="990,${base + 2} ${pts.join(' ')} 1080,${base + 2}" fill="#141414"/><polyline points="${pts.join(' ')}" fill="none" stroke="#e8e2d0" stroke-width="1.6"/>`;
  }
  s += papelRasgado(r, 980, 290, 110, 150, '#141414', 4, `${pulsar}${texto('SEXTA · 23H', 1035, 428, { fonte: 'Pixel', tam: 11, fill: '#e8e2d0', ancora: 'middle' })}`);
  // prateleira à esquerda: rádio, caixa de som e estação de solda
  s += `<rect x="200" y="590" width="330" height="14" fill="#6b4a2e"/><rect x="214" y="604" width="10" height="40" fill="#4a3220"/><rect x="506" y="604" width="10" height="40" fill="#4a3220"/>
    <rect x="216" y="520" width="150" height="70" rx="6" fill="#4a4c50"/><circle cx="252" cy="556" r="22" fill="#26282c"/><circle cx="330" cy="556" r="22" fill="#26282c"/><rect x="272" y="530" width="38" height="12" fill="#9aa0a6"/><path d="M236 520 L262 496 H320 L346 520" fill="none" stroke="#6b6e73" stroke-width="5"/>
    <rect x="384" y="500" width="120" height="90" fill="#2a2c30"/><circle cx="444" cy="540" r="30" fill="#141414"/><circle cx="444" cy="540" r="11" fill="#3a3c40"/><rect x="392" y="576" width="104" height="6" fill="#141414"/>
    <rect x="236" y="720" width="250" height="50" fill="#3a3c40"/><rect x="250" y="732" width="80" height="22" fill="#141414"/><circle cx="420" cy="744" r="12" fill="#6b6e73"/><path d="M460 720 C470 690 500 690 512 660" fill="none" stroke="#3a3c40" stroke-width="6"/>`;
  // rack à direita
  s += `<rect x="1130" y="500" width="200" height="300" fill="#2a2c30"/><rect x="1130" y="500" width="200" height="8" fill="#55595e"/>`;
  for (let i = 0; i < 7; i++) s += `<rect x="1142" y="${518 + i * 38}" width="176" height="30" fill="#3d4045"/><rect x="1196" y="${528 + i * 38}" width="100" height="5" fill="#1a1b1e"/>`;
  // bancada com o terminal pequeno: a mesma tela que a próxima seção mostra de perto
  s += `<rect x="500" y="700" width="600" height="22" fill="#7a5634"/><rect x="500" y="700" width="600" height="5" fill="#a3784a"/><rect x="520" y="722" width="20" height="230" fill="#4a3220"/><rect x="1060" y="722" width="20" height="230" fill="#4a3220"/>
    <rect x="560" y="722" width="200" height="90" fill="#5e4229"/><rect x="560" y="764" width="200" height="4" fill="#3a2818"/><rect x="646" y="740" width="28" height="6" fill="#a3784a"/><rect x="646" y="782" width="28" height="6" fill="#a3784a"/>`;
  s += `<path d="M640 470 L960 470 L976 486 V690 L960 700 H640 L624 690 V486 Z" fill="#4a4d52"/><rect x="${tela.x - 10}" y="${tela.y - 10}" width="${tela.w + 20}" height="${tela.h + 20}" fill="#1a1b1e"/>
    <rect x="640" y="660" width="320" height="30" fill="#3a3c40"/><rect x="652" y="668" width="60" height="14" fill="#e09a1c"/><path d="M652 682 L666 668 M664 682 L678 668 M676 682 L690 668 M688 682 L702 668" stroke="#2a1c06" stroke-width="5"/>
    <rect x="620" y="690" width="360" height="10" fill="#2a2c30"/><rect x="700" y="704" width="200" height="12" rx="3" fill="#3a3c40"/>`;
  // cadeira de frente para a bancada, de costas para quem chega
  s += `<path d="M720 760 H880 L872 880 H728 Z" fill="#26282c"/><rect x="716" y="880" width="168" height="26" rx="6" fill="#2f3135"/><rect x="792" y="906" width="16" height="50" fill="#1e1f22"/>
    <path d="M730 980 L800 956 L870 980" fill="none" stroke="#1e1f22" stroke-width="10"/><circle cx="730" cy="984" r="8" fill="#141414"/><circle cx="870" cy="984" r="8" fill="#141414"/><circle cx="800" cy="990" r="8" fill="#141414"/>`;
  // cabos: do teto, da bancada para o rack e pelo chão
  s += `<g fill="none" stroke="#1a1b1e" stroke-linecap="round"><path d="M0 60 C300 170 520 40 800 130 S1300 40 1600 160" stroke-width="9"/><path d="M800 0 V150" stroke-width="4"/>
    <path d="M960 660 C1040 640 1080 600 1130 560" stroke-width="7"/><path d="M640 690 C560 760 420 800 300 900 S120 980 0 960" stroke-width="7"/><path d="M1080 950 C1180 900 1260 940 1330 800" stroke-width="6"/></g>
    <path d="M790 150 H810 L816 178 C816 196 784 196 784 178 Z" fill="#3a3c40"/>`;
  // luz: só o CRT acende o cômodo, mais um resto de sódio no chão perto da porta
  s += multiplicar(`<rect width="${w}" height="${h}" fill="#0b130e"/>${somar(`<rect width="${w}" height="${h}" fill="url(#crt)"/><polygon points="40,${h} 1560,${h} 1340,860 260,860" fill="url(#sodioChao)"/>`)}`);
  // o que emite luz
  s += `<rect x="${tela.x}" y="${tela.y}" width="${tela.w}" height="${tela.h}" fill="#062a12"/><ellipse cx="800" cy="570" rx="230" ry="150" fill="url(#halo)"/>`;
  const nos = [[800, 570], [740, 530], [860, 530], [710, 590], [890, 590], [760, 625], [840, 625], [800, 515]];
  s += `<g stroke="#39ff6a" stroke-width="2.5" fill="none">${nos.slice(1).map(([x, y]) => `<path d="M800 570 L${x} ${y}"/>`).join('')}${nos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#0b3a17"/>`).join('')}</g>`;
  for (const [x, y] of [[700, 510], [905, 515], [690, 630], [910, 632], [800, 642]]) s += `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="#ff3b30" transform="rotate(45 ${x} ${y})"/>`;
  for (let y = tela.y; y < tela.y + tela.h; y += 4) s += `<rect x="${tela.x}" y="${y}" width="${tela.w}" height="1.5" fill="#000" opacity=".35"/>`;
  s += `<circle cx="944" cy="676" r="5" fill="#39ff6a"/>`;
  for (let i = 0; i < 7; i++) s += `<rect x="1150" y="${526 + i * 38}" width="7" height="7" fill="${i % 3 ? '#39ff6a' : '#ff3b30'}"/><rect x="1162" y="${526 + i * 38}" width="7" height="7" fill="${i % 2 ? '#39ff6a' : '#1a1b1e'}"/>`;
  s += `<rect x="226" y="526" width="8" height="5" fill="#ff3b30"/><rect x="258" y="736" width="40" height="8" fill="#39ff6a"/>`;
  return { nome: 'garagem', w, h, alfa: false, paleta: paletaGaragem, svg: svg(w, h, s, defs) };
}
const paletaGaragem = [
  '#030604', '#07100a', '#0d1b11', '#16301c', '#22492b', '#33683e', '#4f9160', '#7cc98d', '#c6f5cf', '#39ff6a',
  '#1f0f0b', '#3a1a10', '#5e2c18', '#7a5a2e', '#d39a4a', '#c4161c', '#e09a1c'
];

// ───────────────────────── Terminal grande (tela transparente) ─────────────────────────
// Futurismo de fita cassete (os consoles de Alien, de 1979, e os painéis de Evangelion): chapa de grafite
// parafusada, faixa de perigo, etiquetas de rotuladora, VU de sinal, botões rotativos e LED de energia.
// A tela recebe a árvore de habilidades em HTML/SVG; no CSS ela fica em left 5.75%, top 8.077%, 88.5% × 76.923%.
export const telaTerm = { x: 92, y: 84, w: 1416, h: 800, chanfro: 14 };
export function terminal() {
  const w = 1600, h = 1040, r = sorteio(2026), t = telaTerm, c = t.chanfro;
  const furo = `M0 0 H${w} V${h} H0 Z M${t.x + c} ${t.y} H${t.x + t.w - c} L${t.x + t.w} ${t.y + c} V${t.y + t.h - c} L${t.x + t.w - c} ${t.y + t.h} H${t.x + c} L${t.x} ${t.y + t.h - c} V${t.y + c} Z`;
  const casca = 'M44 16 H1556 L1584 44 V978 L1556 1006 H44 L16 978 V44 Z';
  const defs = `<clipPath id="corpoT"><path d="${furo}" clip-rule="evenodd"/></clipPath><clipPath id="cascaT"><path d="${casca}"/></clipPath>`
    + linear('chapa', [[0, '#7d838a'], [.08, '#60666d'], [.55, '#50555c'], [1, '#3e4248']])
    + linear('ambiente', [[0, '#e8ecf0'], [.5, '#a9b0ba'], [1, '#6b7280']])
    + radial('vu', [[0, '#fff6dc'], [1, '#d8cba4']], { cy: .9, r: .9 });
  let s = `<g clip-path="url(#corpoT)">`;
  s += `<path d="${casca}" fill="url(#chapa)"/><path d="M44 16 H1556 L1572 32 H28 Z" fill="#aeb3b8"/><rect x="16" y="910" width="1568" height="96" fill="#2c2f34"/><rect x="16" y="910" width="1568" height="4" fill="#e09a1c"/>`;
  // moldura funda em volta da tela, com chanfro
  s += `<rect x="${t.x - 26}" y="${t.y - 26}" width="${t.w + 52}" height="${t.h + 46}" rx="8" fill="#26292d"/><rect x="${t.x - 26}" y="${t.y - 26}" width="${t.w + 52}" height="6" fill="#16181b"/>
    <rect x="${t.x - 12}" y="${t.y - 12}" width="${t.w + 24}" height="${t.h + 24}" rx="4" fill="#0b0c0d"/>`;
  // parafusos nos cantos da chapa
  for (const [x, y] of [[40, 50], [1560, 50], [40, 960], [1560, 960], [800, 40]]) s += `<circle cx="${x}" cy="${y}" r="10" fill="#3c4046"/><circle cx="${x}" cy="${y}" r="7" fill="#aeb3b8"/><path d="M${x - 5} ${y + 3} L${x + 5} ${y - 3}" stroke="#3c4046" stroke-width="3"/>`;
  // faixa superior: perigo, etiquetas de rotuladora e o decalque do drakkar
  s += `<rect x="70" y="26" width="200" height="34" fill="#e09a1c"/>`;
  for (let x = 54; x < 270; x += 26) s += `<path d="M${x} 60 L${x + 16} 26 H${x + 28} L${x + 12} 60 Z" fill="#17181b"/>`;
  s += `<rect x="62" y="22" width="216" height="42" fill="none" stroke="#17181b" stroke-width="5"/>`;
  const dymo = (x, y, larg, fita, letra, rotulo, rot = 0) => `<g transform="rotate(${rot} ${x + larg / 2} ${y + 18})"><rect x="${x}" y="${y}" width="${larg}" height="36" rx="3" fill="${fita}"/><rect x="${x}" y="${y}" width="${larg}" height="5" fill="#fff" opacity=".18"/>${texto(rotulo, x + larg / 2, y + 26, { fonte: 'Pixel', tam: 20, fill: letra, ancora: 'middle', extra: 'letter-spacing="2"' })}</g>`;
  s += dymo(310, 25, 262, '#17181b', '#f0ebdc', 'SOFTWARE LIVRE', -1);
  s += `${usar('drakkar', 1300, 22, 66, 44, '#dfe2e4', 'style="--corte:#60666d"')}${texto('RUMO A OESTE', 1376, 52, { fonte: 'Pixel', tam: 15, fill: '#dfe2e4' })}`;
  // painel inferior: alto-falante, etiqueta 0xDEADBEEF, placa do modelo, VU, botões e energia
  for (let y = 930; y < 992; y += 12) for (let x = 64; x < 300; x += 12) s += `<rect x="${x}" y="${y}" width="6" height="6" fill="#0e0f11"/>`;
  s += dymo(336, 942, 238, '#b3161b', '#f0ebdc', '0xDEADBEEF');
  s += `<rect x="640" y="934" width="320" height="56" rx="4" fill="#0e0f11"/><rect x="644" y="938" width="312" height="48" rx="3" fill="#aeb3b8"/><rect x="644" y="938" width="312" height="6" fill="#dfe2e4"/>
    ${texto('TTY 03 · GARAGEM', 800, 971, { fonte: 'Pixel', tam: 22, fill: '#17181b', ancora: 'middle' })}`;
  s += `<rect x="1040" y="926" width="190" height="70" rx="4" fill="#0e0f11"/><rect x="1048" y="932" width="174" height="58" rx="3" fill="url(#vu)"/>`;
  for (let i = 0; i <= 10; i++) {
    const ang = Math.PI * (1.15 + i * .07), ext = i % 5 ? 52 : 46;
    s += `<path d="M${n(1135 + Math.cos(ang) * 62)} ${n(988 + Math.sin(ang) * 62)} L${n(1135 + Math.cos(ang) * ext)} ${n(988 + Math.sin(ang) * ext)}" stroke="${i > 7 ? '#b3161b' : '#17181b'}" stroke-width="3"/>`;
  }
  s += `<path d="M1135 986 L1170 946" stroke="#17181b" stroke-width="3"/><circle cx="1135" cy="986" r="5" fill="#17181b"/>${texto('SINAL', 1060, 984, { fonte: 'Pixel', tam: 11, fill: '#17181b' })}`;
  for (const [x, rot, rotulo] of [[1290, -40, 'BRILHO'], [1380, 30, 'CONTR.']]) {
    s += `<circle cx="${x}" cy="956" r="24" fill="#0e0f11"/><circle cx="${x}" cy="956" r="19" fill="#5a5f66"/><circle cx="${x}" cy="954" r="15" fill="#7f858c"/><path d="M${x} 956 L${x} 938" stroke="#f0ebdc" stroke-width="4" transform="rotate(${rot} ${x} 956)"/>
      ${texto(rotulo, x, 997, { fonte: 'Pixel', tam: 11, fill: '#aeb3b8', ancora: 'middle' })}`;
  }
  s += `<rect x="1452" y="932" width="40" height="54" rx="4" fill="#0e0f11"/><rect x="1460" y="938" width="24" height="22" rx="2" fill="#aeb3b8"/>${texto('PWR', 1532, 997, { fonte: 'Pixel', tam: 11, fill: '#aeb3b8', ancora: 'middle' })}`;
  // luz: ambiente frio de cima; a tela acende de verde a borda funda (o resto da chapa só pega o ambiente)
  s += multiplicar(`<rect width="${w}" height="${h}" fill="url(#ambiente)"/>`, 'cascaT');
  s += `<g clip-path="url(#cascaT)" style="mix-blend-mode:screen"><rect x="${t.x - 16}" y="${t.y - 16}" width="${t.w + 32}" height="${t.h + 32}" rx="10" fill="none" stroke="#39ff6a" stroke-width="22" opacity=".12" filter="url(#borraoG)"/></g>`;
  s += `<circle cx="1532" cy="958" r="9" fill="#39ff6a"/><circle cx="1532" cy="958" r="16" fill="#39ff6a" opacity=".25"/>`;
  s += `</g>`;
  // pés de borracha
  s += `<rect x="240" y="1006" width="220" height="26" rx="6" fill="#17181b"/><rect x="1140" y="1006" width="220" height="26" rx="6" fill="#17181b"/>`;
  return { nome: 'terminal', w, h, alfa: true, paleta: paletaTerminal, svg: svg(w, h, s, defs) };
}
const paletaTerminal = [
  '#060607', '#0e0f11', '#17181b', '#222428', '#2f3236', '#40444a', '#5a5f66', '#7f858c', '#aeb3b8', '#dfe2e4',
  '#2a1c06', '#e09a1c', '#ffd27a', '#39ff6a', '#0f4a22', '#b3161b', '#f0ebdc'
];

// ───────────────────────── Parede atrás do terminal (fundo da árvore) ─────────────────────────
// Reboco velho, eletrodutos e um esquema de circuito a giz; a única luz é o verde da tela no centro.
export function parede() {
  const w = 1600, h = 1000, r = sorteio(404);
  const defs = radial('brilhoT', [[0, '#d8ffe2'], [.2, '#7fd99a'], [.45, '#2f6e44'], [.75, '#10241a'], [1, '#0a120d', 0]], { cx: 800, cy: 560, r: 900, unidades: 'userSpaceOnUse' });
  let s = `<rect width="${w}" height="${h}" fill="#8e958c"/><rect width="${w}" height="${h}" filter="url(#mancha)" opacity=".12"/>`;
  // eletrodutos com caixas de passagem
  s += `<rect y="110" width="${w}" height="16" fill="#6b706a"/><rect y="110" width="${w}" height="4" fill="#b8beb5"/>`;
  for (const x of [130, 1470]) s += `<rect x="${x}" y="126" width="16" height="874" fill="#6b706a"/><rect x="${x}" y="126" width="4" height="874" fill="#b8beb5"/><rect x="${x - 22}" y="330" width="60" height="70" fill="#7a8079"/><rect x="${x - 22}" y="330" width="60" height="5" fill="#c4cac1"/>`;
  for (let x = 60; x < w; x += 190) s += `<rect x="${x}" y="104" width="10" height="28" fill="#4a4e49"/>`;
  // esquema a giz: fonte de 5 V, resistor de 220 R, LED, capacitor e terra
  const g = (dx, dy) => `${180 + dx} ${210 + dy}`;
  s += `<g fill="none" stroke="#f4fbf2" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M${g(0, 70)} H${g(40, 70).split(' ')[0]} M${g(8, 86)} H${g(32, 86).split(' ')[0]}"/>
    <path d="M${g(20, 70)} V${210 + 20} H${180 + 70} L${g(80, 4)} L${g(94, 36)} L${g(108, 4)} L${g(122, 36)} L${g(136, 4)} L${g(150, 36)} L${g(160, 20)} H${180 + 210}"/>
    <path d="M${g(210, 2)} V${210 + 38} L${g(240, 20)} Z M${g(240, 2)} V${210 + 38}"/>
    <path d="M${g(246, -4)} L${g(262, -20)} M${g(254, 8)} L${g(270, -8)}"/>
    <path d="M${g(240, 20)} H${180 + 300} V${210 + 70} M${g(280, 70)} H${180 + 320} M${g(280, 86)} H${180 + 320} M${g(300, 86)} V${210 + 130}"/>
    <path d="M${g(20, 86)} V${210 + 130} H${180 + 300} M${g(278, 140)} H${180 + 322} M${g(286, 150)} H${180 + 314} M${g(294, 160)} H${180 + 306}"/></g>
  ${texto('+5V', 112, 286, { fonte: 'Marker', tam: 28, fill: '#f4fbf2' })}${texto('R1 220R', 258, 194, { fonte: 'Marker', tam: 28, fill: '#f4fbf2' })}${texto('D1', 384, 304, { fonte: 'Marker', tam: 28, fill: '#f4fbf2' })}${texto('C1 10uF', 512, 306, { fonte: 'Marker', tam: 28, fill: '#f4fbf2' })}`;
  // cabo enrolado pendurado num prego, à direita
  s += `<circle cx="1300" cy="200" r="6" fill="#2a2c2a"/><g fill="none" stroke="#1d1f1d" stroke-width="8">${[0, 1, 2, 3].map(i => `<ellipse cx="${1300 + i * 4}" cy="${262 + i * 3}" rx="${58 - i * 4}" ry="${66 - i * 3}"/>`).join('')}</g><path d="M1330 320 C1340 420 1280 520 1320 640" fill="none" stroke="#1d1f1d" stroke-width="7"/>`;
  // tampo da bancada embaixo da tela
  s += `<rect y="900" width="${w}" height="100" fill="#7a5634"/><rect y="900" width="${w}" height="7" fill="#b48a5a"/><rect y="930" width="${w}" height="3" fill="#5e4229"/>`;
  s += multiplicar(`<rect width="${w}" height="${h}" fill="#0a120d"/>${somar(`<rect width="${w}" height="${h}" fill="url(#brilhoT)"/>`)}`);
  return { nome: 'parede', w, h, alfa: false, paleta: ['#020403', '#050a06', '#0a140d', '#112016', '#1a3122', '#27482f', '#3a6a47', '#5c9a6c', '#9fd6aa', '#1a1510', '#2c241b', '#4a3a28'], svg: svg(w, h, s, defs) };
}

// ───────────────────────── Parede de azulejos sob luz fria (fundo do Sobre) ─────────────────────────
// Meia parede de azulejo branco e reboco pintado em cima, com uma lâmpada fluorescente: um corredor de Silent Hill.
export function mural() {
  const w = 1600, h = 1000, r = sorteio(1999);
  const defs = radial('tubo', [[0, '#f6fcff'], [.22, '#c4d2d6'], [.55, '#5d6c72'], [1, '#1c2428']], { cx: 800, cy: 40, r: 1050, unidades: 'userSpaceOnUse' })
    + linear('mofo', [[0, '#2d3a24', 0], [1, '#2d3a24', .65]])
    + linear('escorreM', [[0, '#5e5038', .55], [1, '#5e5038', 0]])
    + linear('umidade', [[0, '#5e5038', 0], [1, '#5e5038', .45]]);
  let s = `<rect width="${w}" height="${h}" fill="#a7b8ad"/><rect width="${w}" height="400" filter="url(#mancha)" opacity=".12"/>`;
  // umidade subindo pelo reboco e trincas finas
  s += `<rect y="300" width="${w}" height="90" fill="url(#umidade)"/>`;
  for (const [x, y] of [[300, 120], [1180, 200], [760, 260]]) s += `<path d="M${x} ${y} l14 26 l-8 22 l18 30 l-6 24" fill="none" stroke="#5c6462" stroke-width="3"/>`;
  // azulejos de 64 com rejunte; alguns trincados, dois faltando
  s += `<rect y="396" width="${w}" height="604" fill="#7f8784"/><rect y="388" width="${w}" height="12" fill="#c9d2cd"/>`;
  for (let y = 404, l = 0; y < h; y += 66, l++) for (let x = 2; x < w; x += 66) {
    const falta = (l === 3 && x === 1124) || (l === 5 && x === 266);
    s += falta ? `<rect x="${x}" y="${y}" width="62" height="62" fill="#4e4a40"/>` : `<rect x="${x}" y="${y}" width="62" height="62" fill="${r() < .1 ? '#dfe5e0' : '#eef2ee'}"/><rect x="${x}" y="${y}" width="62" height="5" fill="#ffffff"/>`;
  }
  for (let i = 0; i < 7; i++) { const x = r.entre(80, 1520), y = r.entre(420, 940); s += `<path d="M${n(x)} ${n(y)} l${n(r.entre(-30, 30))} ${n(r.entre(20, 50))} l${n(r.entre(-20, 20))} ${n(r.entre(16, 40))}" fill="none" stroke="#5c6462" stroke-width="2.5"/>`; }
  for (let i = 0; i < 22; i++) s += `<rect x="${n(r.entre(0, w))}" y="${n(r.entre(392, 600))}" width="${n(r.entre(4, 14))}" height="${n(r.entre(80, 360))}" fill="url(#escorreM)"/>`;
  s += `<rect y="820" width="${w}" height="180" fill="url(#mofo)"/>`;
  // calha da fluorescente
  s += `<rect x="540" y="22" width="520" height="40" rx="4" fill="#3d4447"/><rect x="552" y="58" width="496" height="6" fill="#262c2e"/>`;
  s += multiplicar(`<rect width="${w}" height="${h}" fill="url(#tubo)"/>`);
  s += `<rect x="560" y="50" width="480" height="12" rx="6" fill="#f6fcff"/><rect x="600" y="52" width="40" height="8" fill="#ffffff"/>`;
  return { nome: 'mural', w, h, alfa: false, paleta: ['#0a0d0e', '#141a1c', '#1f282b', '#2d393d', '#41504f', '#5c6c6c', '#7e8f8d', '#a6b5b1', '#cdd8d3', '#eef5f1', '#ffffff', '#3d3426', '#5e5038', '#3c4a32'], svg: svg(w, h, s, defs) };
}

// ───────────────────────── Página de zine em xerox (fundo do texto do Sobre) ─────────────────────────
// Fotocópia de flyer pós-punk: sombra da tampa da copiadora, pontos de toner, dobra central e grampos.
export function zine() {
  const w = 900, h = 1060, r = sorteio(1979);
  const borda = [[30, 34], [868, 26], [874, 1028], [26, 1034]];
  const orelha = 'M800 26 L868 26 L874 98 Z';
  const defs = linear('tampa', [[0, '#0c0c0c', .85], [.035, '#0c0c0c', .35], [.09, '#0c0c0c', 0], [.92, '#0c0c0c', 0], [1, '#0c0c0c', .5]], { x1: 0, y1: 0, x2: 1, y2: 0 })
    + `<clipPath id="folhaZ"><polygon points="${borda.map(p => p.join(',')).join(' ')}"/></clipPath>`
    + `<pattern id="retícula" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="2.4" fill="#0c0c0c"/></pattern>`
    + linear('some', [[0, '#fff', 0], [1, '#fff', 1]]) + `<mask id="degrade"><rect x="0" y="880" width="${w}" height="160" fill="url(#some)"/></mask>`;
  let s = `<g clip-path="url(#folhaZ)"><rect width="${w}" height="${h}" fill="#f1f0eb"/><rect width="${w}" height="${h}" fill="url(#tampa)"/>`;
  // toner espalhado, mais denso nas bordas
  for (let i = 0; i < 900; i++) {
    const x = r() * w, y = r() * h, borda2 = Math.min(x, w - x, y, h - y);
    if (r() * 160 < borda2 && r() > .12) continue;
    s += `<rect x="${n(x)}" y="${n(y)}" width="${n(r.entre(2, 5))}" height="${n(r.entre(2, 4))}" fill="#2a2a2a" opacity="${n(r.entre(.35, .9))}"/>`;
  }
  // retícula de meio-tom no pé da página, sumindo para cima
  s += `<rect x="0" y="880" width="${w}" height="160" fill="url(#retícula)" mask="url(#degrade)" opacity=".35"/>`;
  // dobra central e grampos na dobra
  s += `<rect x="448" y="0" width="3" height="${h}" fill="#bdbdb8"/><rect x="451" y="0" width="2" height="${h}" fill="#ffffff"/>`;
  for (const y of [240, 800]) s += `<rect x="438" y="${y}" width="24" height="6" fill="#8a8a86"/><rect x="438" y="${y}" width="24" height="2" fill="#dcdcd6"/>`;
  s += `</g><path d="${orelha}" fill="#dcdcd6"/><path d="M800 26 L874 98" stroke="#8a8a86" stroke-width="3"/>`;
  return { nome: 'zine', w, h, alfa: true, grade: .4, paleta: ['#0c0c0c', '#2a2a2a', '#555555', '#8a8a86', '#bdbdb8', '#dcdcd6', '#f1f0eb', '#ffffff'], svg: svg(w, h, s, defs) };
}

// ───────────────────────── Mesa de madeira (fundo dos contatos) ─────────────────────────
// Luminária quente vindo de cima à esquerda e o reflexo frio de uma tela à direita.
export function mesa() {
  const w = 1600, h = 1000, r = sorteio(1998);
  const defs = radial('lamp', [[0, '#fff6e2'], [.3, '#ecd2a8'], [.6, '#9a7a5c'], [.88, '#3a2a20'], [1, '#2a1c14', 0]], { cx: 560, cy: 300, r: 1150, unidades: 'userSpaceOnUse' })
    + radial('telaFria', [[0, '#7fe0c8', .7], [.5, '#2f7a6a', .25], [1, '#2f7a6a', 0]], { cx: 1640, cy: 560, r: 560, unidades: 'userSpaceOnUse' });
  let s = `<rect width="${w}" height="${h}" fill="#3a2414"/>`;
  for (let y = -20, i = 0; y < h; y += 118, i++) s += `<rect y="${y}" width="${w}" height="114" fill="${['#a8805a', '#9c7550', '#a47c56', '#96704c', '#ac845e', '#9e7652', '#98724e', '#a27a54', '#9a744f'][i]}"/><rect y="${y + 114}" width="${w}" height="4" fill="#3a2414"/>`;
  for (let i = 0; i < 40; i++) { const y = r.entre(0, h), x = r.entre(0, w); s += `<path d="M${n(x)} ${n(y)} h${n(r.entre(60, 260))}" stroke="#7a5a3e" stroke-width="2.5" opacity=".6"/>`; }
  for (let i = 0; i < 4; i++) s += `<circle cx="${n(r.entre(300, 1300))}" cy="${n(r.entre(300, 950))}" r="${n(r.entre(38, 58))}" fill="none" stroke="#6a4426" stroke-width="5" opacity=".5"/>`;
  // teclado mecânico gasto
  let tec = `<rect x="40" y="690" width="470" height="200" rx="12" fill="#3a3a3a"/><rect x="40" y="690" width="470" height="8" rx="4" fill="#5a5a5a"/>`;
  for (let row = 0; row < 5; row++) for (let col = 0; col < 14; col++) {
    const gasto = r() < .25, fill = row === 0 && col === 0 ? '#c4161c' : row === 2 && col === 13 ? '#39ff6a' : gasto ? '#9a9a94' : '#cfcfc8';
    tec += `<rect x="${56 + col * 32}" y="${708 + row * 34}" width="27" height="28" rx="4" fill="${fill}"/><rect x="${59 + col * 32}" y="${710 + row * 34}" width="21" height="6" rx="2" fill="#fff" opacity="${gasto ? .1 : .3}"/>`;
  }
  s += `<g transform="rotate(-9 270 790)"><rect x="52" y="702" width="470" height="200" rx="12" fill="#1a1008" opacity=".5"/>${tec}</g>`;
  // disquetes
  const disquete = (x, y, rot, fill, rotulo) => `<g transform="rotate(${rot} ${x + 90} ${y + 90})"><rect x="${x + 10}" y="${y + 12}" width="180" height="180" rx="6" fill="#1a1008" opacity=".5"/><rect x="${x}" y="${y}" width="180" height="180" rx="6" fill="${fill}"/><rect x="${x + 44}" y="${y}" width="92" height="58" fill="#c9cbc8"/><rect x="${x + 100}" y="${y + 8}" width="22" height="42" fill="${fill}"/><rect x="${x + 22}" y="${y + 84}" width="136" height="88" fill="#f2ecdc"/>${texto(rotulo, x + 90, y + 136, { fonte: 'Marker', tam: 22, fill: '#1a1a1a', ancora: 'middle' })}</g>`;
  s += disquete(110, 230, -12, '#2a2a2a', 'DRIVERS 98') + disquete(220, 300, 9, '#a3161b', 'KERNEL') + disquete(70, 400, -3, '#2a5a8a', 'BACKUP');
  // CD riscado
  let cd = `<circle cx="1310" cy="312" r="110" fill="#1a1008" opacity=".5"/><circle cx="1300" cy="300" r="110" fill="#d9dad6"/>`;
  const cores = ['#7fe0e8', '#e87fd0', '#a8f07f', '#f0d27f'];
  for (let i = 0; i < 8; i++) { const a1 = i / 8 * Math.PI * 2, a2 = a1 + .32; cd += `<path d="M1300 300 L${n(1300 + Math.cos(a1) * 110)} ${n(300 + Math.sin(a1) * 110)} A110 110 0 0 1 ${n(1300 + Math.cos(a2) * 110)} ${n(300 + Math.sin(a2) * 110)} Z" fill="${cores[i % 4]}" opacity=".45"/>`; }
  cd += `<circle cx="1300" cy="300" r="33" fill="#eeeeea"/><circle cx="1300" cy="300" r="12" fill="#3a2414"/>`;
  for (let i = 0; i < 20; i++) { const a = r() * 6.28, rr = r.entre(40, 104); cd += `<path d="M${n(1300 + Math.cos(a) * rr)} ${n(300 + Math.sin(a) * rr)} l${n(r.entre(-30, 30))} ${n(r.entre(-12, 12))}" stroke="#fff" stroke-width="1.5" opacity=".7"/>`; }
  s += cd;
  // fita cassete com os gêneros de sempre (o único lugar do site onde eles aparecem)
  s += `<g transform="rotate(7 1260 830)"><rect x="1160" y="772" width="220" height="140" rx="9" fill="#1a1008" opacity=".5"/><rect x="1150" y="760" width="220" height="140" rx="9" fill="#2a2a2a"/>
    <rect x="1164" y="772" width="192" height="78" rx="3" fill="#f2ecdc"/><rect x="1164" y="772" width="192" height="12" fill="#c4161c"/>
    ${texto('NU METAL · RAP METAL', 1260, 806, { fonte: 'Marker', tam: 15, fill: '#1a1a1a', ancora: 'middle' })}
    ${texto('PÓS-PUNK · NEW WAVE', 1260, 826, { fonte: 'Marker', tam: 15, fill: '#1a1a1a', ancora: 'middle' })}
    ${texto('+ experimental', 1260, 845, { fonte: 'Marker', tam: 13, fill: '#a3161b', ancora: 'middle' })}
    <rect x="1208" y="856" width="104" height="30" rx="4" fill="#141414"/><circle cx="1232" cy="871" r="12" fill="#e2e2dc"/><circle cx="1288" cy="871" r="12" fill="#e2e2dc"/><circle cx="1232" cy="871" r="5" fill="#141414"/><circle cx="1288" cy="871" r="5" fill="#141414"/></g>`;
  // placa de circuito
  let pcb = `<rect x="1190" y="552" width="300" height="200" rx="6" fill="#1a1008" opacity=".5"/><rect x="1180" y="540" width="300" height="200" rx="6" fill="#2f8a4a"/>`;
  for (let i = 0; i < 16; i++) { const y = 556 + i * 11; pcb += `<path d="M1190 ${y} H${n(1220 + r() * 120)} V${n(y + r.entre(-6, 16))} H${n(1300 + r() * 160)}" stroke="#e0a84a" stroke-width="3" fill="none" opacity=".85"/>`; }
  pcb += `<rect x="1250" y="590" width="80" height="56" fill="#141414"/><rect x="1360" y="640" width="54" height="40" fill="#141414"/><circle cx="1450" cy="560" r="7" fill="#c4161c"/>`;
  for (let i = 0; i < 9; i++) pcb += `<rect x="${1252 + i * 9}" y="584" width="4" height="6" fill="#dcdcd6"/><rect x="${1252 + i * 9}" y="646" width="4" height="6" fill="#dcdcd6"/>`;
  s += `<g transform="rotate(8 1330 640)">${pcb}</g>`;
  // protoboard: resistor de 220 R (vermelho, vermelho, marrom, dourado), LED e jumpers
  let pb = `<rect x="1390" y="812" width="200" height="110" rx="5" fill="#1a1008" opacity=".5"/><rect x="1380" y="800" width="200" height="110" rx="5" fill="#f2efe6"/><rect x="1386" y="806" width="188" height="3" fill="#c4161c"/><rect x="1386" y="900" width="188" height="3" fill="#2a5a8a"/><rect x="1386" y="855" width="188" height="4" fill="#d6d2c4"/>`;
  for (let i = 0; i < 30; i++) for (let j = 0; j < 12; j++) pb += `<rect x="${1392 + i * 6}" y="${816 + j * 7 + (j > 5 ? 6 : 0)}" width="2.5" height="2.5" fill="#9a958a"/>`;
  pb += `<path d="M1420 830 H1476" stroke="#b8b8b8" stroke-width="3"/><rect x="1436" y="824" width="26" height="12" rx="4" fill="#e8cf96"/>`;
  for (const [dx, c] of [[1440, '#c4161c'], [1445, '#c4161c'], [1450, '#7a4020'], [1457, '#e0a84a']]) pb += `<rect x="${dx}" y="824" width="3" height="12" fill="${c}"/>`;
  pb += `<path d="M1508 844 V830 M1516 844 V830" stroke="#b8b8b8" stroke-width="3"/><path d="M1404 886 C1420 860 1470 870 1490 844" fill="none" stroke="#39ff6a" stroke-width="4" stroke-linecap="round"/><path d="M1530 886 C1540 866 1556 870 1564 840" fill="none" stroke="#2a5a8a" stroke-width="4" stroke-linecap="round"/>`;
  s += `<g transform="rotate(-12 1480 855)">${pb}</g>`;
  // papéis amassados
  const bola = (cx, cy, raio) => {
    const pts = [];
    for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28, rr = raio * r.entre(.72, 1.08); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    let b = `<ellipse cx="${cx + 8}" cy="${cy + 10}" rx="${raio}" ry="${raio * .9}" fill="#1a1008" opacity=".5"/><polygon points="${pts.map(p => p.map(n).join(',')).join(' ')}" fill="#f2ecdc"/>`;
    for (let i = 0; i < 9; i++) { const p1 = r.um(pts), p2 = r.um(pts); b += `<path d="M${n(p1[0])} ${n(p1[1])} L${n(cx + r.entre(-10, 10))} ${n(cy + r.entre(-10, 10))} L${n(p2[0])} ${n(p2[1])} Z" fill="#000" opacity="${n(r.entre(.06, .22))}"/>`; }
    return b;
  };
  s += bola(1490, 420, 44) + bola(1040, 230, 38) + bola(560, 930, 46);
  // cartão-postal de pesca noturna: barco na neblina e uma luz que não devia estar ali (Dredge)
  s += `<g transform="rotate(-7 390 225)"><rect x="310" y="172" width="180" height="130" fill="#1a1008" opacity=".5"/><rect x="300" y="160" width="180" height="130" fill="#f2ecdc"/>
    <rect x="310" y="170" width="160" height="90" fill="#2a3a40"/><rect x="310" y="222" width="160" height="38" fill="#1a2629"/><rect x="310" y="212" width="160" height="14" fill="#a9b6ba" opacity=".4"/>
    <path d="M358 230 L398 230 L392 238 L362 238 Z M370 230 V220 H382 V230 M376 220 V210" fill="#0a1214" stroke="#0a1214" stroke-width="1.5"/>
    <circle cx="432" cy="226" r="3" fill="#39ff6a"/>${texto('pesca noturna', 390, 282, { fonte: 'Marker', tam: 16, fill: '#1a1a1a', ancora: 'middle' })}</g>`;
  // post-it
  s += `<g transform="rotate(-8 1450 230)"><rect x="1398" y="198" width="120" height="110" fill="#1a1008" opacity=".5"/><rect x="1390" y="190" width="120" height="110" fill="#c8f060"/>${texto('TODO:', 1402, 230, { fonte: 'Marker', tam: 22, fill: '#1a1a1a' })}${texto('deploy', 1402, 262, { fonte: 'Marker', tam: 22, fill: '#1a1a1a' })}</g>`;
  // cabos
  s += `<g fill="none" stroke-linecap="round"><path d="M0 610 C160 560 260 680 420 620 S640 560 700 640" stroke="#1a1a1a" stroke-width="10"/><path d="M1600 560 C1500 520 1440 600 1300 520" stroke="#a3161b" stroke-width="8"/>
    <path d="M1600 960 C1400 900 1300 980 1180 900 S980 960 900 1000" stroke="#1a1a1a" stroke-width="9"/><path d="M330 1000 C340 950 420 940 470 900" stroke="#2f8a4a" stroke-width="8"/></g>`;
  s += multiplicar(`<rect width="${w}" height="${h}" fill="#2a1a12"/>${somar(`<rect width="${w}" height="${h}" fill="url(#lamp)"/><rect width="${w}" height="${h}" fill="url(#telaFria)"/>`)}`);
  s += `<circle cx="1512" cy="827" r="7" fill="#ff3b30" transform="rotate(-12 1480 855)"/><circle cx="1510" cy="825" r="2" fill="#fff" transform="rotate(-12 1480 855)"/>`;
  return { nome: 'mesa', w, h, alfa: false, paleta: paletaMesa, rigor: .6, svg: svg(w, h, s, defs) };
}
const paletaMesa = [
  '#0d0806', '#1a0f0a', '#2b1a10', '#3f2a1a', '#5a3e28', '#7a5838', '#9a7450', '#c09a6c', '#e8c890', '#fff2d2',
  '#141414', '#3a3a3a', '#8a8a86', '#d4d4cc', '#a3161b', '#2a5a8a', '#2f8a4a', '#39ff6a', '#e6dcc0', '#2f7a6a', '#7fe0c8'
];

// ───────────────────────── Papel amassado do contato (bordas irregulares, transparente) ─────────────────────────
export function papel() {
  const w = 900, h = 1060, r = sorteio(1310);
  const pts = [];
  const m = 26;
  for (let x = m; x <= w - m; x += 22) pts.push([x, m + r.entre(-10, 12)]);
  for (let y = m; y <= h - m; y += 22) pts.push([w - m + r.entre(-12, 10), y]);
  for (let x = w - m; x >= m; x -= 22) pts.push([x, h - m + r.entre(-12, 10)]);
  for (let y = h - m; y >= m; y -= 22) pts.push([m + r.entre(-10, 12), y]);
  const contorno = pts.map(p => p.map(n).join(',')).join(' ');
  let s = `<defs><clipPath id="folha"><polygon points="${contorno}"/></clipPath></defs>`;
  s += `<g clip-path="url(#folha)"><rect width="${w}" height="${h}" fill="#ddd4bb"/>`;
  // facetas do amassado: triângulos claros e escuros com borda dura
  for (let i = 0; i < 60; i++) {
    const cx = r() * w, cy = r() * h, t = r.entre(60, 220);
    const a = [cx + r.entre(-t, t), cy + r.entre(-t, t)], b = [cx + r.entre(-t, t), cy + r.entre(-t, t)];
    s += `<polygon points="${n(cx)},${n(cy)} ${n(a[0])},${n(a[1])} ${n(b[0])},${n(b[1])}" fill="${r() < .5 ? '#000' : '#fff'}" opacity="${n(r.entre(.015, .04))}"/>`;
  }
  for (let i = 0; i < 14; i++) {
    const x1 = r() * w, y1 = r() * h, x2 = x1 + r.entre(-400, 400), y2 = y1 + r.entre(-400, 400);
    s += `<path d="M${n(x1)} ${n(y1)} L${n(x2)} ${n(y2)}" stroke="#7a6a48" stroke-width="2.5" opacity=".4"/>`;
  }
  // pauta de caderno, margem e mancha de café
  for (let y = 150; y < h - 40; y += 46) s += `<rect x="0" y="${y}" width="${w}" height="2.5" fill="#7fa6bf" opacity=".5"/>`;
  s += `<rect x="96" y="0" width="3" height="${h}" fill="#c0392b" opacity=".5"/>`;
  s += `<circle cx="720" cy="860" r="92" fill="none" stroke="#8a5a33" stroke-width="10" opacity=".3"/>`;
  s += `<polygon points="${contorno}" fill="none" stroke="#9a8a62" stroke-width="12" opacity=".5"/>`;
  s += `</g>`;
  return { nome: 'papel', w, h, alfa: true, paleta: ['#7a6a48', '#a6997a', '#c4b896', '#d3c9ac', '#ddd4bb', '#e9e2cf', '#f4efe2', '#7fa6bf', '#c0392b', '#8a5a33'], svg: svg(w, h, s) };
}

// ───────────────────────── Neblina baixa (ladrilho horizontal sem emenda) ─────────────────────────
export function neblina() {
  const w = 1600, h = 420;
  const s = `<defs><filter id="nevoa" filterUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">
      <feTurbulence type="fractalNoise" baseFrequency=".0028 .011" numOctaves="4" seed="8" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .80  0 0 0 0 .83  0 0 0 0 .85  1.7 0 0 0 -.5"/></filter>
    <linearGradient id="desce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <mask id="mn"><rect width="${w}" height="${h}" fill="url(#desce)"/></mask></defs>
  <rect width="${w}" height="${h}" filter="url(#nevoa)" mask="url(#mn)"/>`;
  return { nome: 'neblina', w, h, alfa: 'pontilhado', grade: .4, paleta: ['#9aa4aa', '#c4ccd0'], svg: svg(w, h, s) };
}

// ───────────────────────── Selo de tinta vermelho com as iniciais ─────────────────────────
export function selo() {
  const w = 220, h = 220;
  const s = `<defs><mask id="letras"><rect width="${w}" height="${h}" fill="#fff"/>
    <rect x="36" y="36" width="148" height="148" rx="8" fill="none" stroke="#000" stroke-width="5"/>
    <text x="110" y="106" font-family="Cinzel" font-weight="900" font-size="72" text-anchor="middle" fill="#000">G</text>
    <text x="110" y="172" font-family="Cinzel" font-weight="900" font-size="72" text-anchor="middle" fill="#000">A</text></mask></defs>
  <filter id="carimbo" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="21" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="3" result="s"/>
    <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4 0 0 0 3.05" result="falhas"/>
    <feComposite in="d" in2="falhas" operator="in"/></filter>
  <g filter="url(#carimbo)"><rect x="22" y="22" width="176" height="176" rx="14" fill="#c4161c" mask="url(#letras)"/></g>`;
  return { nome: 'selo', w, h, alfa: true, grade: .32, paleta: ['#c4161c', '#8e0f14'], svg: svg(w, h, s) };
}

export const cenas = [portao, fachada, garagem, terminal, parede, mural, zine, mesa, papel, neblina, selo];
