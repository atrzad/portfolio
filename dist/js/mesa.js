// Mesa dos contatos: ao descer, a câmera "inclina" da TV para o tampo da mesa.
// Quando o papel de contato aparece inteiro, um aviso dourado acende uma única vez.
const limitar = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export function iniciarMesa({ reduz }) {
  const mesa = document.querySelector('#contato');
  const fundo = document.querySelector('#desk-bg');
  new IntersectionObserver(([e]) => mesa.classList.toggle('is-idle', !e.isIntersecting)).observe(mesa);
  const aviso = document.querySelector('#banner');
  const vigia = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || reduz.matches) return;
    aviso.classList.add('aceso');
    vigia.disconnect();
  }, { threshold: .55 });
  vigia.observe(document.querySelector('#note'));
  let pendente = false;
  function quadro() {
    pendente = false;
    if (reduz.matches) { fundo.removeAttribute('style'); return; }
    const topo = mesa.getBoundingClientRect().top;
    if (topo > innerHeight * 1.1) return;
    const falta = 1 - limitar((innerHeight - topo) / innerHeight);
    fundo.style.transform = `translateY(${(-falta * 10).toFixed(2)}%) rotateX(${(falta * 24).toFixed(2)}deg) scale(${(1 + falta * .16).toFixed(4)})`;
  }
  addEventListener('scroll', () => { if (!pendente) { pendente = true; requestAnimationFrame(quadro); } }, { passive: true });
  reduz.addEventListener('change', quadro);
  quadro();
}
