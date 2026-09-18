# Arquitetura: Modo Cozinha Mobile

Este documento explica **onde cada coisa mora e por quê** na versão mobile do Modo Cozinha. Ele adapta a seção
"Arquitetura: Modo Cozinha" do roadmap (feita para a web) para React Native com Expo.

## 1. Visão geral

O app é organizado **por funcionalidade**, em 6 camadas, no estilo Feature-Sliced Design. Cada camada só pode
importar as camadas abaixo dela, e o ESLint quebra o CI se essa regra for violada. Cada tipo de estado fica na
ferramenta certa: dados da API no TanStack Query, busca e porções nos parâmetros da rota, favoritos e lista no
Zustand salvo no celular.

## 2. Do web para o mobile

A arquitetura é a mesma do roadmap. Mudam as ferramentas que só existem no navegador:

| No roadmap (web)                 | No mobile                                                                | Por quê                                                    |
| -------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Vite                             | Expo SDK 57                                                              | Roda no celular pelo Expo Go, sem Android Studio nem Xcode |
| React Router                     | Expo Router                                                              | Rotas criadas a partir de arquivos, com deep links prontos |
| URL (`?q=`, `?porcoes=`)         | Parâmetros de rota (`useLocalSearchParams`) e deep link `modocozinha://` | Mesmo princípio: o estado viaja com o endereço             |
| Camada `pages`                   | Camada `screens`                                                         | No celular falamos em "telas"; o papel é o mesmo           |
| Widget `app-layout` (cabeçalho)  | Barra de abas em `src/app/(tabs)/_layout.tsx`                            | Abas inferiores são o padrão de navegação de apps nativos  |
| Sass e CSS Modules               | `StyleSheet` e tokens TypeScript em `shared/theme`                       | React Native não tem CSS                                   |
| `localStorage`                   | AsyncStorage (via `shared/lib/persistStorage`)                           | Armazenamento local do celular                             |
| Vitest + Testing Library (React) | Jest + `jest-expo` + Testing Library (React Native)                      | Jest é o padrão suportado pelo Expo                        |
| MSW                              | MSW (`msw/node`)                                                         | Igual: a API é simulada nos testes                         |
| Wake Lock API                    | `expo-keep-awake`                                                        | Etapa 5                                                    |
| Web Audio e `navigator.vibrate`  | `expo-audio` e `expo-haptics`                                            | Etapa 5                                                    |
| Timer com a aba em segundo plano | `expo-notifications` agendada para o `endAt`                             | O alarme toca mesmo com o app fechado: melhor que no web   |
| Web Share e clipboard            | `Share` do React Native e `expo-clipboard`                               | Etapa 6                                                    |
| PWA e Vercel                     | Expo Go para testar; EAS Build para gerar o APK                          | App nativo de verdade                                      |
| Lighthouse                       | Props de acessibilidade, TalkBack (Android) e VoiceOver (iOS)            | Não existe Lighthouse para app nativo                      |

TanStack Query, Zustand e Zod continuam iguais.

## 3. As 6 camadas

```
app        rotas (Expo Router) e providers
 ↓
screens    uma pasta por tela
 ↓
widgets    blocos grandes reutilizáveis
 ↓
features   ações do usuário (favoritar, ajustar porções...)
 ↓
entities   conceitos do negócio (receita, medida)
 ↓
shared     código genérico: ui, theme, config, api, lib, testing
```

| Camada     | Responsabilidade                             | Pode importar                       |
| ---------- | -------------------------------------------- | ----------------------------------- |
| `app`      | Rotas, providers e navegação                 | Todas as abaixo                     |
| `screens`  | Montar cada tela e ler os parâmetros da rota | widgets, features, entities, shared |
| `widgets`  | Blocos de tela que juntam várias peças       | features, entities, shared          |
| `features` | Uma ação de valor para o usuário             | entities, shared                    |
| `entities` | Tipos, acesso a dados e regras puras         | outras entities e shared            |
| `shared`   | Código sem nenhuma regra de receitas         | somente shared                      |

**Regras garantidas pelo ESLint** (`eslint.config.js`):

1. Uma camada nunca importa uma camada acima dela.
2. Em `screens`, `widgets` e `features`, um módulo não importa outro módulo da mesma camada. Quem combina é a
   camada de cima, passando dados por props.
3. Todo import entre módulos passa pela API pública (`index.ts`): `@/features/favorite-recipe` sim,
   `@/features/favorite-recipe/model/favoritesStore` não.
