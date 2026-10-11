# Validação — 08/10/2026

- Catálogo: 19 entradas, 17 com capturas, duas identificadas como repositórios vazios.
- Fontes: repositórios públicos de glwydson e atrzad; documentação e código local em Projects.
- Imagens: páginas web reais, três aplicativos GTK capturados com bancos temporários, documentação pública para cinco projetos sem interface capturada. Dados de KDS, dashboard escolar e Agent Sandbox são fixtures, identificados nas legendas.
- JavaScript: sintaxe validada.
- Navegador Chromium: filtros de categoria; abertura/fechamento de detalhes; imagem ampliada; Escape em diálogos empilhados; carregamento de todas as imagens; ausência de erros JavaScript e HTTP locais.
- Responsividade: larguras de 320, 390, 768 e 1440 pixels, sem rolagem horizontal. Verificação adicional com tamanho de fonte raiz ampliado.
- Servidor: GET/HEAD somente, loopback, raiz pública limitada a dist; /.env retorna 404; CSP sem scripts externos e bloqueio de incorporação por iframe.
- Fonte: Inter variável, licença SIL Open Font License em dist/assets/FONT-LICENSE.txt. Arquivo obtido do repositório oficial google/fonts.

Os testes verificam o portfólio. Não certificam todas as funcionalidades dos aplicativos apresentados.

## Publicação

Tailscale Funnel ativo na instância principal do Tailscale, porta 8443. Página inicial e catálogo retornaram HTTP 200. Serviço glaydson-portfolio.service habilitado e ativo; linger do usuário já estava ativado. Publicação original na porta 443 preservada.

## Endereço dedicado e contatos

Instância Tailscale em userspace publicada em https://glaydson-porfolio.tail9ff58.ts.net/. Página e catálogo retornaram HTTP 200. Os links de e-mail e LinkedIn foram encontrados no HTML público. Serviços Node, Tailscale dedicado e publicação confirmados ativos. A instância original mantém o Nossos Dias e o acesso secundário na porta 8443. Autenticação usa arquivo privado, sem expor a chave em argumentos ou saídas.

## Garagem grunge — 10/10/2026

- Nova experiência: abertura com ruído VHS e glitch RGB, portão animado pela rolagem com luz de CRT e avanço de câmera, árvore de habilidades em SVG na TV, modal com glitch, zine "sobre" e contatos num papel sobre a mesa.
- Dados centralizados em `dist/data.js` (19 projetos, 16 na árvore e 3 fora dela: um estudo em Java e dois repositórios vazios). Lista SEO estática gerada a partir dos mesmos dados.
- `npm run qa` (Chromium): portão se move e a câmera avança; 8 hexágonos e 16 losangos; hover e foco acendem habilidades, ligações tracejadas e caminho até a raiz LINUX; Enter abre o modal, Escape fecha e devolve o foco; captura ampliada com Escape empilhado; projeto privado sem botão de repositório; 19 itens na lista SEO; 4 contatos; 320, 390, 768 e 1440 px sem rolagem horizontal; texto a 200%; movimento reduzido sem portão em rolagem, sem glitch e sem animações rodando; nenhum erro de JavaScript, HTTP ou CSP.
- Fontes trocadas: Inter removida; entram Silkscreen, VT323, Black Ops One e Permanent Marker (licenças em `dist/assets/fonts/LICENSES.txt`).
- Imagens das cenas: entre 13 KB e 250 KB cada, com versões menores para celular via `srcset`.

## Cyberpunk/sci-fi e referências — 10/10/2026

- Removidos os símbolos de representatividade preta e os elementos de hip-hop da arte; entram motivos cyberpunk/sci-fi e referências sutis (tabela no README).
- `npm run qa` ampliado: dica do início com nome acessível, botão de som alterna, faixas de cinema entram na travessia, tela mostra "SINC. 62,5%" ao passar no Sistema Financeiro, graticula presente, aviso "SINAL ACESO" acende ao chegar no contato e fica oculto com movimento reduzido. Tudo passou em 320, 390, 768 e 1440 px, sem erros de JavaScript, HTTP ou CSP.
- Nova fonte: Cinzel (SIL OFL 1.1). Novas imagens: neblina (ladrilho horizontal sem emenda) e selo de tinta.

## Terminal e pixel art — 11/10/2026

