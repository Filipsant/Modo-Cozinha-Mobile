# Guia dos arquivos

Um mapa rápido do projeto: onde cada coisa mora e como trabalhar em cada lugar. Quando for programar uma etapa e
quiser um modelo de código pronto, veja o [MODELOS-DE-CODIGO.md](MODELOS-DE-CODIGO.md).

## 1. A ideia principal: um prédio de 6 andares

O código fica dividido em 6 "andares", dentro da pasta `src`. A regra é uma só: **quem está em cima pode usar o que
está embaixo, mas quem está embaixo nunca sobe.** Se você quebrar essa regra, o corretor automático (ESLint) avisa
na hora e explica como corrigir.

| Andar          | Pasta      | O que mora lá                                   | Exemplo                                     |
| -------------- | ---------- | ----------------------------------------------- | ------------------------------------------- |
| 6º (cobertura) | `app`      | O mapa das telas: quais existem e como se chega | As abas Início, Favoritos e Lista           |
| 5º             | `screens`  | As telas                                        | Tela de detalhe da receita                  |
| 4º             | `widgets`  | Blocos grandes usados em mais de uma tela       | A lista de receitas com fotos               |
| 3º             | `features` | Coisas que o usuário **faz**                    | Favoritar, ajustar porções, riscar da lista |
| 2º             | `entities` | Os assuntos do app                              | O que é uma receita, o que é uma medida     |
| Térreo         | `shared`   | Ferramentas que serviriam para qualquer app     | Botão, cores, título                        |

## 2. Os arquivos da raiz (configuração)

São os arquivos fora da pasta `src`. Você vai mexer pouco neles.

| Arquivo              | Para que serve                                                      | Quando mexer                                                                        |
| -------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `package.json`       | Lista das bibliotecas e dos comandos do projeto                     | Ao instalar uma biblioteca. Use `npx expo install nome`, que escolhe a versão certa |
| `app.json`           | Nome do app, ícone, tema claro e escuro, link que abre o app direto | Quando uma biblioteca pedir. Depois, reinicie o `npm start`                         |
| `tsconfig.json`      | Regras do TypeScript e o atalho `@/` para a pasta `src`             | Quase nunca                                                                         |
| `eslint.config.js`   | O "fiscal" que garante as regras do prédio                          | Quase nunca. **Não desligue regras para passar**: mude o arquivo de lugar           |
| `jest.config.js`     | Configuração dos testes                                             | Se um teste reclamar de uma biblioteca nova                                         |
| `.prettierrc`        | Estilo de formatação do código                                      | Nunca. Rode `npm run format` e ele formata tudo sozinho                             |
| `.gitignore`         | O que o Git não guarda                                              | Raramente                                                                           |
| `.github/workflows/` | Conferência automática no GitHub a cada envio                       | Na Etapa 7                                                                          |

## 3. Pasta por pasta

### `src/app`: o mapa das telas

Cada arquivo aqui vira uma tela que dá para abrir. Eles têm **uma linha só**, que aponta para a tela de verdade na
pasta `screens`.

| Arquivo                       | Abre                                                |
| ----------------------------- | --------------------------------------------------- |
| `_layout.tsx`                 | Não é tela: é a "moldura" que envolve o app inteiro |
| `(tabs)/_layout.tsx`          | A barra de abas embaixo da tela                     |
| `(tabs)/index.tsx`            | Início                                              |
| `(tabs)/favoritos.tsx`        | Favoritos                                           |
| `(tabs)/lista-de-compras.tsx` | Lista de compras                                    |
| `receita/[id]/index.tsx`      | Detalhe de uma receita                              |
| `receita/[id]/cozinhar.tsx`   | Modo cozinha, em tela cheia                         |
| `+not-found.tsx`              | Aviso de "página não encontrada"                    |

**Cuidado:** nunca coloque outro tipo de arquivo nesta pasta (teste, componente, função). Tudo o que está aqui vira
tela.

**Para criar uma tela nova:**

1. Crie a tela numa pasta nova dentro de `screens`.
2. Crie a "porta de entrada" dela (o arquivo `index.ts`).
3. Crie o arquivo de uma linha aqui em `app`, com o nome que vai aparecer no endereço.
4. Adicione a tela no teste de rotas.

