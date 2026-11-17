# INCLUI

Projeto front-end estático em português do Brasil, com foco em inclusão, acessibilidade e orientação para serviços públicos.

## Visão geral

O INCLUI é um guia digital pensado para aproximar pessoas de informações e serviços do dia a dia com linguagem mais clara, recursos de acessibilidade e caminhos simples de compreensão.

A proposta do projeto é ajudar pessoas a encontrar orientações sobre temas como saúde, educação, serviços digitais do governo e acesso às informações públicas, com atenção especial à acessibilidade e à autonomia da pessoa usuária.

---

## Páginas e recursos

- `index.html` — página principal com apresentação do impacto social, perfis atendidos, simulador de persona, escolhas de acessibilidade, busca por tema e voz, demonstração “Entenda por mim”, comparação ilustrativa antes/depois e glossário pesquisável
- `sobre.html` — página institucional com a proposta, princípios e objetivos do projeto
- `integrantes.html` — apresentação da equipe responsável pelo INCLUI
- `faq.html` — perguntas frequentes sobre o projeto, acessibilidade e uso do site
- `contato.html` — formulário que prepara uma mensagem no aplicativo de e-mail; não envia dados ao site
- `vacinacao.html` — guia informativo sobre vacinação no SUS
- `cursos-gratuitos.html` — guia para consultar cursos gratuitos do Aprenda Mais (MEC)
- `servicos-digitais.html` — passo a passo para encontrar serviços do gov.br, conferir requisitos e apoiar pessoas sem compartilhar credenciais
- `css/style.css` — estilos, identidade visual e responsividade
- `js/script.js` — navegação, preferências de acessibilidade, leitura em voz alta, busca por voz, simulador de persona, demonstração “Entenda por mim”, animações leves e checklists locais
- `assets/images/` — pasta para imagens do projeto
- `assets/icons/` — pasta para ícones e elementos visuais

---

## Funcionalidades principais

- Acessibilidade com opções de leitura em voz alta, contraste, fonte maior e integração com VLibras
- Simulador de perfil para demonstrar diferentes necessidades de uso
- Busca por tema e busca por voz, quando disponível no navegador
- “Entenda por mim” para transformar explicações em linguagem mais simples
- Guias práticos para serviços digitais, vacinação e cursos gratuitos
- Formulário de contato que prepara um e-mail para envio manual pela pessoa usuária
- Experiência front-end estática sem backend, banco de dados ou autenticação

---

## Importante sobre dados e privacidade

As listas de verificação e preferências de acessibilidade são armazenadas somente no navegador, usando `localStorage`.

O simulador de persona aplica combinações de recursos disponíveis; a comparação antes/depois é um exemplo ilustrativo, não uma conversão automática.

O site não possui backend, contas de usuário nem banco de dados.

A busca por voz usa o reconhecimento de fala disponível no navegador e só começa após a pessoa ativar o microfone; o fornecedor do navegador pode processar o áudio.

O recurso “Entenda por mim” apresenta exemplos fixos e pode separar texto em frases no próprio dispositivo: não usa IA, não lê imagens ou PDFs, não verifica o conteúdo e não envia nem salva o texto. Não cole dados pessoais.

O formulário de contato apenas prepara um e-mail para revisão e envio pela própria pessoa.

Os links de serviços levam ao canal oficial responsável, onde requisitos, prazos e disponibilidade devem ser confirmados.

Ao publicar o site, use HTTPS.

VLibras é carregado do serviço oficial e depende de conexão. O avatar é uma tradução automática de apoio, não substitui intérprete humano.

---

## Como visualizar

Você pode abrir o arquivo `index.html` diretamente em um navegador ou rodar um servidor local simples.

- Abra `index.html` no navegador.

## Estrutura do projeto

```text
gs_inclui/
├── index.html
├── sobre.html
├── integrantes.html
├── faq.html
├── contato.html
├── vacinacao.html
├── cursos-gratuitos.html
├── servicos-digitais.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── icons/
│   └── images/
├── README.md
└── .gitignore
```

---

## Objetivo do projeto

O INCLUI busca:

- ampliar o acesso à informação pública
- reduzir barreiras de leitura, compreensão e navegação
- apoiar pessoas com diferentes perfis de uso e acessibilidade
- tornar serviços digitais mais compreensíveis e informativos
- estimular autonomia e cidadania digital

---

## Desenvolvimento

Este é um protótipo front-end acadêmico e experimental, desenvolvido para demonstrar uma interface acessível com foco em orientação para serviços públicos e inclusão digital.

---

## Licença

Este projeto possui finalidade acadêmica e educacional.

---

## INCLUI

“Se a tecnologia é para todos, por que nem todos conseguem utilizá-la?”
