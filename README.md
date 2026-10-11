# Portfólio — Glaydson de Oliveira Araujo

Site pessoal em português com catálogo de projetos, filtros por área, detalhes técnicos e capturas ampliáveis. HTML, CSS e JavaScript, servido por Node.js sem dependências de produção.

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
npm run check
npm test
```

## Editar

- `dist/index.html`: apresentação, formação e contato.
- `dist/style.css`: visual e comportamento responsivo.
- `dist/projects.json`: catálogo, tecnologias, links e origem dos prints.
- `dist/assets/screenshots/`: capturas reais otimizadas em WebP.
- `dist/app.js`: filtros e diálogos acessíveis.

O site não depende do GitHub em tempo de execução. Nenhuma chave, conta pessoal, banco de produção ou serviço de analytics é necessário.

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
