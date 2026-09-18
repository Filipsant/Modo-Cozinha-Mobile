# Camada `widgets`

Blocos grandes de tela que juntam várias peças e aparecem em mais de uma tela.

**Pode importar:** `features`, `entities` e `shared`.
**Não pode importar:** `app`, `screens` nem outro widget.

| Módulo            | O que vai conter                                                     | Etapa |
| ----------------- | -------------------------------------------------------------------- | ----- |
| `recipe-results/` | Lista de receitas com os estados carregando (skeleton), erro e vazio | 2     |

No web existia o widget `app-layout` (cabeçalho, navegação e rodapé). No mobile esse papel é da barra de abas
do Expo Router, definida em `src/app/(tabs)/_layout.tsx`, então esse widget não existe aqui.

Os módulos ainda não existem: cada um nasce na etapa em que é usado.