4. Para sair do módulo, use `@/`. Caminhos como `../../` são proibidos.
5. `@/shared/testing` só pode ser importado por arquivos `.test.ts(x)`.
6. Sem `any` e sem `export default`, exceto nos arquivos de rota, que o Expo Router exige.

Cada pasta de camada tem um `README.md` com os módulos previstos e a etapa em que cada um nasce.

## 4. Navegação

Com o Expo Router, **cada arquivo em `src/app` vira uma rota**. Por isso os arquivos de rota têm uma linha só e
reexportam uma tela de `src/screens`:

```ts
// src/app/(tabs)/favoritos.tsx
export { FavoritesScreen as default } from '@/screens/favorites';
```

```
src/app/
├── _layout.tsx                  raiz: QueryClientProvider + pilha de navegação
├── (tabs)/                      grupo: não aparece no endereço
│   ├── _layout.tsx              barra de abas: Início, Favoritos, Lista de compras
│   ├── index.tsx                /
│   ├── favoritos.tsx            /favoritos
│   └── lista-de-compras.tsx     /lista-de-compras
├── receita/[id]/
│   ├── index.tsx                /receita/52772?porcoes=6
│   └── cozinhar.tsx             /receita/52772/cozinhar?porcoes=6   (tela cheia)
└── +not-found.tsx               qualquer endereço inexistente
```

- `(tabs)` entre parênteses agrupa telas sem mudar o endereço.
- `[id]` entre colchetes é um parâmetro: `/receita/52772` entrega `id = "52772"` para a tela.
- O detalhe abre por cima das abas; o modo cozinha abre em tela cheia (`fullScreenModal`), sem cabeçalho nem abas.
- **As porções ficam na rota** (`?porcoes=6`), como no roadmap: passam do detalhe para o modo cozinha sem estado
  global e podem ser compartilhadas. O link `modocozinha://receita/52772?porcoes=8` abre o app direto na receita.
- **Nunca coloque arquivos que não sejam rotas em `src/app`** (testes, componentes, utilitários): todo `.ts` ou
  `.tsx` ali vira uma tela.

## 5. Gerenciamento de estado

A pergunta para decidir é: **de onde vem esse dado e quem precisa dele?**

| Tipo               | Exemplos                                   | Onde fica                                   |
| ------------------ | ------------------------------------------ | ------------------------------------------- |
| Estado do servidor | Receitas, detalhes, categorias, origens    | TanStack Query                              |
| Estado da rota     | Busca, categoria, origem, porções          | `useLocalSearchParams` e `router.setParams` |
| Global persistido  | Favoritos, lista de compras, medidas, tema | Zustand + `persist` com `persistStorage`    |
| Global em memória  | Timers em andamento                        | Zustand sem `persist`                       |
| Local de interface | Gaveta aberta, passo atual, diálogo        | `useState`                                  |
| Derivado           | Quantidades escaladas, itens pendentes     | Calculado na renderização com funções puras |

Detalhes do mobile:

- `useRefetchOnAppFocus` (em `shared/api`) avisa o TanStack Query quando o app volta do segundo plano, papel que
  no navegador é feito pelo evento de foco da aba.
- Todo store persistido usa `storageKey('nome')` (prefixo `modo-cozinha:`), `version` e `persistStorage`:

  ```ts
  persist(creator, { name: storageKey('favorites'), version: 1, storage: persistStorage });
  ```

- O AsyncStorage é **assíncrono**: ao abrir o app, os stores levam alguns milissegundos para carregar. Telas que
  dependem deles devem esperar a hidratação (`useFavoritesStore.persist.hasHydrated()`).
- O tema segue o sistema pelo `useColorScheme`. A feature `theme-switcher` (Etapa 7) troca o tema com
  `Appearance.setColorScheme`, sem que `shared/theme` precise conhecê-la.

## 6. Estrutura de pastas

Hoje existem só as camadas, as telas vazias e o `shared` básico. Cada módulo nasce na etapa em que é usado.

```
modo-cozinha-mobile/
├── .github/workflows/ci.yml     formatação, lint, tipos, testes e build a cada push e PR
├── __tests__/routes.test.tsx    testes de navegação (fora de src/app de propósito)
├── assets/                      ícone e splash
├── docs/
│   ├── ARQUITETURA.md           este arquivo
│   └── decisions/               registros de decisão (ADRs)
├── src/
│   ├── app/                     rotas do Expo Router + _layout com providers
│   ├── screens/                 home, recipe-details, cooking-mode, favorites, shopping-list, not-found
│   ├── widgets/                 (Etapa 2: recipe-results)
│   ├── features/                (Etapas 2 a 7)
│   ├── entities/                (Etapa 2: recipe; Etapa 4: measure)
│   └── shared/
│       ├── api/                 createQueryClient, useRefetchOnAppFocus
│       ├── config/              API_BASE_URL, BASE_SERVINGS, limites
│       ├── lib/                 persistStorage, storageKey
│       ├── theme/               cores claro e escuro, espaçamentos, fontes, useTheme
│       ├── ui/                  Screen, Title, Paragraph
│       └── testing/             setupTests, renderWithProviders, MSW, fixtures
├── app.json                     nome, scheme de deep link, tema automático, plugins
├── eslint.config.js             regras de camadas
├── jest.config.js               preset jest-expo + ajustes para o MSW
└── tsconfig.json                strict, alias @/ e tipos do Jest
```

