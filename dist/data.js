// Fonte única dos dados do site: habilidades, ligações da árvore, projetos e contatos.
// Usado pelo navegador (app.js) e pelos scripts (check.mjs, build-seo.mjs).

export const skills = [
  { id: "linux", label: "LINUX" },
  { id: "servidor", label: "SERVIDOR" },
  { id: "infra", label: "INFRA" },
  { id: "automacao", label: "AUTOMAÇÃO" },
  { id: "python", label: "PYTHON" },
  { id: "ml", label: "ML / IA" },
  { id: "fullstack", label: "FULL-STACK" },
  { id: "c", label: "C / C++" }
];

// Linhas cinzas da árvore (habilidade ↔ habilidade). LINUX é a raiz.
export const skillLinks = [
  ["linux", "servidor"], ["linux", "automacao"], ["linux", "c"],
  ["servidor", "infra"], ["servidor", "fullstack"], ["infra", "automacao"],
  ["automacao", "python"], ["python", "ml"], ["python", "fullstack"]
];

export const contacts = [
  { label: "E-MAIL", value: "glaydson.oliveira2003@gmail.com", href: "mailto:glaydson.oliveira2003@gmail.com" },
  { label: "GITHUB", value: "glwydson", href: "https://github.com/glwydson" },
  { label: "GITHUB / AYO", value: "atrzad", href: "https://github.com/atrzad" },
  { label: "LINKEDIN", value: "Glaydson Oliveira", href: "https://www.linkedin.com/in/glaydson-oliveira" }
];

