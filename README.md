# Portfólio — Glaydson de Oliveira Araujo

Site pessoal em português com estética hacker, cyberpunk e um pouco de sci-fi, toda em pixel art. A experiência é toda na rolagem: o portão de uma garagem sobe e a página segue direto para a tela grande de um terminal com a árvore de habilidades em forma de roda (áreas, linguagens e projetos); depois vêm uma página de zine em xerox e os contatos num papel amassado sobre a mesa. HTML, CSS e JavaScript (módulos ES) servidos por Node.js, sem dependências de produção e sem etapa de build.

## Site publicado

https://glaydson-porfolio.tail9ff58.ts.net/

Página e catálogo verificados por HTTPS com resposta 200. O serviço inicia automaticamente e o usuário já possui linger ativado.

## Executar

Requer Node.js 22 ou superior.

```sh
npm start
```

Acesso: http://127.0.0.1:4321. O servidor entrega **somente `dist/`**, escuta em loopback e não expõe fontes, diretórios de projetos ou arquivos de configuração.

```sh
npm run check   # sintaxe
npm test        # dados, referências locais, lista SEO
npm run qa      # Chromium: portão, árvore, modal, teclado, celular, movimento reduzido
```

## Editar

- `dist/data.js`: **fonte única dos dados**: linguagens (com a sigla usada na roda do celular), as três áreas da roda (Full-stack, Automação e Android, cada uma com as linguagens que usa), projetos (com `area`, `langs` e `motivation`) e contatos. Projeto com `area: null` fica fora da roda, numa fileira abaixo do terminal; quem está numa área só pode usar linguagens dessa área (o `npm test` confere).
- `npm run miniaturas`: gera, a partir das capturas, as miniaturas leves (360 × 240, para a ficha e os cartões do celular) e as versões de 720 px usadas no modal em telas pequenas. A captura original fica para a imagem ampliada.
- `npm run versao`: carimba `?v=<hash do conteúdo>` nas referências a `./assets/` do HTML e do CSS, para o navegador nunca mostrar uma imagem antiga em cache (o `npm run arte` já roda isso; o `npm test` avisa se faltar).
- `npm run seo`: regenera, a partir de `data.js`, a lista de projetos oculta visualmente no `index.html` (para leitores de tela e indexação). O `npm test` avisa se ela ficar desatualizada.
- `dist/index.html`: estrutura das cenas (abertura/portão, garagem com terminal, zine "sobre", mesa de contatos).
- `dist/style.css`: visual; blocos marcados por etapa (`etapa:hero`, `etapa:portao`, `etapa:arvore`, `etapa:mesa`).
- `dist/js/portao.js`: o portão sobe com a rolagem; aberto, o palco se solta e a próxima tela já é o terminal. Só `transform` e `opacity` mudam por quadro, e o ouvinte de rolagem só trabalha com o portão na tela.
- `dist/js/som.js`: som opcional (Web Audio, desligado por padrão): ruído mecânico do portão.
- `dist/js/arvore.js`: árvore em roda com **duas telas separadas**. No desktop, a roda em SVG (centro → áreas → linguagens → projetos, com trilhas de placa redonda: raio, arco e via) tem uma ficha ao lado; hover ou foco acendem o caminho até o centro, põem uma mira no nó e mostram na ficha a miniatura, as linguagens, a stack e a sincronia (quantas linguagens da área o projeto usa). No toque, o primeiro toque seleciona e o segundo abre. No celular (até 900 px), a tela é outra: roda compacta de enfeite, abas grandes por área, linguagens como filtro e cartões com miniatura. As duas telas abrem o mesmo modal com glitch, e a tela não pisca ao trocar de nó.
- `dist/js/mesa.js`: LEDs que só piscam com a mesa na tela e aviso dourado "SINAL ACESO" (uma vez).
- `scripts/arte/cenas.mjs` e `scripts/arte/simbolos.mjs`: a arte é desenhada em SVG e renderizada em **pixel art** por `npm run arte` (detalhes em "Direção de arte"). No site, as imagens são ampliadas com `image-rendering: pixelated`. Silhuetas e símbolos são genéricos: sem marcas, logotipos ou pessoas reais.
- `dist/assets/screenshots/`: capturas reais otimizadas em WebP, mostradas no modal.

Acessibilidade: tudo funciona por teclado (losangos da árvore são focáveis; Enter abre; Escape fecha e devolve o foco), foco visível em verde-ácido, rótulos ARIA e `prefers-reduced-motion` desliga portão animado, glitch, ruído de VHS e LEDs piscando. Em telas até 900 px a roda dá lugar à tela do celular (abas e filtros são botões com `aria-pressed`, e um resumo com `aria-live` diz quantos projetos aparecem). O CSP do servidor bloqueia estilos inline, então valores dinâmicos são aplicados via CSSOM no JavaScript.

