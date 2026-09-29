# Modo Cozinha Mobile

App de receitas para Android e iOS que ajusta as porções, converte as medidas, monta a lista de compras e guia o
preparo passo a passo com a tela sempre ligada. Versão mobile do Modo Cozinha, feita com React Native e Expo,
usando a API pública [TheMealDB](https://www.themealdb.com/).

> 🚧 Em desenvolvimento. Todas as telas e funcionalidades do escopo estão implementadas e testadas; falta a revisão
> visual das telas contra os frames exportados do Figma e o teste num celular de verdade.

## Funcionalidades

- **Receitas em português**: nomes, ingredientes, medidas e modo de preparo são traduzidos automaticamente (a
  TheMealDB só tem inglês), com cache no celular e a receita original como reserva se o tradutor falhar.
- **Busca** por nome em português ou inglês, com espera de 400 ms, **filtros** por categoria e origem culinária
  (combináveis) e "Surpreenda-me" com uma receita aleatória. Busca e filtros ficam no endereço e podem ser
  compartilhados.
- **Detalhe da receita** com ingredientes, modo de preparo e vídeo.
- **Porções de 1 a 20**: todas as quantidades são recalculadas, com frações amigáveis (½, ¼, ⅔).
- **Medidas originais ou métricas** (g e ml), com as unidades traduzidas (cup → xícara).
- **Modo cozinha** em tela cheia: um passo por vez em fonte grande, deslizar o dedo para trocar de passo, gaveta de
  ingredientes, **timers** detectados no texto ("10 minutos") que flutuam em destaque acima dos botões, com alarme
  sonoro e vibração, e **tela sempre ligada**. Ao concluir, o app avisa e volta para a tela inicial.
- **Lista de compras** que soma ingredientes repetidos de várias receitas (convertendo antes de somar), marca
  comprados, agrupa por receita e compartilha pelo menu do celular.
- **Favoritos** salvos no celular, com ordenação e "Desfazer".
- **Tema claro e escuro**, acessibilidade com leitor de tela (TalkBack e VoiceOver) e áreas de toque de 44 a 64 px.

## Stack

React Native 0.86 · Expo SDK 57 · Expo Router · TypeScript (strict) · TanStack Query · Zustand · Zod ·
AsyncStorage · expo-image · expo-keep-awake · expo-audio · expo-haptics · Jest · Testing Library · MSW · ESLint ·
Prettier · GitHub Actions

## Como rodar

Pré-requisitos: Node.js 24 e o app **Expo Go** instalado no celular.

```bash
npm install
npm start
```

Leia o QR code com a câmera (iOS) ou com o Expo Go (Android). O celular e o computador precisam estar na mesma
rede Wi-Fi.

## Comandos

| Comando             | O que faz                                               |
| ------------------- | ------------------------------------------------------- |
| `npm start`         | Servidor do Expo                                        |
| `npm run lint`      | ESLint, incluindo as regras de camadas                  |
| `npm run typecheck` | Verificação de tipos                                    |
| `npm test`          | Testes                                                  |
| `npm run coverage`  | Testes com relatório de cobertura                       |
| `npm run format`    | Formatação com Prettier                                 |
| `npm run build`     | Gera o pacote JavaScript do Android (prova que compila) |

## Testes

252 testes em 30 arquivos: funções puras (parser de medidas com as 637 medidas reais da API, soma da lista,
timers, filtros), stores, componentes e telas inteiras com a API simulada pelo MSW. Cobertura: cerca de 89% no
total e 91% a 100% nas pastas `lib/`.

## Design

O design vem do Figma "Modo Cozinha — Design System & Componentes" (roxo #7752D5, Plus Jakarta Sans, grade de
8 px). Os tokens estão em `src/shared/theme/tokens.ts` e os ícones exportados do Figma em
`src/shared/ui/icons/`. Veja as adaptações feitas para o celular no
[ADR 010](docs/decisions/010-design-system-do-figma.md).

## Arquitetura

Código organizado por funcionalidade em 6 camadas (`app → screens → widgets → features → entities → shared`),
com as regras de dependência garantidas pelo ESLint e verificadas no CI.

- [docs/ARQUITETURA.md](docs/ARQUITETURA.md): camadas, navegação, estado, pastas, testes e como criar um módulo
- [docs/GUIA-DOS-ARQUIVOS.md](docs/GUIA-DOS-ARQUIVOS.md): mapa simples de onde cada coisa mora
- [docs/MODELOS-DE-CODIGO.md](docs/MODELOS-DE-CODIGO.md): versão técnica, com modelos de código
- [docs/decisions/](docs/decisions/README.md): registros das decisões técnicas (11 ADRs)

## Limitações conhecidas

- A tradução é automática e pode errar termos de cozinha; ela usa um endpoint gratuito e não oficial do Google
  Tradutor ([ADR 011](docs/decisions/011-traducao-automatica-das-receitas.md)).
- A API não informa o rendimento: toda receita é considerada para 4 porções.
- O alarme dos timers toca com o app aberto; com o app fechado exigiria notificações num development build.
- Os dados de busca precisam de internet; favoritos e lista de compras ficam salvos no celular.
