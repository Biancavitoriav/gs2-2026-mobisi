# Mobisi

O Mobisi é uma aplicação web voltada à consulta e avaliação de acessibilidade em lugares. A plataforma permite encontrar locais, pesquisar por nome ou endereço, filtrar favoritos, consultar informações de acessibilidade e enviar avaliações organizadas por categorias.

A aplicação possui uma interface responsiva e não exige cadastro ou login para iniciar a navegação.

## Deploy

A versão publicada está disponível em:

[https://gs2-2026-mobisi.vercel.app/](https://gs2-2026-mobisi.vercel.app/)

## Funcionalidades

- Listagem de lugares acessíveis;
- Busca por nome, endereço ou categoria;
- Filtro de lugares favoritos;
- Visualização dos detalhes de cada local;
- Informações de acessibilidade física, visual, auditiva e cognitiva;
- Avaliação de locais por perguntas e categorias;
- Estados de carregamento, erro e tentativa novamente.

## Tecnologias utilizadas

- React 19;
- React Router;
- Vite;
- JavaScript;
- HTML semântico;
- CSS responsivo;
- Tailwind CSS 4 via plugin do Vite;
- Boxicons para os ícones da interface.

## Pré-requisitos

Antes de executar o projeto, instale:

- Node.js 18 ou superior;
- npm, instalado junto com o Node.js;
- Git, caso o projeto seja obtido por um repositório Git.

Para conferir as versões instaladas:

```bash
node --version
npm --version
```

## Instalação

1. Clone ou baixe este repositório.
2. Acesse a pasta do projeto
3. Instale as dependências:

```bash
npm install
```

## Execução em ambiente de desenvolvimento

Inicie o servidor local com:

```bash
npm run dev
```

Depois, acesse a URL exibida no terminal, normalmente:

```text
http://localhost:5173
```

Durante o desenvolvimento, o Vite encaminha as requisições iniciadas em `/api/mobisi` para a API do Mobisi. A URL base também pode ser substituída pela variável de ambiente `VITE_API_BASE_URL` quando necessário.

## Build e pré-visualização de produção

Para gerar a versão otimizada:

```bash
npm run build
```

Para visualizar localmente os arquivos gerados:

```bash
npm run preview
```

## Estrutura principal

```text
src/
├── components/   Componentes reutilizáveis da interface
├── context/      Estado compartilhado da aplicação
├── data/         Mapeamento e normalização dos dados da API
├── pages/        Telas de início, detalhes e avaliação
├── services/     Comunicação com a API do Mobisi
├── App.jsx       Rotas e composição principal da aplicação
└── main.jsx      Ponto de entrada do React
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção. |
| `npm run preview` | Executa uma pré-visualização do build. |