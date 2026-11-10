# INCLUI

Projeto front-end estático em português do Brasil, com foco em inclusão, acessibilidade e orientação para serviços públicos.

## Páginas e recursos

- `index.html` — página principal, escolha de recursos, busca por tema e voz, quadro de comunicação com fala e traduções de frases para inglês, espanhol e VLibras, demonstração “Entenda por mim” e glossário pesquisável
- `sobre.html` — página institucional
- `integrantes.html` — apresentação do time
- `faq.html` — perguntas frequentes
- `contato.html` — formulário que prepara uma mensagem no aplicativo de e-mail; não envia dados ao site
- `vacinacao.html` — orientação informativa sobre vacinação no SUS
- `cursos-gratuitos.html` — orientação para consultar cursos gratuitos do Aprenda Mais (MEC)
- `servicos-digitais.html` — passo a passo para encontrar serviços no gov.br, conferir requisitos, lidar com barreiras de acesso e apoiar familiares sem compartilhar credenciais
- `css/style.css` — estilos e responsividade
- `js/script.js` — navegação, preferências de acessibilidade, leitura em voz alta, busca por voz, quadro de comunicação, demonstração “Entenda por mim” e checklists locais
- `assets/images/` — pasta para imagens
- `assets/icons/` — pasta para ícones

As listas de verificação e preferências de acessibilidade guardam somente configurações neste navegador, usando `localStorage`. O site não possui backend, contas de usuário nem banco de dados. A busca por voz usa o reconhecimento de fala disponível no navegador e só começa após a pessoa ativar o microfone; o fornecedor do navegador pode processar o áudio. O recurso “Entenda por mim” apresenta exemplos fixos e pode separar texto em frases no próprio dispositivo: não usa IA, não lê imagens ou PDFs, não verifica o conteúdo e não envia nem salva o texto. Não cole dados pessoais. O formulário de contato apenas prepara um e-mail para revisão e envio pela própria pessoa. Os links de serviços levam ao canal oficial responsável, onde requisitos, prazos e disponibilidade devem ser confirmados. Ao publicar o site, use HTTPS.

VLibras é carregado do serviço oficial e depende de conexão. O avatar é uma tradução automática de apoio, não substitui intérprete humano. As frases do quadro têm traduções fixas de apoio para inglês e espanhol; não há tradução automática de texto livre. Legendas e vídeos em Libras só podem ser oferecidos quando houver material correspondente revisado. Os recursos de acessibilidade do protótipo não garantem que sites de terceiros sejam acessíveis; o sistema operacional, o navegador e tecnologias assistivas também podem oferecer ajustes.

Os guias são uma proposta inicial de conteúdo e precisam ser revisados pelo grupo antes da apresentação final, conforme as decisões pendentes no documento de Engenharia de Software. O catálogo do gov.br reúne muitos serviços e seus requisitos mudam; confirme as instruções na página oficial de cada serviço. Este protótipo cobre a experiência front-end. Integrações de IA, OCR, API, autenticação, banco de dados, backend Java/Python, gestão editorial e testes com usuários ainda exigem planejamento e implementação próprios; não são simulados como se estivessem ativos.

## Como visualizar

Abra o arquivo `index.html` em um navegador ou rode um servidor local simples.
