// Portão da garagem: abre com a rolagem, vaza luz de CRT e a câmera avança para dentro.
// Só transform e opacity são alterados por quadro; nada de layout durante o scroll.
const limitar = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const suave = t => t * t * (3 - 2 * t);

export function iniciarPortao({ reduz }) {
  const portao = document.querySelector('#inicio');
  const fundo = document.querySelector('#plane-back');
  const frente = document.querySelector('#plane-front');
  const porta = document.querySelector('#door');
  const luz = document.querySelector('#leak');
  const texto = document.querySelector('#hero-copy');
  const lente = document.querySelector('#lens');
  const liga = document.querySelector('#power');
  const tocar = criarSom(document.querySelector('#sound'));
  const animados = [fundo, frente, porta, luz, texto, lente, liga];
  let pendente = false, anterior = 0;

  function quadro() {
    pendente = false;
    const caixa = portao.getBoundingClientRect();
    const percurso = caixa.height - innerHeight;
    if (percurso <= 0 || caixa.bottom < 0) return;
    const p = limitar(-caixa.top / percurso);
    const delta = p - anterior;
    anterior = p;
    const abre = suave(limitar((p - .06) / .44));
    const z = suave(limitar((p - .42) / .5));
    const tremor = abre > 0 && abre < 1 ? Math.sin(p * 900) * 1.4 : 0;
    porta.style.transform = `translate3d(${tremor.toFixed(2)}px, ${(-abre * 100).toFixed(3)}%, 0)`;
    luz.style.opacity = (abre * (1 - z) * .9).toFixed(3);
    luz.style.transform = `scaleY(${abre.toFixed(3)})`;
    frente.style.transform = `scale(${(1 + 3.2 * z * z).toFixed(4)})`;
    fundo.style.transform = `scale(${(1 + .45 * z).toFixed(4)})`;
    texto.style.opacity = (1 - limitar((p - .02) / .12)).toFixed(3);
    texto.style.pointerEvents = p > .14 ? 'none' : '';
    lente.style.opacity = (Math.sin(Math.PI * z) * .9 + abre * (1 - z) * .15).toFixed(3);
    const pw = limitar((p - .9) / .1);
    liga.style.opacity = pw > 0 ? (pw < .6 ? 1 : (1 - pw) / .4 * .8).toFixed(3) : '0';
    liga.style.transform = `scale(${limitar(pw * 2.2).toFixed(3)}, ${(1 + Math.max(0, pw - .45) * 70).toFixed(2)})`;
    tocar(delta, (abre > 0 && abre < 1) || (z > 0 && z < 1));
  }
  const agendar = () => { if (!pendente) { pendente = true; requestAnimationFrame(quadro); } };

  function aplicarModo() {
    if (reduz.matches) {
      portao.classList.remove('is-scrolly');
      removeEventListener('scroll', agendar);
      removeEventListener('resize', agendar);
      for (const el of animados) el.removeAttribute('style');
      return;
    }
    portao.classList.add('is-scrolly');
    addEventListener('scroll', agendar, { passive: true });
    addEventListener('resize', agendar, { passive: true });
    quadro();
  }
  reduz.addEventListener('change', aplicarModo);
  aplicarModo();
}

// Ruído mecânico opcional (desligado por padrão): corrente chacoalhando + motor, sintetizados no navegador.
function criarSom(botao) {
  let ctx, mestre, ligado = false, silencio;
  function montar() {
    ctx = new AudioContext();
    mestre = ctx.createGain(); mestre.gain.value = 0; mestre.connect(ctx.destination);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const dados = buffer.getChannelData(0);
    let ultimo = 0;
    for (let i = 0; i < dados.length; i++) { ultimo = (ultimo + .02 * (Math.random() * 2 - 1)) / 1.02; dados[i] = ultimo * 3.5; }
    const ruido = ctx.createBufferSource(); ruido.buffer = buffer; ruido.loop = true;
    const banda = ctx.createBiquadFilter(); banda.type = 'bandpass'; banda.frequency.value = 240; banda.Q.value = .9;
    const chocalho = ctx.createGain(); chocalho.gain.value = .5;
    const lfo = ctx.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 17;
    const prof = ctx.createGain(); prof.gain.value = .5;
    lfo.connect(prof).connect(chocalho.gain);
    ruido.connect(banda).connect(chocalho).connect(mestre);
    const motor = ctx.createOscillator(); motor.type = 'sawtooth'; motor.frequency.value = 46;
    const grave = ctx.createBiquadFilter(); grave.type = 'lowpass'; grave.frequency.value = 150;
    const vol = ctx.createGain(); vol.gain.value = .35;
    motor.connect(grave).connect(vol).connect(mestre);
    ruido.start(); lfo.start(); motor.start();
  }
  botao?.addEventListener('click', () => {
    ligado = !ligado;
    botao.setAttribute('aria-pressed', String(ligado));
    botao.textContent = ligado ? '[ SOM: LIG ]' : '[ SOM: DESL ]';
    if (ligado && !ctx) montar();
    if (ctx) ligado ? ctx.resume() : ctx.suspend();
  });
  return (delta, movendo) => {
    if (!ligado || !ctx) return;
    const alvo = movendo ? Math.min(.45, Math.abs(delta) * 40) : 0;
    mestre.gain.setTargetAtTime(alvo, ctx.currentTime, .04);
    clearTimeout(silencio);
    silencio = setTimeout(() => mestre.gain.setTargetAtTime(0, ctx.currentTime, .12), 140);
  };
}