// skills: ids acima; lista vazia = projeto fora da árvore (estudo ou em preparação).
// motivation: texto editável, escrito a partir do problema que cada projeto trata.
export const projects = [
  {
    "id": "duelo",
    "name": "Duelo de Termos",
    "short": "Duelo de Termos",
    "category": "Web",
    "kind": "Interface",
    "description": "Um jogo de palavras com partidas solo e salas para até oito jogadores.",
    "detail": "O servidor controla as partidas online, enquanto o modo solo funciona no navegador. Regras, salas e persistência ficam separadas no backend.",
    "motivation": "Testar comunicação em tempo real de verdade: várias pessoas na mesma sala, conexões que caem e voltam, e um servidor que precisa ser a fonte da verdade.",
    "features": [
      "Modo solo e salas multiplayer",
      "Rodadas, placar e reconexão",
      "Convites e modos de dificuldade"
    ],
    "stack": [
      "React",
      "TypeScript",
      "FastAPI",
      "Socket.IO"
    ],
    "skills": [
      "fullstack",
      "python",
      "servidor"
    ],
    "repo": "atrzad/duelo-de-termos",
    "image": "duelo.webp",
    "caption": "Modo solo real do Duelo de Termos (Termox), capturado durante uma partida local."
  },
  {
    "id": "financeiro",
    "name": "Sistema Financeiro",
    "short": "Sist. Financeiro",
    "category": "Web",
    "kind": "Interface",
    "description": "Comprovantes viram lançamentos com OCR e revisão humana.",
    "detail": "API, filas de processamento e armazenamento de arquivos trabalham em conjunto. O projeto está em desenvolvimento; relatórios completos e aprovação multinível fazem parte do planejamento.",
    "motivation": "Tirar da digitação manual o trabalho de transformar comprovantes em lançamentos, sem abrir mão da revisão humana onde o OCR não tem certeza.",
    "features": [
      "Upload e processamento de comprovantes",
      "OCR com confiança por campo",
      "Isolamento de dados por empresa"
    ],
    "stack": [
      "React",
      "FastAPI",
      "PostgreSQL",
      "Celery"
    ],
    "skills": [
      "fullstack",
      "python",
      "servidor",
      "automacao",
      "ml"
    ],
    "repo": "atrzad/Sistema-Financeiro",
    "image": "financeiro.webp",
    "caption": "Tela real de autenticação do Sistema Financeiro. Nenhum dado financeiro pessoal foi utilizado."
  },
  {
    "id": "musica",
    "name": "Ayo Música",
    "short": "Ayo Música",
    "category": "Desktop",
    "kind": "Interface",
    "description": "Biblioteca musical, playlists e letras em aplicativos para Linux e Android.",
    "detail": "Evolução do player do Ayo Desk. Combina uma interface nativa GTK no Linux, Jetpack Compose no Android e um servidor Node.js.",
    "motivation": "Ter um player próprio para a biblioteca local, com letras e playlists, funcionando do mesmo jeito no Linux e no celular.",
    "features": [
      "Biblioteca local e playlists",
      "Letras sincronizadas",
      "Clientes Linux e Android com servidor de sincronização"
    ],
    "stack": [
      "Python",
      "GTK4",
      "Kotlin",
      "GStreamer"
    ],
    "skills": [
      "python",
      "linux",
      "servidor"
    ],
    "repo": "atrzad/ayo-musica",
    "image": "music.webp",
    "caption": "Aplicativo Linux real, executado com biblioteca e banco de demonstração isolados."
  },
  {
    "id": "rest",
    "name": "Rest System",
    "short": "Rest System",
    "category": "Web",
    "kind": "Interface",
    "description": "Comandas e pedidos conectam o salão à cozinha em tempo real.",
    "detail": "Eventos do domínio passam pelo Redis e chegam às interfaces via WebSocket. O núcleo acompanha as transições dos pedidos até a entrega.",
    "motivation": "Encurtar o caminho entre o pedido no salão e o preparo na cozinha, sem papel e com cada perfil vendo só o que precisa.",
    "features": [
      "Mesas, produtos e comandas",
      "Painel de pedidos da cozinha (KDS)",
      "Perfis de administrador, salão e cozinha"
    ],
    "stack": [
      "React",
      "FastAPI",
      "Redis",
      "PostgreSQL"
    ],
    "skills": [
      "fullstack",
      "python",
      "servidor",
      "infra"
    ],
    "repo": "atrzad/rest-system",
    "image": "rest.webp",
    "caption": "KDS real do Rest System. Os pedidos são fictícios, fornecidos apenas ao navegador para esta captura."
  },
  {
    "id": "controle",
    "name": "Sistema de Controle",
    "short": "Sist. Controle",
    "category": "Web",
    "kind": "Interface",
    "description": "Grade de professores, frequência e acompanhamento da rotina escolar.",
    "detail": "API organizada em camadas com Entity Framework Core e FluentValidation. A aplicação possui frontend web e configuração para distribuição desktop.",
    "motivation": "Reunir grade e frequência de professores num lugar só, detectando conflitos de horário antes que virem problema.",
    "features": [
      "Grade semanal com validação de conflitos",
      "Presenças, ausências e justificativas",
      "Cadastros e relatórios de turmas afetadas"
    ],
    "stack": [
      "React",
      "C#",
      ".NET 8",
      "PostgreSQL"
    ],
    "skills": [
      "fullstack",
      "servidor"
    ],
    "repo": "atrzad/Sistema-de-controle",
    "image": "controle.webp",
    "caption": "Dashboard real do sistema escolar. Nomes e números são dados fictícios fornecidos apenas ao navegador para esta captura."
  },
  {
    "id": "std",
    "name": "Ayo Std",
    "short": "Ayo Std",
    "category": "Web",
    "kind": "Interface",
    "description": "Um espaço de estudos com trilhas, notas e sessões de foco.",
    "detail": "O conteúdo se apoia em arquivos Markdown e CSV, enquanto SQLite guarda contas e progresso. O projeto integra leitura, prática e organização de estudos.",
    "motivation": "Juntar trilhas, anotações e sessões de foco num único espaço de estudos, em vez de espalhar tudo por várias ferramentas.",
    "features": [
      "Trilhas e progresso individual",
      "Pomodoro e registro de questões",
      "Contas, grupos e espaços de estudo"
    ],
    "stack": [
      "Node.js",
      "Express",
      "SQLite",
      "Markdown"
    ],
    "skills": [
      "fullstack",
      "servidor",
      "linux"
    ],
    "repo": "atrzad/ayo-std",
    "image": "std.webp",
    "caption": "Página real de entrada do Ayo Std, renderizada pelo código original."
  },
  {
    "id": "sketchbook",
    "name": "Ayo Sketchbook",
    "short": "Sketchbook",
    "category": "Web",
    "kind": "Interface",
    "description": "Notas conectadas, desenhos e organização em um caderno no navegador.",
    "detail": "Os arquivos são a fonte do conteúdo. Um índice deriva busca e relações entre notas, e o login se integra às contas do Ayo Std.",
    "motivation": "Escrever e desenhar no mesmo caderno, com notas ligadas entre si e os arquivos sempre como fonte do conteúdo.",
    "features": [
      "Notas, pastas, tags e backlinks",
      "Desenho com caneta no navegador",
      "Grafo de notas e templates"
    ],
    "stack": [
      "JavaScript",
      "Express",
      "SQLite",
      "Markdown"
    ],
    "skills": [
      "fullstack",
      "servidor",
      "infra"
    ],
    "repo": "atrzad/ayo-sketchbook",
    "image": "sketchbook.webp",
    "caption": "Página real de entrada do Ayo Sketchbook, renderizada pelo código original."
  },
  {
    "id": "desk",
    "name": "Ayo Desk",
    "short": "Ayo Desk",
    "category": "Desktop",
    "kind": "Interface",
    "description": "Ferramentas nativas para tornar o dia a dia no Linux mais prático.",
    "detail": "A suíte combina Python e GTK com um parser matemático em C. Integrações do sistema e persistência ficam em módulos próprios.",
    "motivation": "Deixar o dia a dia no Linux mais prático com ferramentas nativas e leves para rede, áudio, Bluetooth e cálculo.",
    "features": [
      "Controles de rede, áudio e Bluetooth",
      "Calculadora científica e calendário",
      "Integração com serviços do Linux"
    ],
    "stack": [
      "Python",
      "GTK4",
      "C",
      "SQLite"
    ],
    "skills": [
      "python",
      "c",
      "linux"
    ],
    "repo": "atrzad/ayo-desk",
    "image": "calculator.webp",
    "caption": "Calculadora real do Ayo Desk, capturada pelo teste visual do projeto com dados temporários."
  },
  {
    "id": "kanban",
    "name": "Ayo Kanban",
    "short": "Ayo Kanban",
    "category": "Desktop",
    "kind": "Interface",
    "description": "Quadros e cartões para organizar tarefas diretamente no desktop.",
    "detail": "Extensão do Ayo Desk desenvolvida na branch feat/kanban. Não é um repositório independente; regras do quadro são separadas da interface.",
    "motivation": "Organizar tarefas sem sair do desktop, aproveitando a base que o Ayo Desk já tinha.",
    "features": [
      "Quadros, colunas e cartões",
      "Prioridades, prazos e checklists",
      "Importação JSON e exportação Markdown"
    ],
    "stack": [
      "Python",
      "GTK4",
      "SQLite"
    ],
    "skills": [
      "python",
      "linux"
    ],
    "repo": "atrzad/ayo-desk/tree/feat/kanban",
    "image": "kanban.webp",
    "caption": "Quadro real do Ayo Kanban com cartões de demonstração, capturado pelo teste visual do projeto."
  },
  {
    "id": "nossos",
    "name": "Nossos Dias",
    "short": "Nossos Dias",
    "category": "Web",
    "kind": "Interface",
    "description": "Memórias, datas especiais e comunicação em um espaço compartilhado.",
    "detail": "Aplicação web com backend e frontend próprios. Inclui persistência SQLite, notificações Web Push e rotinas de backup.",
    "motivation": "Guardar memórias e datas importantes num espaço privado e compartilhado, hospedado em casa e sob controle próprio.",
    "features": [
      "Feed de lembranças e datas especiais",
      "Chat, mídia e atualizações em tempo real",
      "Sessões por aparelho e autenticação TOTP"
    ],
    "stack": [
      "Node.js",
      "Express",
      "SQLite",
      "PWA"
    ],
    "skills": [
      "fullstack",
      "servidor",
      "infra",
      "linux"
    ],
    "repo": null,
    "image": "nossos.webp",
    "caption": "Tela real de entrada do Nossos Dias. Fotos e conversas pessoais não foram incluídas."
  },
  {
    "id": "treinos",
    "name": "Cronograma de Treinos",
    "short": "Treinos",
    "category": "Web",
    "kind": "Documentação",
    "description": "Planejamento de exercícios, histórico e círculos de amigos.",
    "detail": "Aplicação fullstack com Express e MongoDB. Autenticação JWT vincula planos e histórico a cada usuário.",
    "motivation": "Planejar treinos, registrar o histórico e manter a constância junto com amigos.",
    "features": [
      "Exercícios, séries e cronômetro",
      "Histórico de sessões",
      "Grupos e ranking de frequência"
    ],
    "stack": [
      "React",
      "Node.js",
      "MongoDB",
      "Docker"
    ],
    "skills": [
      "fullstack",
      "infra"
    ],
    "repo": "glwydson/cronograma-treinos",
    "image": "treinos.webp",
    "caption": "Captura do README público do projeto no GitHub."
  },
  {
    "id": "livraria",
    "name": "LivrariaOnline API",
    "short": "Livraria API",
    "category": "Backend",
    "kind": "Documentação",
    "description": "API de livraria com catálogo, autenticação e pedidos.",
    "detail": "Projeto acadêmico em equipe do módulo de C# da UEA, desenvolvido com Thiago Serra Andrade Leite, Daniel Oliveira da Silva e Leandro Henrique de Souza Carrascosa. Arquitetura em camadas, DTOs, services e repositories.",
    "motivation": "Praticar, em equipe, a construção de uma API em camadas com autenticação e regras de negócio.",
    "features": [
      "Catálogo de livros, autores e categorias",
      "Autenticação JWT e pedidos",
      "Swagger e relatório de vendas"
    ],
    "stack": [
      "C#",
      ".NET 8",
      "EF Core",
      "PostgreSQL"
    ],
    "skills": [
      "servidor"
    ],
    "repo": "glwydson/LivrariaOnlineAPI",
    "image": "livraria.webp",
    "caption": "Captura da documentação pública da API no GitHub. Projeto desenvolvido em equipe."
  },
  {
    "id": "repo",
    "name": "Repo Manager",
    "short": "Repo Manager",
    "category": "Desktop",
    "kind": "Documentação",
    "description": "Gerenciador gráfico de repositórios Git e GitHub no Linux.",
    "detail": "Uma ferramenta desktop escrita em C para centralizar o trabalho com repositórios. O código e as instruções de uso estão disponíveis no GitHub.",
    "motivation": "Centralizar o trabalho com vários repositórios Git e GitHub numa interface nativa escrita em C.",
    "features": [
      "Gerenciamento gráfico de repositórios",
      "Integração com Git e GitHub",
      "Interface nativa GTK4"
    ],
    "stack": [
      "C",
      "GTK4",
      "Git",
      "GitHub CLI"
    ],
    "skills": [
      "c",
      "linux",
      "automacao"
    ],
    "repo": "glwydson/repo-manager",
    "image": "repo.webp",
    "caption": "Captura do repositório público do Repo Manager no GitHub."
  },
  {
    "id": "landing",
    "name": "Landing MVP",
    "short": "Landing MVP",
    "category": "Web",
    "kind": "Interface",
    "description": "Página institucional responsiva com navegação e apresentação pessoal.",
    "detail": "Projeto de demonstração publicado no GitHub Pages. O formulário faz validação no cliente; não é apresentado como serviço de envio de mensagens.",
    "motivation": "Praticar uma página responsiva do zero, com navegação, carrossel e validação no navegador.",
    "features": [
      "Página inicial e apresentação",
      "Carrossel de conteúdo",
      "Formulário com validação no navegador"
    ],
    "stack": [
      "React",
      "TypeScript",
      "Vite"
    ],
    "skills": [
      "fullstack"
    ],
    "repo": "glwydson/landind-mvp",
    "image": "landing-live.webp",
    "caption": "Captura da página real publicada em https://glwydson.github.io/landind-mvp/."
  },
  {
    "id": "agent",
    "name": "Agent Sandbox",
    "short": "Agent Sandbox",
    "category": "Backend",
    "kind": "Interface",
    "description": "Ambiente de terminal e painel para acompanhar agentes de desenvolvimento.",
    "detail": "O painel consulta o estado das sessões tmux. O terminal é disponibilizado por ttyd, com um servidor Node.js dedicado ao acompanhamento.",
    "motivation": "Acompanhar agentes de desenvolvimento rodando em terminais isolados, direto do navegador.",
    "features": [
      "Terminal acessível pelo navegador",
      "Painel de acompanhamento das sessões",
      "Ambiente configurado com Docker Compose"
    ],
    "stack": [
      "Node.js",
      "Docker",
      "tmux",
      "ttyd"
    ],
    "skills": [
      "infra",
      "linux",
      "automacao",
      "servidor",
      "ml"
    ],
    "repo": "atrzad/agent-sandbox",
    "image": "agent.webp",
    "caption": "Painel real com sessões fictícias de demonstração e terminal ilustrativo, sem conexão com terminais pessoais."
  },
  {
    "id": "monitor",
    "name": "Monitor de Concursos",
    "short": "Mon. Concursos",
    "category": "Backend",
    "kind": "Documentação",
    "description": "Automação para consultar concursos e preparar resumos diários.",
    "detail": "Script Python que integra um serviço de consulta via JSON-RPC, controla resultados já vistos e prepara notificações. O agendamento é externo ao script.",
    "motivation": "Parar de procurar concursos manualmente todo dia: deixar um script filtrar, deduplicar e resumir as novidades.",
    "features": [
      "Filtros de interesse e deduplicação",
      "Resumo de novidades e falhas",
      "Modo de simulação e notificações"
    ],
    "stack": [
      "Python",
      "JSON-RPC",
      "TOML",
      "systemd"
    ],
    "skills": [
      "python",
      "automacao",
      "linux"
    ],
    "repo": "atrzad/monitor-concursos",
    "image": "monitor.webp",
    "caption": "Captura do README público do script no GitHub. O projeto não possui interface gráfica própria."
  },
  {
    "id": "stooq",
    "name": "Stooq Manager",
    "short": "Stooq Manager",
    "category": "Backend",
    "kind": "Documentação",
    "description": "Projeto de estudo em Java para praticar sintaxe e organização de código.",
    "detail": "Repositório de aprendizado. A descrição reflete o escopo declarado pelo autor, sem presumir funcionalidades não documentadas.",
    "motivation": "Praticar sintaxe e organização de código em Java.",
    "features": [
      "Prática de Java",
      "Organização de arquitetura",
      "Desenvolvimento contínuo"
    ],
    "stack": [
      "Java"
    ],
    "skills": [],
    "repo": "glwydson/stooqmanager",
    "image": "stooq.webp",
    "caption": "Captura do repositório público no GitHub."
  },
  {
    "id": "audio",
    "name": "AudioBridge",
    "short": "AudioBridge",
    "category": "Backend",
    "kind": "Em preparação",
    "description": "Repositório criado; ainda sem código público.",
    "detail": "Na consulta de 8 de outubro de 2026, este repositório estava vazio. Ainda não há interface ou implementação pública para apresentar.",
    "motivation": "Projeto reservado. A motivação será descrita quando o código for publicado.",
    "features": [
      "Repositório disponível no GitHub"
    ],
    "stack": [
      "Em preparação"
    ],
    "skills": [],
    "repo": "glwydson/AudioBridge",
    "image": null,
    "caption": "Repositório vazio na consulta ao GitHub; não há tela para capturar."
  },
  {
    "id": "comandas",
    "name": "Gerenciador de Comandas KDS",
    "short": "Comandas KDS",
    "category": "Backend",
    "kind": "Em preparação",
    "description": "Repositório criado; ainda sem código público.",
    "detail": "Na consulta de 8 de outubro de 2026, este repositório estava vazio. Ainda não há interface ou implementação pública para apresentar.",
    "motivation": "Projeto reservado. A motivação será descrita quando o código for publicado.",
    "features": [
      "Repositório disponível no GitHub"
    ],
    "stack": [
      "Em preparação"
    ],
    "skills": [],
    "repo": "glwydson/gerenciador-de-comandas-kds",
    "image": null,
    "caption": "Repositório vazio na consulta ao GitHub; não há tela para capturar."
  }
];
