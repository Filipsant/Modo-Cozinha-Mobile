# Camada `widgets`

Blocos grandes de tela que juntam várias peças.

**Pode importar:** `features`, `entities` e `shared`.
**Não pode importar:** `app`, `screens` nem outro widget.

| Módulo            | O que contém                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `recipe-results/` | Lista de cards (`RecipeCard` + `FavoriteButton`) com skeleton, erro com "Tentar de novo" e vazio |

No web existia o widget `app-layout` (cabeçalho, navegação e rodapé). No mobile esse papel é da barra de abas
do Expo Router, definida em `src/app/(tabs)/_layout.tsx`, com o `AppBar` de `shared/ui` como cabeçalho.
