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
