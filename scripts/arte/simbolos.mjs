// Símbolos do grafite digital: ícones cyberpunk e sci-fi desenhados à mão em SVG.
// Sem marcas, logotipos ou personagens reais: androides, drones, chips, antenas, vigilância, OVNI e planetas genéricos.
const corte = 'style="fill:var(--corte,#111)"';
const traco = 'style="stroke:var(--corte,#111)"';

// Horizonte de prédios com antenas e janelas acesas (janelas = recortes na cor de fundo).
function predios() {
  const blocos = [[0, 64, 24], [26, 34, 20], [48, 52, 28], [78, 12, 18], [98, 42, 26], [126, 24, 16], [144, 58, 30], [176, 36, 24]];
  let s = blocos.map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${120 - y}"/>`).join('');
  s += `<path d="M87 12 V0 M134 24 V8 M36 34 V22" stroke="currentColor" stroke-width="2"/>`;
  blocos.forEach(([x, y, w], b) => {
    for (let j = y + 8, lin = 0; j < 112; j += 10, lin++) for (let i = x + 4, col = 0; i <= x + w - 7; i += 7, col++) {
      if ((b * 7 + lin * 3 + col * 5) % 4 < 2) s += `<rect x="${i}" y="${j}" width="3" height="4" ${corte}/>`;
    }
  });
  return s;
}

