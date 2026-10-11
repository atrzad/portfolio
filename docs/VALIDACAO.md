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