As motivações dos projetos foram escritas a partir do problema que cada um trata; ajuste-as em `data.js` com a sua história real.

Fontes tipográficas, todas do repositório google/fonts: no site (em `dist/assets/fonts/`, licenças em `LICENSES.txt`), só fontes de pixel: Silkscreen, VT323, Jersey 15 (títulos) e Jacquard 24 (gótica, nas mensagens dos soulslike), todas SIL OFL 1.1. O gerador de arte usa também Alfa Slab One (letreiro pintado), Anton (lambe-lambe), Black Ops One (estêncil), Cinzel (selo), todas SIL OFL 1.1, e Permanent Marker (Apache 2.0, escrita à mão); elas ficam em `scripts/arte/fontes/`, fora do que o site serve.

## Direção de arte

As cenas seguem os adventures japoneses de PC-98 (os cyberpunk dos anos 80 e 90): **640 × 400 pixels, uma paleta própria por cena (de 2 a 22 cores) e pontilhado ordenado no lugar de degradê**. O `npm run arte` renderiza o SVG no Chromium do Playwright, reduz por média de área para a grade e, para cada pixel, escolhe as duas cores da paleta que melhor o explicam e as mistura com uma matriz de Bayer 4 × 4: áreas chapadas continuam chapadas, e luz, sombra e neblina viram tramas de pontos. Nas cenas, os objetos são pintados com a cor-base e multiplicados por um mapa de luz; o que emite luz (lâmpadas, neon, tela, LEDs) vai por cima, sem escurecer.

Cada imagem aparece **uma vez só** no site (o `npm test` acusa repetição), e cada cena tem uma fonte de luz:

| Cena | Luz e referência gráfica |
|---|---|
| Fachada e portão | duas arandelas de sódio; letreiro pintado à mão ("GARAGEM 03", lan house), lambe-lambe de show colado no portão, pixação de letras altas e angulosas, estêncil gasto |
| Interior (atrás do portão) | só o verde do terminal acende o cômodo; um resto de sódio entra pela porta |
| Terminal | futurismo de fita cassete (consoles de Alien, de 1979, e painéis de Evangelion): chapa de grafite parafusada, faixa de perigo, etiquetas de rotuladora, VU de sinal |
| Parede atrás do terminal | o brilho verde da tela em anéis pontilhados, eletrodutos e um esquema a giz |
| Sobre | página de zine em xerox (toner, dobra, grampos, retícula) presa com fita isolante numa parede de azulejos sob luz fluorescente |
| Contatos | mesa vista de cima sob luminária quente, com o reflexo frio de uma tela à direita |

Animações: o portão é a única coisa ligada à rolagem; ruído do VHS, neblina e LEDs pausam fora da tela; as animações em CSS só mexem em `transform`, `opacity` ou recortes curtos (o `npm test` acusa `letter-spacing`, `box-shadow`, `filter` e afins em `@keyframes`), e `prefers-reduced-motion` desliga todas.

## Referências sutis

A estética é cyberpunk e meio sci-fi, com acenos discretos ao que inspira o autor. Nada de logotipos, personagens ou arte copiada: são motivos originais.

| Referência | Onde aparece |
|---|---|
| Soulslike / FromSoftware | dica do início como mensagem laranja no chão ("experimente rolar"); aviso dourado "SINAL ACESO" ao chegar no contato; motivação dos projetos como inscrição dourada; roda de habilidades com mira de seleção e ficha, como nos menus de jogo |
| Hollow Knight, Blasphemous | claro-escuro: uma luz forte por cena e o resto em sombra; vermelho-carmim e dourado como acentos; fonte gótica em pixel |
| Silent Hill | neblina baixa no portão; parede de azulejos sob luz fluorescente no Sobre; interior iluminado só pela tela |
| Samurai Jack, Vagabond, Vinland Saga | selo de tinta "G A"; decalque de drakkar "RUMO A OESTE" no terminal; pixação de letras rúnicas no portão |
| BLAME! | cartaz MANAUS 2099 com a megaestrutura sem fim, dentro da garagem |
| Godzilla | cartaz KAIJU NA ORLA, dentro da garagem |
| Evangelion | áreas em nós hexagonais; "SINC." na tela (quantas linguagens da área o projeto usa); console do terminal com faixa de perigo |
| Dredge | cartão-postal "pesca noturna" na mesa, com uma luz que não devia estar ali |
| Pós-punk, new wave, nu metal, rap metal, experimental | lambe-lambe "SOM PESADO" no portão; flyer com linhas de sinal de pulsar na garagem; fita cassete com os gêneros na mesa |
| Engenharia Eletrônica e programação | ligações da roda como trilhas de uma placa redonda (cada linguagem corre na própria faixa, com via nas dobras); mostrador graduado em volta do núcleo; VU de sinal no terminal; esquema a giz (resistor 220R, LED, capacitor) na parede atrás dele; caixa de medição com aviso de alta tensão e placa da Zona Franca, onde fica o polo de eletrônicos de Manaus; protoboard na mesa; "VCC 5V" na abertura |


