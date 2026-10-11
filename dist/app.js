// Ponto de entrada. Cada etapa da garagem vive no seu módulo e respeita prefers-reduced-motion.
import { iniciarPortao } from './js/portao.js'; // etapa:portao

const reduz = matchMedia('(prefers-reduced-motion: reduce)');

// etapa:hero — rajada de glitch RGB só na abertura; depois, apenas no hover do nome.
const palco = document.querySelector('#gate-stage');
if (!reduz.matches) {
  palco.classList.add('is-glitching');
  setTimeout(() => palco.classList.remove('is-glitching'), 900);
}
// Pausa ruído e tracking do VHS quando a abertura sai da tela.
new IntersectionObserver(([e]) => palco.classList.toggle('is-idle', !e.isIntersecting)).observe(palco);
// /etapa:hero

iniciarPortao({ reduz }); // etapa:portao