- A TV deu lugar a um terminal grande (tela de 88,5% × 76,9% da moldura), com prompt no topo, árvore em viewBox 1400 × 700 e barra de status com a sincronia. Rótulos que sairiam da tela são movidos para baixo do losango depois que a fonte carrega.
- Todas as cenas passaram a ser pixel art (640 px, paleta fixa de 60 cores, transparência binária; neblina pontilhada). Imagens ampliadas com `image-rendering: pixelated`; conferido que o zoom do portão continua nítido.
- `npm run qa` passou com as novas checagens (moldura do terminal e portão com `image-rendering: pixelated`), em 320, 390, 768 e 1440 px, com movimento reduzido e sem erros de JavaScript, HTTP ou CSP.

## Direção PC-98 e animações leves — 11/10/2026

- O portão sobe com a rolagem e, aberto, a página segue direto para o terminal: saíram o avanço de câmera, as faixas de cinema, a lente e a linha de energia (o percurso do portão caiu de 360vh para 220vh). Com o título compacto, o terminal cabe inteiro abaixo do HUD ao clicar em "Projetos".
- Passar de um projeto para outro na árvore não faz mais a tela piscar nem tocar chiado; a marcha das ligações acesas também saiu. A mesa não inclina mais com a rolagem (pixels sempre nítidos), o aviso dourado e os LEDs animam só opacidade e transform, e o ruído do VHS ficou numa camada menor e sem modo de mesclagem.
- Arte refeita em pontilhado ordenado com paleta própria por cena (referências na tabela "Direção de arte" do README). Imagens novas: parede atrás do terminal, parede de azulejos e página de zine; o interior da garagem, o papel e o selo deixaram de se repetir (cada imagem aparece uma vez, conferido pelo `npm test`).
- Rodapé sem a frase "Feito em Manaus. Toda garagem guarda um reino esquecido."
- `npm run qa` passou com as checagens novas (portão abre inteiro, sem restos da animação depois da abertura, terminal a menos de 1,35 tela do fim do portão e inteiro na janela, nenhuma animação na tela ao trocar de projeto, rodapé sem a frase), em 320, 390, 768 e 1440 px, com texto a 200%, movimento reduzido e sem erros de JavaScript, HTTP ou CSP. As mesmas checagens falham na versão anterior.

## Roda de habilidades e tela do celular — 11/10/2026

- A árvore virou uma roda: do centro saem as áreas Full-stack, Automação e Android; em cada área, as linguagens que ela usa (conferidas nos repositórios locais e nas estatísticas de linguagem do GitHub); na borda, os 16 projetos, ligados às linguagens que usam. As ferramentas nativas para Linux (Ayo Desk, Ayo Kanban, Repo Manager) ficam em Automação, e o Ayo Música, em Android.
- Desktop: hover ou foco acendem o caminho até o centro, põem uma mira no nó e preenchem a ficha ao lado (miniatura, linguagens, stack e sincronia); no toque, o primeiro toque seleciona e o segundo abre.
- Celular (até 900 px): tela própria, com roda compacta de enfeite, abas por área, linguagens como filtro e cartões com miniatura.
- Miniaturas: 17 capturas em 360 × 240 (62 KB no total) e versões de 720 px para o modal em telas pequenas.
- Corrigido: a captura no modal herdava a altura de 960 px do atributo `height` e aparecia gigante e cortada, principalmente no celular; agora mantém a proporção, com tamanho de miniatura. O botão de som some quando o portão termina de abrir.
- Corrigido durante o trabalho: uma chave sobrando no CSS derrubava a regra da parede do Sobre (sem fundo e com rolagem lateral no celular); o `npm test` agora confere as chaves do CSS.
- `npm run qa` passou: roda com 3 áreas, 9 nós de linguagem e 16 projetos; hover em projeto (caminho de 5 ligações, mira, ficha com miniatura leve e "SINC. 50%"), em linguagem e em área; ficha volta à legenda ao sair; tela sem animação ao trocar de nó; toque em 1024 px (primeiro toque seleciona, segundo abre); celular em 320, 390 e 768 px com abas, filtro, resumo, miniaturas carregadas, modal com a imagem média sem estourar a tela e sem rolagem lateral; movimento reduzido e sem erros de JavaScript, HTTP ou CSP.