export const simbolos = `
<symbol id="androide" viewBox="0 0 100 124">
  <path d="M38 18 L33 5" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="33" cy="5" r="4"/>
  <rect x="20" y="18" width="60" height="64" rx="14"/>
  <rect x="48" y="35" width="38" height="17" rx="4" ${corte}/>
  <rect x="54" y="40" width="24" height="3" fill="currentColor"/>
  <circle cx="35" cy="50" r="9" ${corte}/><circle cx="35" cy="50" r="4"/>
  <path d="M60 64 H76 M63 70 H76" ${traco} stroke-width="3"/>
  <path d="M25 30 H40 V40 M28 74 H44 V62" fill="none" ${traco} stroke-width="2.2"/>
  <rect x="38" y="82" width="22" height="16"/>
  <path d="M38 88 H60 M38 94 H60" ${traco} stroke-width="2"/>
  <path d="M8 124 C10 106 22 98 40 98 L60 98 C78 98 90 106 92 124 Z"/>
</symbol>
<symbol id="robo" viewBox="0 0 100 150">
  <path d="M50 10 V4" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="4" r="3.5"/>
  <rect x="34" y="10" width="32" height="28" rx="6"/>
  <rect x="38" y="19" width="24" height="8" rx="3" ${corte}/>
  <rect x="44" y="38" width="12" height="6"/>
  <rect x="26" y="43" width="48" height="52" rx="8"/>
  <rect x="38" y="54" width="24" height="18" rx="3" ${corte}/><circle cx="50" cy="63" r="5"/>
  <path d="M71 51 L87 35 L83 17" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M29 51 L15 71 L19 92" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="30" y="97" width="15" height="46" rx="4"/><rect x="55" y="97" width="15" height="46" rx="4"/>
  <rect x="26" y="140" width="22" height="10" rx="3"/><rect x="52" y="140" width="22" height="10" rx="3"/>
</symbol>
<symbol id="drone" viewBox="0 0 140 110">
  <path d="M30 30 L60 50 M110 30 L80 50 M30 82 L60 62 M110 82 L80 62" stroke="currentColor" stroke-width="7" stroke-linecap="round"/>
  <rect x="52" y="42" width="36" height="28" rx="8"/>
  <rect x="62" y="50" width="16" height="5" rx="2" ${corte}/>
  <circle cx="70" cy="77" r="8"/><circle cx="70" cy="77" r="3.5" ${corte}/>
  <ellipse cx="30" cy="25" rx="25" ry="6"/><ellipse cx="110" cy="25" rx="25" ry="6"/><ellipse cx="30" cy="80" rx="25" ry="6"/><ellipse cx="110" cy="80" rx="25" ry="6"/>
  <circle cx="30" cy="30" r="5"/><circle cx="110" cy="30" r="5"/><circle cx="30" cy="85" r="5"/><circle cx="110" cy="85" r="5"/>
</symbol>
<symbol id="parabolica" viewBox="0 0 120 100">
  <g transform="rotate(-28 48 46)">
    <ellipse cx="48" cy="46" rx="40" ry="16"/>
    <ellipse cx="48" cy="44" rx="30" ry="10" ${corte}/>
    <ellipse cx="48" cy="44" rx="18" ry="5"/>
  </g>
  <path d="M48 46 L78 18" stroke="currentColor" stroke-width="4"/><circle cx="80" cy="16" r="5"/>
  <path d="M90 10 q7 6 0 14 M98 4 q12 12 0 26" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <path d="M48 56 L48 86 M34 96 L48 84 L62 96" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="26" y="93" width="44" height="7" rx="2"/>
</symbol>
<symbol id="sinal" viewBox="0 0 100 90">
  <circle cx="50" cy="78" r="8"/>
  <path d="M30 58 Q50 40 70 58 M16 42 Q50 12 84 42 M4 26 Q50 -14 96 26" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
</symbol>
<symbol id="chip" viewBox="0 0 100 100">
  <path d="M32 6 V22 M44 6 V22 M56 6 V22 M68 6 V22 M32 78 V94 M44 78 V94 M56 78 V94 M68 78 V94 M6 32 H22 M6 44 H22 M6 56 H22 M6 68 H22 M78 32 H94 M78 44 H94 M78 56 H94 M78 68 H94" stroke="currentColor" stroke-width="5"/>
  <rect x="20" y="20" width="60" height="60" rx="5"/>
  <rect x="34" y="34" width="32" height="32" rx="2" ${corte}/>
  <rect x="42" y="42" width="16" height="16"/>
  <circle cx="28" cy="28" r="3.5" ${corte}/>
  <path d="M50 34 V24 M66 50 H76 M34 50 H24 M50 66 V76" ${traco} stroke-width="2.5"/>
</symbol>
<symbol id="ovni" viewBox="0 0 140 92">
  <path d="M44 40 C46 12 94 12 96 40 Z"/>
  <path d="M55 32 C57 22 68 19 75 21" fill="none" ${traco} stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="70" cy="44" rx="66" ry="14"/>
  <circle cx="30" cy="46" r="3.5" ${corte}/><circle cx="50" cy="49" r="3.5" ${corte}/><circle cx="70" cy="50" r="3.5" ${corte}/><circle cx="90" cy="49" r="3.5" ${corte}/><circle cx="110" cy="46" r="3.5" ${corte}/>
  <path d="M52 64 H88 M46 74 H94 M40 84 H100" stroke="currentColor" stroke-width="5"/>
</symbol>
<symbol id="planeta" viewBox="0 0 100 72">
  <g transform="rotate(-14 50 38)"><path d="M4 38 A46 12 0 0 1 96 38" fill="none" stroke="currentColor" stroke-width="5"/></g>
  <circle cx="50" cy="36" r="22"/>
  <path d="M36 27 Q44 21 55 23" fill="none" ${traco} stroke-width="3" stroke-linecap="round"/>
  <g transform="rotate(-14 50 38)">
    <path d="M4 38 A46 12 0 0 0 96 38" fill="none" ${traco} stroke-width="10"/>
    <path d="M4 38 A46 12 0 0 0 96 38" fill="none" stroke="currentColor" stroke-width="5"/>
  </g>
</symbol>
<symbol id="cctv" viewBox="0 0 120 80">
  <rect x="0" y="8" width="12" height="44" rx="2"/>
  <path d="M12 30 H28 L36 36" fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
  <path d="M32 18 L100 30 L98 52 L30 42 Z"/>
  <path d="M100 26 L114 28 L112 56 L98 54 Z"/>
  <circle cx="106" cy="42" r="6" ${corte}/><circle cx="106" cy="42" r="2.5"/>
  <circle cx="44" cy="30" r="3" ${corte}/>
</symbol>
<symbol id="alien" viewBox="0 0 80 100">
  <path d="M40 4 C68 4 78 28 74 48 C70 70 52 92 40 96 C28 92 10 70 6 48 C2 28 12 4 40 4 Z"/>
  <ellipse cx="25" cy="52" rx="13" ry="7" transform="rotate(32 25 52)" ${corte}/>
  <ellipse cx="55" cy="52" rx="13" ry="7" transform="rotate(-32 55 52)" ${corte}/>
  <path d="M34 80 Q40 83 46 80" fill="none" ${traco} stroke-width="2.5" stroke-linecap="round"/>
</symbol>
<symbol id="perigo" viewBox="0 0 100 90">
  <path d="M50 6 L95 84 L5 84 Z" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/>
  <path d="M56 26 L36 58 L50 58 L44 80 L66 46 L52 46 Z" ${corte}/>
</symbol>
<symbol id="predios" viewBox="0 0 200 120">${predios()}</symbol>
<symbol id="lata" viewBox="0 0 60 120">
  <rect x="10" y="34" width="40" height="86" rx="5"/>
  <rect x="16" y="20" width="28" height="16" rx="3"/>
  <rect x="26" y="10" width="8" height="10"/>
  <rect x="10" y="60" width="40" height="18" ${corte}/>
  <circle cx="44" cy="6" r="2.4"/><circle cx="52" cy="2" r="1.8"/><circle cx="56" cy="10" r="2"/><circle cx="50" cy="12" r="1.4"/>
</symbol>
<symbol id="raio" viewBox="0 0 60 100"><path d="M36 0 L6 56 L28 56 L20 100 L54 38 L32 38 Z"/></symbol>
<symbol id="estrela" viewBox="0 0 100 100"><path d="M50 2 L62 38 L98 38 L68 60 L80 96 L50 74 L20 96 L32 60 L2 38 L38 38 Z"/></symbol>
<symbol id="olho" viewBox="0 0 120 70">
  <path d="M4 35 C30 0 90 0 116 35 C90 70 30 70 4 35 Z" fill="none" stroke="currentColor" stroke-width="6"/>
  <circle cx="60" cy="35" r="16"/><circle cx="60" cy="35" r="6" ${corte}/>
</symbol>
<symbol id="cadeado" viewBox="0 0 80 110">
  <path d="M18 50 L18 32 C18 6 62 6 62 32 L62 50" fill="none" stroke="currentColor" stroke-width="9"/>
  <rect x="4" y="46" width="72" height="62" rx="6"/>
  <circle cx="40" cy="72" r="8" ${corte}/><rect x="36" y="74" width="8" height="18" ${corte}/>
</symbol>
`;