Dentro de cada módulo de `entities` e `features`, os segmentos são sempre os mesmos, e cada módulo só cria os que
usa: `ui/` (componentes), `model/` (stores, tipos e hooks), `api/` (chamadas e queries), `lib/` (funções puras,
sem React) e `index.ts` (API pública).

## 7. Como criar um módulo novo

Exemplo: a feature `favorite-recipe` da Etapa 3.

1. **Crie a pasta na camada certa.** É uma ação do usuário, então: `src/features/favorite-recipe/`.
2. **Crie só os segmentos necessários:**
   ```
   src/features/favorite-recipe/
   ├── model/favoritesStore.ts          store Zustand com persist
   ├── model/favoritesStore.test.ts
   ├── ui/FavoriteButton.tsx
   └── index.ts
   ```
3. **Dentro do módulo, use imports relativos** (`../model/favoritesStore`).
4. **Exporte só o que outros módulos precisam** no `index.ts`:
   ```ts
   export { FavoriteButton } from './ui/FavoriteButton';
   export { useIsFavorite } from './model/favoritesStore';
   ```
5. **Use na camada de cima**, pelo alias: a tela `recipe-details` importa `@/features/favorite-recipe`.
6. **Precisa de outra feature?** Não importe. A tela importa as duas e passa os dados por props. O `RecipeCard`
   (em `entities/recipe`) recebe o botão de favorito por uma prop `actions`, sem conhecer a feature.
7. **Rode `npm run lint`.** Se algum import quebrar a arquitetura, o ESLint explica como corrigir.

## 8. Testes

| Nível         | O que testar                                          | Onde fica                       | Ferramenta                     |
| ------------- | ----------------------------------------------------- | ------------------------------- | ------------------------------ |
| Unitário      | `lib/` de entities e features, mapper, `resolveQuery` | Ao lado do arquivo: `x.test.ts` | Jest                           |
| Stores        | Ações dos stores Zustand                              | Ao lado do store                | Jest                           |
| Componente    | Componentes com comportamento e acessibilidade        | Ao lado do componente           | Testing Library (React Native) |
| Integração    | Telas com a API simulada                              | Ao lado da tela                 | Testing Library + MSW          |
| Navegação     | Cada rota abre a tela certa, parâmetros da rota       | `__tests__/`                    | `expo-router/testing-library`  |
| Ponta a ponta | Fluxo completo no aparelho (depois da v1.0)           | —                               | Maestro                        |

Boas práticas:

- Na Testing Library v14, `render` é assíncrono: `await render(...)`.
- Busque elementos como o usuário encontra: `getByRole('header', { name: 'Favoritos' })`, `getByText`.
- Nenhum teste acessa a internet: o MSW recusa qualquer requisição sem resposta simulada
  (`onUnhandledRequest: 'error'`).
- O AsyncStorage é limpo depois de cada teste; stores Zustand também devem ser resetados.
- Metas de cobertura (definir no `jest.config.js` quando as pastas `lib/` existirem, na Etapa 4): 90% em `lib/` e
  70% no total.

## 9. Qualidade automática

| Comando             | O que faz                                                     |
| ------------------- | ------------------------------------------------------------- |
| `npm start`         | Abre o servidor do Expo; leia o QR code com o app Expo Go     |
| `npm run lint`      | ESLint, incluindo as regras de camadas                        |
| `npm run typecheck` | TypeScript sem gerar arquivos                                 |
| `npm test`          | Todos os testes                                               |
| `npm run coverage`  | Testes com relatório de cobertura                             |
| `npm run format`    | Formata o projeto com Prettier                                |
| `npm run build`     | Gera o pacote JavaScript do Android e prova que o app compila |

O CI (`.github/workflows/ci.yml`) roda formatação, lint, tipos, testes e build em todo push na `main` e em todo
pull request.

## 10. Decisões registradas

Veja [`docs/decisions/`](decisions/README.md).
