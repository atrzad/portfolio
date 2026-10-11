# Portfólio — Glaydson de Oliveira Araujo

Site pessoal em português com estética grunge dos anos 2000, hacker e cyberpunk. A experiência é toda na rolagem: o portão de uma garagem coberto de grafite se abre, a câmera entra, uma TV CRT mostra a árvore de habilidades com os projetos, e os contatos ficam num papel amassado sobre a mesa. HTML, CSS e JavaScript (módulos ES) servidos por Node.js, sem dependências de produção e sem etapa de build.

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

- `dist/data.js`: **fonte única dos dados**: habilidades, ligações da árvore, projetos (com `skills` e `motivation`) e contatos. Projeto com `skills: []` fica fora da árvore, numa fileira abaixo da TV.
- `npm run versao`: carimba `?v=<hash do conteúdo>` nas referências a `./assets/` do HTML e do CSS, para o navegador nunca mostrar uma imagem antiga em cache (o `npm run arte` já roda isso; o `npm test` avisa se faltar).
- `npm run seo`: regenera, a partir de `data.js`, a lista de projetos oculta visualmente no `index.html` (para leitores de tela e indexação). O `npm test` avisa se ela ficar desatualizada.
- `dist/index.html`: estrutura das cenas (abertura/portão, garagem com TV, zine "sobre", mesa de contatos).
- `dist/style.css`: visual; blocos marcados por etapa (`etapa:hero`, `etapa:portao`, `etapa:arvore`, `etapa:mesa`).
- `dist/js/portao.js`: animação do portão por rolagem, faixas de cinema na travessia e neblina se dissipando.
- `dist/js/som.js`: som opcional (Web Audio, desligado por padrão): ruído mecânico do portão e chiado de rádio quando a TV perde o sinal.
- `dist/js/arvore.js`: árvore SVG (trilhas de PCB, graticula de osciloscópio, sincronia na tela), lista para celular e modal com glitch.
- `dist/js/mesa.js`: inclinação da câmera para a mesa e aviso dourado "SINAL ACESO" (uma vez).
- `scripts/arte/cenas.mjs` e `scripts/arte/simbolos.mjs`: a arte (portão, fachada, garagem, TV, mesa, papel, neblina e selo) é gerada em SVG com texturas procedurais e renderizada em WebP por `npm run arte` (usa o Chromium do Playwright). Silhuetas e símbolos são genéricos: sem marcas, logotipos ou pessoas reais.
- `dist/assets/screenshots/`: capturas reais otimizadas em WebP, mostradas no modal.

Acessibilidade: tudo funciona por teclado (losangos da árvore são focáveis; Enter abre; Escape fecha e devolve o foco), foco visível em verde-ácido, rótulos ARIA e `prefers-reduced-motion` desliga portão animado, glitch, ruído de VHS e LEDs piscando. Em telas até 760 px a árvore vira lista vertical com os mesmos dados. O CSP do servidor bloqueia estilos inline, então valores dinâmicos são aplicados via CSSOM no JavaScript.

As motivações dos projetos foram escritas a partir do problema que cada um trata; ajuste-as em `data.js` com a sua história real.

Fontes tipográficas (em `dist/assets/fonts/`, licenças em `LICENSES.txt`): Silkscreen, VT323, Black Ops One e Cinzel (SIL OFL 1.1) e Permanent Marker (Apache 2.0), obtidas do repositório google/fonts.

## Referências sutis

A estética é cyberpunk e meio sci-fi, com acenos discretos ao que inspira o autor. Nada de logotipos, personagens ou arte copiada: são motivos originais.

| Referência | Onde aparece |
|---|---|
| Soulslike / FromSoftware | dica do início como mensagem laranja no chão ("experimente rolar"); aviso dourado "SINAL ACESO" ao chegar no contato; motivação dos projetos como inscrição em serifa romana dourada |
| Hollow Knight, Blasphemous | tom de lore nas inscrições e no rodapé ("toda garagem guarda um reino esquecido"); vermelho-carmim e dourado como acentos |
| Silent Hill | neblina baixa no portão, ferrugem e chiado de rádio quando a TV perde o sinal (com som ligado) |
| Samurai Jack, Vagabond, Vinland Saga | faixas de cinema na travessia do portão; ronin de chapéu de palha no grafite; selo de tinta "G A"; adesivo de drakkar "RUMO A OESTE" na TV |
| BLAME! | cartaz MANAUS 2099 com megaestrutura sem fim e uma figura minúscula |
| Godzilla | cartaz KAIJU NA ORLA |
| Evangelion | nós hexagonais da árvore; "SINC." na tela (quanto das habilidades o projeto usa); adesivo "SINC. 400%" |
| Dredge | cartão-postal "pesca noturna" na mesa, com uma luz que não devia estar ali |
| Pós-punk, new wave, nu metal, rap metal, experimental | flyer com linhas de sinal de pulsar; fita cassete com os gêneros na mesa |
| Engenharia Eletrônica e programação | ligações da árvore como trilhas de PCB (as dos projetos ficam como conexões não roteadas); graticula de osciloscópio na tela; esquema a giz (resistor 220R, LED, capacitor) na parede; protoboard na mesa; "VCC 5V" na abertura |


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
