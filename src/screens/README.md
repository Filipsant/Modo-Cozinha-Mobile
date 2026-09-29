# Camada `screens`

Uma pasta por tela do app (no roadmap web esta camada se chama `pages`). A tela **só compõe** peças das
camadas de baixo e lê os parâmetros da rota; ela não guarda regra de negócio.

**Pode importar:** `widgets`, `features`, `entities` e `shared`.
**Não pode importar:** `app` nem outra tela.

| Pasta             | Tela                                      | Requisitos                          |
| ----------------- | ----------------------------------------- | ----------------------------------- |
| `home/`           | Início: busca, filtros e sugestões        | RF01 a RF04, RF06, RF08, RF09, RF23 |
| `recipe-details/` | Detalhe: porções, medidas e lista         | RF05, RF07, RF10, RF12 a RF14, RF19 |
| `cooking-mode/`   | Modo cozinha: passos, timers, tela ligada | RF15 a RF18                         |
| `favorites/`      | Favoritos com ordenação e desfazer        | RF11                                |
| `shopping-list/`  | Lista de compras somada                   | RF20 a RF22                         |
| `not-found/`      | Rota inexistente                          | RF07                                |

Cada pasta exporta a tela pelo `index.ts` (a API pública do módulo). Partes grandes de uma tela ficam na mesma
pasta (por exemplo `home/HomeHeader.tsx`), e o teste de integração da tela fica ao lado dela.