### `src/screens`: as telas

A tela é o **maestro**: não toca nenhum instrumento, só diz quem entra e quando. Ela:

- lê o endereço (qual receita, quantas porções);
- pede os dados;
- escolhe o que mostrar: carregando, erro, vazio ou pronto;
- junta as peças dos andares de baixo e passa informações de uma para outra.

A tela **não** faz cálculos nem busca dados na internet por conta própria. Se passar de umas 150 linhas, divida.

| Tela             | Hoje                                    | Vai ganhar                                         | Etapa |
| ---------------- | --------------------------------------- | -------------------------------------------------- | ----- |
| Início           | Título e um link de teste               | Busca, filtros, lista de receitas, "Surpreenda-me" | 2 e 3 |
| Detalhe          | Mostra o número da receita e as porções | Foto, ingredientes, favoritar, porções, medidas    | 2 a 6 |
| Modo cozinha     | Tela cheia com botão Sair               | Passo a passo, timers, tela sempre ligada          | 5     |
| Favoritos        | Título                                  | Lista dos favoritos, ordenar, desfazer             | 3     |
| Lista de compras | Título                                  | Itens somados, marcar comprado, compartilhar       | 6     |
| Não encontrada   | Mensagem e link para o início           | Nada, já está pronta                               | —     |

### `src/widgets`: blocos grandes

Um widget junta várias peças e aparece em mais de uma tela. O primeiro será a **lista de receitas** (Etapa 2): mostra
os cards com foto, o botão de favoritar e os avisos de carregando, erro e "nenhuma receita encontrada". O widget
recebe os dados prontos da tela; ele não busca nada sozinho.

### `src/features`: o que o usuário faz

Cada ação é uma **caixinha** completa. **Uma caixinha nunca abre a outra**: o favoritar não sabe que a lista de
compras existe. Quando duas precisam conversar, a tela faz a ponte.

| Caixinha           | O que faz                                | Etapa |
| ------------------ | ---------------------------------------- | ----- |
| `browse-recipes`   | Buscar e filtrar receitas                | 2 e 3 |
| `favorite-recipe`  | Favoritar e guardar no celular           | 3     |
| `adjust-measures`  | Mudar porções e trocar as medidas        | 4     |
| `cooking-steps`    | Passar os passos da receita              | 5     |
| `kitchen-timers`   | Timers com alarme                        | 5     |
| `screen-wake-lock` | Manter a tela ligada                     | 5     |
| `shopping-list`    | Lista de compras somada e compartilhável | 6     |
| `theme-switcher`   | Trocar entre tema claro e escuro         | 7     |

**Dentro de cada caixinha** existem até quatro gavetas. Crie só as que for usar:

- `ui`: o que aparece na tela (botões, cards);
- `model`: a memória (por exemplo, o que está favoritado);
- `api`: a conversa com a internet;
- `lib`: cálculos e regras puras, sem tela e sem internet.

Toda caixinha tem uma **porta de entrada**, o arquivo `index.ts`. Só sai da caixinha o que passa por essa porta, e
quem está fora nunca mexe nas gavetas de dentro.

### `src/entities`: os assuntos do app

- **`recipe`** (Etapa 2): o que é uma receita, como buscá-la na internet e o card com a foto.
- **`measure`** (Etapa 4): entender medidas como "1/2 xícara", multiplicar pelas porções e converter para gramas e
  mililitros.

**O caminho de uma receita, da internet até a tela:**

1. O app pede a receita ao site TheMealDB.
2. Uma ferramenta de conferência (Zod) verifica se os dados chegaram no formato certo.
3. Um "tradutor" troca os nomes estranhos do site por nomes claros.
4. A ferramenta de dados (TanStack Query) guarda a receita, para não buscar de novo à toa.
5. A tela mostra.

Só um lugar do app fala com a internet. Se o site mudar, você conserta num lugar só.

### `src/shared`: as ferramentas

Tudo aqui serviria para qualquer app. **Se o arquivo sabe o que é uma receita, ele não pode ficar aqui.**

