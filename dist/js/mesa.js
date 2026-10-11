// Mesa dos contatos: os LEDs só piscam com a mesa na tela e, quando o papel de contato
// aparece inteiro, um aviso dourado acende uma única vez.
export function iniciarMesa({ reduz }) {
  const mesa = document.querySelector('#contato');
  new IntersectionObserver(([e]) => mesa.classList.toggle('is-idle', !e.isIntersecting)).observe(mesa);
  const aviso = document.querySelector('#banner');
  const vigia = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || reduz.matches) return;
    aviso.classList.add('aceso');
    vigia.disconnect();
  }, { threshold: .55 });
  vigia.observe(document.querySelector('#note'));
}
