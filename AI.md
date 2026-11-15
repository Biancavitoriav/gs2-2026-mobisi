# Uso de Inteligência Artificial

## 1. Objetivo

Este documento registra de forma transparente como a Inteligência Artificial foi utilizada durante o desenvolvimento do Mobisi, aplicação web para consulta e avaliação de acessibilidade de lugares

## 2. Ferramenta utilizada

### ChatGPT

## 3. Interações realizadas

Os exemplos abaixo são versões organizadas dos prompts utilizados pelo grupo durante o desenvolvimento do Mobisi. Eles mantêm o jeito informal de escrever, mas incluem contexto, objetivo, restrições e critérios de validação. O ChatGPT foi usado para investigar, explicar, comparar alternativas e revisar decisões, além de apoiar alterações pontuais no código.

### 3.1 Investigação da contagem de avaliações

**Prompt enviado ao ChatGPT:**

> to com uma diferenca na tela de detalhes: `total_avaliacoes` vem como 1, mas `sim`, `nao` e `nao_sei` aparecem zerados. Antes de sugerir codigo, explica o que pode estar acontecendo comparando o payload da API com o que a tela espera. Me da pelo menos duas formas de tratar isso e nao inventa a distribuicao das respostas. No final indica quais testes eu deveria fazer.

**Resposta do ChatGPT:**

O ChatGPT explicou que o problema estava na diferença entre o total geral e o resumo detalhado retornado pela API. Ele apresentou duas opções: corrigir o backend para sempre enviar os contadores ou fazer o frontend usar `total_avaliacoes` apenas como fallback, deixando claro que a distribuição por resposta não estava disponível. Também reforçou que uma ausência de dados não deveria ser transformada em uma resposta “Sim” ou “Não” e sugeriu comparar os dois endpoints em diferentes cenários.

### 3.2 Revisão do mapeamento da API

**Prompt enviado ao ChatGPT:**

> analisa somente esse mapeamento de dados que fica em `src/data/accessibility.js`. Quero saber se ele aguenta respostas da API com campos em maiusculo, dentro de `resumo` ou `contagens`, e com valores vazios. Nao reescreve o arquivo inteiro: aponta os riscos, sugere uma alteracao pequena e cria exemplos de entrada e saida pra eu conferir.

**Resposta do ChatGPT:**

O ChatGPT apontou que o principal risco era assumir um único formato de resposta. Ele sugeriu procurar aliases de forma controlada, consultar os contêineres conhecidos, converter valores numéricos com segurança e usar zero apenas quando a ausência realmente significasse zero. Também forneceu exemplos de entrada e saída e recomendou testar a função isoladamente antes do build.

### 3.3 Diagnóstico do carregamento de imagens

**Prompt enviado ao ChatGPT:**

> a imagem do card aparece primeiro e depois troca sozinha pela imagem de fallback. Olha a logica do `<img>` e me explica quais eventos podem causar isso. Quero uma proposta que mantenha a URL da API quando ela carregar, use fallback apenas em erro ou timeout e nao baixe imagens para o projeto. Tambem lista os casos de teste de lista e detalhe.

**Resposta do ChatGPT:**

O ChatGPT identificou como causa provável um timer de fallback que não era cancelado quando a imagem da API disparava `onLoad`. A recomendação foi limpar o timer no carregamento bem-sucedido, registrar erro no `onError` e manter o fallback apenas quando a URL falhasse ou excedesse o tempo limite. Também foram indicados testes para URL válida, URL inválida, timeout, lista e detalhes.

### 3.4 Comparação de alternativas de arquitetura

**Prompt enviado ao ChatGPT:**

> estou decidindo entre deixar as telas todas no `App.jsx` ou separar em `pages`, `components`, `data` e `context`. Compara as duas opcoes pensando no Mobisi, que tem home, detalhes, avaliacao, favoritos e chamadas de API. Quero uma recomendacao com vantagens, desvantagens e o impacto nos testes, mas sem criar codigo ainda.

**Resposta do ChatGPT:**

O ChatGPT recomendou separar páginas, componentes, dados e contexto porque cada parte possuía uma responsabilidade diferente. Ele explicou que concentrar tudo no `App.jsx` poderia ser mais rápido no protótipo, mas dificultaria manutenção, testes e evolução. A recomendação foi aplicar a separação gradualmente, começando pelas telas e componentes com fluxos independentes.

### 3.5 Revisão de acessibilidade da interface

**Prompt enviado ao ChatGPT:**

> revisa esse trecho de JSX da tela de detalhes pensando em acessibilidade. Nao muda o visual sem necessidade. Lista problemas de semantica, labels, foco de teclado, contraste e textos de loading/erro. Para cada ponto, explica o motivo e sugere a menor mudanca possivel. Depois monta um checklist manual pra eu validar no navegador.

