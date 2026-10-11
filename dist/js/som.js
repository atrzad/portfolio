// Som opcional (desligado por padrão), sintetizado no navegador: o ruído mecânico do portão.
let ctx, mestre, silencio;
let ligado = false;

function montar() {
  ctx = new AudioContext();
  mestre = ctx.createGain(); mestre.gain.value = 0; mestre.connect(ctx.destination);
  const duracao = ctx.sampleRate * 2;
  const marrom = ctx.createBuffer(1, duracao, ctx.sampleRate);
  const m = marrom.getChannelData(0);
  let ultimo = 0;
  for (let i = 0; i < duracao; i++) {
    ultimo = (ultimo + .02 * (Math.random() * 2 - 1)) / 1.02; m[i] = ultimo * 3.5;
  }
  // corrente chacoalhando: ruído marrom filtrado, modulado por um LFO quadrado
  const ruido = ctx.createBufferSource(); ruido.buffer = marrom; ruido.loop = true;
  const banda = ctx.createBiquadFilter(); banda.type = 'bandpass'; banda.frequency.value = 240; banda.Q.value = .9;
  const chocalho = ctx.createGain(); chocalho.gain.value = .5;
  const lfo = ctx.createOscillator(); lfo.type = 'square'; lfo.frequency.value = 17;
  const prof = ctx.createGain(); prof.gain.value = .5;
  lfo.connect(prof).connect(chocalho.gain);
  ruido.connect(banda).connect(chocalho).connect(mestre);
  // motor: dente de serra grave
  const motor = ctx.createOscillator(); motor.type = 'sawtooth'; motor.frequency.value = 46;
  const grave = ctx.createBiquadFilter(); grave.type = 'lowpass'; grave.frequency.value = 150;
  const vol = ctx.createGain(); vol.gain.value = .35;
  motor.connect(grave).connect(vol).connect(mestre);
  ruido.start(); lfo.start(); motor.start();
}

export function ligarBotao(botao) {
  botao?.addEventListener('click', () => {
    ligado = !ligado;
    botao.setAttribute('aria-pressed', String(ligado));
    botao.textContent = ligado ? '[ SOM: LIG ]' : '[ SOM: DESL ]';
    if (ligado && !ctx) montar();
    if (ctx) ligado ? ctx.resume() : ctx.suspend();
  });
}

export function ruidoPortao(delta, movendo) {
  if (!ligado || !ctx) return;
  const alvo = movendo ? Math.min(.45, Math.abs(delta) * 40) : 0;
  mestre.gain.setTargetAtTime(alvo, ctx.currentTime, .04);
  clearTimeout(silencio);
  silencio = setTimeout(() => mestre.gain.setTargetAtTime(0, ctx.currentTime, .12), 140);
}
