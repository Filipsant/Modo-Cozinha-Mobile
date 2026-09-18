# Camada `screens`

Uma pasta por tela do app (no roadmap web esta camada se chama `pages`). A tela **só compõe** peças das
camadas de baixo e lê os parâmetros da rota; ela não guarda regra de negócio.

**Pode importar:** `widgets`, `features`, `entities` e `shared`.
**Não pode importar:** `app` nem outra tela.

| Pasta             | Tela                          | Requisitos                          | Etapa em que é preenchida |
| ----------------- | ----------------------------- | ----------------------------------- | ------------------------- |
| `home/`           | Início: busca e filtros       | RF01 a RF04, RF06, RF08, RF09       | 2 e 3                     |
| `recipe-details/` | Detalhe: porções e medidas    | RF05, RF07, RF10, RF12 a RF14, RF19 | 2 a 6                     |
| `cooking-mode/`   | Modo cozinha: passos e timers | RF15 a RF18                         | 5                         |
| `favorites/`      | Favoritos                     | RF11                                | 3                         |
| `shopping-list/`  | Lista de compras              | RF20 a RF22                         | 6                         |
| `not-found/`      | Rota inexistente              | RF07                                | 2                         |

Cada pasta exporta a tela pelo `index.ts` (a API pública do módulo).