## Fontes e escopo

Levantamento de 08/10/2026: projetos locais e repositórios públicos de `glwydson` e `atrzad`. O perfil local chamado Ayo aponta para `atrzad`; `github.com/ayo` retornou 404. Os repositórios de perfil não são contados como aplicativos. Ayo Kanban é uma extensão do Ayo Desk em uma worktree. AudioBridge e gerenciador-de-comandas-kds estavam vazios e são identificados como em preparação. LivrariaOnline API é apresentado como trabalho em equipe. Nossos Dias está no catálogo local e seu código não é público.

As capturas vêm de interfaces reais, algumas com dados fictícios fornecidos apenas ao navegador, e de documentação pública para projetos sem interface disponível. A legenda de cada projeto explica a origem. Não foram publicados dados pessoais de aplicativos, fotos, sessões ou credenciais.

## Capturas e validação visual

`scripts/capture.mjs` documenta a reprodução das capturas nesta máquina. Usa Playwright já instalado no cache local, prévias temporárias em loopback nas portas 4391–4398 e os checkouts originais, sem alterar os aplicativos. `--enhanced` captura jogo e painéis com fixtures. As capturas GTK foram feitas com `scripts/smoke.py --snapshots ...` dos próprios projetos, com bancos isolados. Scripts auxiliares são específicos deste ambiente; o site publicado não depende deles.

`scripts/qa.mjs` verifica filtros, diálogos, ampliação, Escape, carregamento de imagens e tamanhos de tela. Requer o servidor ativo e Playwright; ajuste o caminho do import em outra máquina.

## Hospedagem Tailscale

Endereço principal: **https://glaydson-porfolio.tail9ff58.ts.net/**

O portfólio usa uma instância dedicada em userspace, com estado e socket próprios. O Tailscale do sistema e o Nossos Dias continuam independentes. O endereço antigo na porta 8443 continua disponível como acesso secundário.

Serviços de usuário:

- `glaydson-portfolio.service`: site Node.js em 127.0.0.1:4321.
- `glaydson-portfolio-tailscale.service`: daemon dedicado, sem alterar DNS ou rotas do computador.
- `glaydson-portfolio-publish.service`: autenticação inicial e publicação HTTPS na porta 443 da instância dedicada. Habilitado no início da sessão; o usuário já tem linger ativado.

A configuração privada está em `.env.tailscale`, com `TS_AUTHKEY` e `TS_HOSTNAME`. Ela é ignorada pelo Git, tem permissão 600 e fica fora de `dist/`. A chave só é usada quando a instância precisa autenticar; a identidade fica persistida em `~/.local/state/portfolio-tailscale/`. Não publique esse diretório. A chave é passada à CLI por arquivo temporário privado, removido após o uso.

```sh
systemctl --user status glaydson-portfolio glaydson-portfolio-tailscale glaydson-portfolio-publish
systemctl --user restart glaydson-portfolio
journalctl --user -u glaydson-portfolio-publish -n 20
tailscale --socket=/run/user/1000/portfolio-tailscale/tailscaled.sock funnel status
```

Para reaplicar a configuração da instância dedicada:

```sh
systemctl --user restart glaydson-portfolio-publish
```

As unidades estão em `deploy/` e instaladas em `~/.config/systemd/user/`. O script `scripts/tailscale-publish.py` configura somente o socket dedicado. Em outra máquina, ajuste os caminhos das unidades e o UID do socket mostrado acima.

Para desativar a publicação dedicada:

```sh
systemctl --user disable --now glaydson-portfolio-publish
systemctl --user stop glaydson-portfolio-tailscale
```

O acesso secundário antigo é independente. Para retirá-lo também:

```sh
tailscale funnel --https=8443 off
```

Não use `tailscale funnel reset`: isso removeria a publicação de outros sites na instância padrão. Para manter o acesso, o computador precisa estar ligado e conectado à internet. Alterações em `dist/` aparecem sem recompilação. Mudanças em `server.mjs` pedem reinício do serviço Node.

## Contato

- E-mail: glaydson.oliveira2003@gmail.com
- LinkedIn: https://www.linkedin.com/in/glaydson-oliveira
