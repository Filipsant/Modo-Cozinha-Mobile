# Camada `app`

Inicializa o app e define a navegação. É a camada mais alta: pode importar todas as outras.

No mobile, esta pasta também é a **pasta de rotas do Expo Router**: cada arquivo aqui vira uma tela
navegável. Por isso os arquivos de rota são finos e só reexportam uma tela de `@/screens`.

| Arquivo                       | O que faz                                                                   |
| ----------------------------- | --------------------------------------------------------------------------- |
| `_layout.tsx`                 | Raiz do app: providers (TanStack Query) e a pilha de navegação              |
| `(tabs)/_layout.tsx`          | Barra de abas inferior: Início, Favoritos e Lista de compras                |
| `(tabs)/index.tsx`            | Rota `/` → `HomeScreen`                                                     |
| `(tabs)/favoritos.tsx`        | Rota `/favoritos` → `FavoritesScreen`                                       |
| `(tabs)/lista-de-compras.tsx` | Rota `/lista-de-compras` → `ShoppingListScreen`                             |
| `receita/[id]/index.tsx`      | Rota `/receita/52772?porcoes=6` → `RecipeDetailsScreen`                     |
| `receita/[id]/cozinhar.tsx`   | Rota `/receita/52772/cozinhar?porcoes=6` → `CookingModeScreen` (tela cheia) |
| `+not-found.tsx`              | Qualquer rota inexistente → `NotFoundScreen`                                |

**Regra:** nenhuma lógica aqui. Se um arquivo de rota passar de uma linha de reexportação, a lógica deve
ir para a tela em `@/screens`.

**Exceção às convenções:** o Expo Router exige `export default` nos arquivos de rota. Em todo o resto do
projeto usamos exportações nomeadas.