**Resposta do ChatGPT:**

O ChatGPT verificou se os controles tinham nomes acessíveis, se os botões informavam seu estado, se a ordem de foco fazia sentido e se os estados de carregamento e erro eram compreensíveis. As sugestões preservaram o layout e priorizaram HTML semântico, `aria-label` quando necessário, foco visível e mensagens claras. Também foi criado um checklist de validação com teclado, zoom e leitor de tela quando disponível.

### 3.6 Criação de casos de teste

**Prompt enviado ao ChatGPT:**

> monta casos de teste manuais pro fluxo de avaliar um local. Quero cenarios de sucesso, API fora do ar, perguntas vazias, envio duplicado, resposta “Nao sei” e volta sem enviar. Em cada caso coloca pre-condicao, passos, resultado esperado e o que eu preciso observar no console. Nao inventa endpoint que nao existe.

**Resposta do ChatGPT:**

O ChatGPT organizou uma matriz de testes sem alterar o código, cobrindo carregamento das perguntas, seleção de respostas, envio único, tratamento de erro e preservação do estado do formulário. Para “Não sei”, o teste conferia se o valor enviado era `NAO_SEI`. Em caso de falha, foi recomendado que a tela mostrasse uma mensagem compreensível e permitisse nova tentativa sem duplicar a avaliação.

### 3.7 Revisão de documentação e qualidade

**Prompt enviado ao ChatGPT:**

> revisa o README e o AI.md do Mobisi. Confere se a descricao bate com o codigo atual, se os comandos realmente existem no `package.json` e se o uso de IA esta documentado de forma honesta. Aponta trechos vagos, informacoes que precisam de fonte e passos que eu deveria testar antes de entregar. Nao reescreve tudo automaticamente.

**Resposta do ChatGPT:**

O ChatGPT comparou a documentação com `package.json`, `vite.config.js`, `vercel.json` e a estrutura de `src`. A resposta apontou divergências e sugeriu correções pontuais, como confirmar os comandos `dev`, `build` e `preview`, explicar o proxy da API e diferenciar o apoio de desenvolvimento das funcionalidades de IA no produto.

## 4. Validação das respostas

O grupo validou as respostas e alterações da seguinte forma:

- conferência dos arquivos modificados e dos diffs gerados;
- consulta e teste dos endpoints da API do Mobisi;
- comparação entre o contrato da API e os campos usados no frontend;
- verificação de rotas, estados de carregamento, mensagens de erro e envio de avaliações;
- teste direto de URLs de imagens e implementação de fallback quando necessário;
- revisão manual de componentes, ícones, responsividade e acessibilidade básica;
- execução recorrente de `npm run build`, sempre verificando se a compilação terminava sem erros;
- uso do navegador quando possível, registrando as situações em que a validação visual foi limitada por ambiente ou timeout.

Um exemplo importante de validação foi a investigação da contagem de avaliações: a resposta do ChatGPT não foi aceita apenas visualmente; o grupo comparou `total_avaliacoes`, `acessibilidade` e o endpoint de avaliações para identificar a inconsistência entre os dados.

## 5. Análise crítica

### Benefícios

- acelerou a criação da estrutura inicial do projeto;
- ajudou a transformar referências visuais em componentes React;
- facilitou a integração com vários endpoints da API;
- apoiou a investigação de problemas difíceis, como imagens que mudavam após o carregamento e contagens divergentes;
- reduziu o tempo de formatação e de revisão de código.

### Limitações e dificuldades

- algumas respostas iniciais precisaram ser corrigidas após comparação com o comportamento real da aplicação;
- o ChatGPT não substituiu a investigação do contrato e dos dados retornados pela API;
- houve situações em que a validação no navegador ficou limitada por portas diferentes, versão antiga em `localhost` ou timeout;
- nomes de ícones do Boxicons nem sempre estavam disponíveis na versão usada, exigindo testes e substituições;
- em uma etapa houve confusão entre diretórios do projeto, o que reforçou a necessidade de conferir o caminho dos arquivos antes de aplicar alterações;
- o ChatGPT podia sugerir soluções plausíveis, mas incorretas ou incompletas, especialmente quando os dados do backend estavam inconsistentes.

### Conclusão

O ChatGPT foi útil como ferramenta de apoio, principalmente para acelerar a implementação e orientar a investigação de problemas. Entretanto, os resultados só foram incorporados após revisão do grupo, testes de build, conferência da API e validação do comportamento esperado. A responsabilidade pelo código e pela entrega final continua sendo do grupo.