| Pasta     | O que tem                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------- |
| `config`  | Números fixos do app: endereço do site, receita base para 4 pessoas, limite de 1 a 20 porções   |
| `theme`   | As cores (tema claro e escuro), os espaçamentos e os tamanhos de letra                          |
| `api`     | A configuração da ferramenta de dados e o recarregamento quando o app volta a ser aberto        |
| `lib`     | Pequenas ajudas genéricas, como salvar informações no celular                                   |
| `ui`      | Componentes visuais básicos: fundo de tela, título, parágrafo e, na Etapa 1, botão, aviso, etc. |
| `testing` | Ferramentas só para os testes, como o "site de mentira"                                         |

Todo componente novo desta pasta precisa ser adicionado à porta de entrada dela, senão ninguém consegue usá-lo.

## 4. Como montar um componente

É sempre a mesma receita de bolo, na mesma ordem:

1. **Importações:** primeiro as de fora, depois as do projeto, por último as da própria caixinha.
2. **O que o componente recebe** (as "props").
3. **O componente**, sempre com nome.
4. **As ferramentas que ele usa** (cores, memória), logo no começo.
5. **Cálculos e ações** (o que acontece ao tocar).
6. **Os casos especiais** primeiro: carregando, erro, vazio.
7. **O desenho** do que aparece.
8. **Os estilos fixos**, no fim do arquivo.

Três cuidados em todo componente:

- **Cores e tamanhos vêm sempre do tema**, nunca escritos à mão. Assim o modo escuro funciona sozinho.
- **Tudo o que é tocável precisa de um nome** para o leitor de tela e de tamanho suficiente para o dedo.
- **Todo texto fica dentro de um componente de texto.** No celular, texto solto quebra o app.

## 5. Onde guardar cada informação

Faça estas perguntas em ordem e pare no primeiro "sim":

1. **Vem da internet?** Deixe com a ferramenta de dados (TanStack Query).
2. **Precisa estar no endereço, para compartilhar?** Coloque no endereço da tela (como "8 porções").
3. **Várias telas usam e precisa ficar salvo no celular?** Use a memória global salva (Zustand).
4. **Só um componente usa?** Use a memória do próprio componente.
5. **Dá para calcular a partir de outra coisa?** Calcule na hora, não guarde.

## 6. Testes

- Cada teste fica **ao lado do arquivo que ele testa**, com o mesmo nome e `.test` no final.
- O teste das rotas é a exceção: fica na pasta `__tests__`, porque não pode ficar em `src/app`.
- **Sempre teste** os cálculos (gaveta `lib`) e as memórias (gaveta `model`).
- Procure os elementos **como o usuário procura**: pelo nome e pelo tipo ("o botão Tentar de novo").
- Os testes **nunca usam a internet de verdade**: um "site de mentira" (MSW) responde o que você mandar.
- **Zere a memória antes de cada teste**, para um não herdar a bagunça do outro.
- Todo teste tem três partes: **preparar, fazer e conferir**.

## 7. Antes de terminar um arquivo novo

- [ ] Está no andar certo?
- [ ] O nome segue o padrão? (pastas em inglês com hífen; componentes com a primeira letra maiúscula)
- [ ] Saiu pela porta de entrada da caixinha?
- [ ] As cores vêm do tema?
- [ ] O que é tocável tem nome e tamanho mínimo?
- [ ] Os textos estão em português do Brasil?
- [ ] Tem teste, se for cálculo ou memória?
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passam?

## 8. Quando o ESLint reclamar

| O aviso diz, em resumo...                     | O que fazer                                                      |
| --------------------------------------------- | ---------------------------------------------------------------- |
| "não pode importar a camada que está acima"   | Mude o código para um andar mais baixo ou receba o valor da tela |
| "um módulo não importa outro da mesma camada" | Deixe a tela juntar os dois                                      |
| "importe pela API pública do módulo"          | Use a porta de entrada da caixinha, não uma gaveta de dentro     |
| "para sair do módulo, use o alias @/"         | Troque o caminho com `../../` pelo atalho `@/`                   |
| "só pode ser importado por arquivos de teste" | Essa ferramenta é só para testes                                 |
| "prefer named exports"                        | Dê um nome ao que você exporta                                   |
| "unexpected any"                              | Diga o tipo certo em vez de `any`                                |
