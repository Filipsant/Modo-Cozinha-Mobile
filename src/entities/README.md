# Camada `entities`

Os **conceitos do negócio**: tipos, acesso a dados e regras puras. Não sabem nada de telas.

**Pode importar:** outras entities (sempre pelo `index.ts`) e `shared`.
**Não pode importar:** `app`, `screens`, `widgets` nem `features`.

| Módulo     | O que vai conter                                                                                           | Etapa |
| ---------- | ---------------------------------------------------------------------------------------------------------- | ----- |
| `recipe/`  | Tipos `Recipe` e `RecipeSummary`, schemas Zod, mapper, `mealdbClient`, queries, `splitSteps`, `RecipeCard` | 2     |
| `measure/` | `parseMeasure`, `scaleMeasure`, `toMetric`, `formatMeasure`, unidades e traduções                          | 4     |

Estrutura prevista:

```
entities/recipe/
├── api/
│   ├── recipe.dto.ts        # schemas Zod da TheMealDB
│   ├── recipe.mapper.ts     # formato da API → formato do app (+ teste)
│   ├── mealdbClient.ts      # chamadas HTTP
│   └── recipe.queries.ts    # chaves e staleTime do TanStack Query
├── model/recipe.types.ts
├── lib/splitSteps.ts        # (+ teste)
├── ui/                      # RecipeCard, IngredientList
└── index.ts
```

As funções de `lib/` são TypeScript puro, sem React Native, e por isso poderiam ser copiadas sem mudança para a
versão web do Modo Cozinha.

Os módulos ainda não existem: cada um nasce na etapa em que é usado.
