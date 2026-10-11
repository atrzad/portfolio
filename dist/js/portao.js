// Portão da garagem: sobe com a rolagem e, aberto, a página segue direto para o terminal.
// Só transform e opacity mudam por quadro, e o ouvinte de rolagem só trabalha com o portão na tela.
import { ligarBotao, ruidoPortao } from './som.js';

const limitar = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const suave = t => t * t * (3 - 2 * t);

export function iniciarPortao({ reduz }) {
  const portao = document.querySelector('#inicio');
  const porta = document.querySelector('#door');
  const texto = document.querySelector('#hero-copy');
  ligarBotao(document.querySelector('#sound'));
  let pendente = false, visivel = true, anterior = 0;

  function quadro() {
    pendente = false;
    const caixa = portao.getBoundingClientRect();
    const percurso = caixa.height - innerHeight;
    if (percurso <= 0) return;
    const p = limitar(-caixa.top / percurso);
    const abre = suave(limitar((p - .04) / .9));
    const tremor = abre > 0 && abre < 1 ? Math.sin(p * 900) * 1.2 : 0;
    porta.style.transform = `translate3d(${tremor.toFixed(2)}px, ${(-abre * 100).toFixed(3)}%, 0)`;
    texto.style.opacity = (1 - limitar((p - .02) / .12)).toFixed(3);
    texto.style.pointerEvents = p > .14 ? 'none' : '';
    ruidoPortao(p - anterior, abre > 0 && abre < 1);
    anterior = p;
  }
  const agendar = () => { if (visivel && !pendente) { pendente = true; requestAnimationFrame(quadro); } };
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; agendar(); }).observe(portao);

  function aplicarModo() {
    if (reduz.matches) {
      portao.classList.remove('is-scrolly');
      removeEventListener('scroll', agendar);
      removeEventListener('resize', agendar);
      porta.removeAttribute('style');
      texto.removeAttribute('style');
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
