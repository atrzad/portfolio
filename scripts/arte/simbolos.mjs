// Silhuetas desenhadas à mão em SVG para cartazes e decalques. Sem marcas, logotipos ou personagens reais:
// um androide genérico (cartaz de procura-se), um kaiju genérico (cartaz da orla) e um drakkar (decalque).
const corte = 'style="fill:var(--corte,#111)"';
const traco = 'style="stroke:var(--corte,#111)"';

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
<symbol id="kaiju" viewBox="0 0 140 150">
  <path d="M60 26 L70 12 L72 34 L82 26 L84 48 L96 40 L95 60 L108 58 L103 78 L117 80 L107 96 L121 100 L112 108 Z"/>
  <path d="M34 22 L50 16 L60 24 L66 40 L84 50 L98 70 L104 92 L122 108 L138 128 L136 140 L118 128 L104 114 L104 146 L84 146 L86 120 L74 118 L74 146 L56 146 L58 112 L52 96 L46 78 L36 74 L30 66 L40 64 L44 56 L40 44 L30 46 L22 38 L34 34 L20 26 Z"/>
  <circle cx="45" cy="25" r="2.6" ${corte}/>
</symbol>
<symbol id="drakkar" viewBox="0 0 120 80">
  <path d="M60 10 V56" stroke="currentColor" stroke-width="4"/>
  <rect x="36" y="12" width="48" height="32" rx="2"/>
  <rect x="44" y="12" width="6" height="32" ${corte}/><rect x="56" y="12" width="6" height="32" ${corte}/><rect x="68" y="12" width="6" height="32" ${corte}/>
  <path d="M8 50 Q60 72 112 50 L104 62 Q60 82 16 62 Z"/>
  <path d="M10 52 C2 44 4 30 14 30 C12 26 20 24 20 30 C14 34 14 44 18 50 Z"/>
  <path d="M110 52 C116 46 116 36 108 34 C112 40 110 46 104 50 Z"/>
  <circle cx="34" cy="58" r="3.4" ${corte}/><circle cx="48" cy="61" r="3.4" ${corte}/><circle cx="62" cy="62" r="3.4" ${corte}/><circle cx="76" cy="61" r="3.4" ${corte}/><circle cx="90" cy="58" r="3.4" ${corte}/>
  <path d="M30 68 L22 78 M50 72 L44 80 M70 72 L66 80 M90 68 L86 78" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
</symbol>`;
