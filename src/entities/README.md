# Camada `entities`

Os **conceitos do negócio**: tipos, acesso a dados e regras puras. Não sabem nada de telas.

**Pode importar:** outras entities (sempre pelo `index.ts`) e `shared`.
**Não pode importar:** `app`, `screens`, `widgets` nem `features`.

| Módulo     | O que contém                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recipe/`  | Tipos `Recipe` e `RecipeSummary`, schemas Zod, mapper, `mealdbClient`, `recipeQueries`, `splitSteps`, traduções de categoria e origem, `RecipeCard`, `IngredientList` |
| `measure/` | `parseMeasure`, `scaleMeasure`, `toMetric`, `toBaseMetric`, `formatQuantity`, `formatMeasure`, `translateUnit` e as unidades                                          |

```
entities/recipe/
├── api/
│   ├── recipe.dto.ts        # schemas Zod da TheMealDB
│   ├── recipe.mapper.ts     # formato da API → formato do app (+ teste)
│   ├── mealdbClient.ts      # chamadas HTTP (search, getById, getRandom, listCategories, filterBy...)
│   ├── recipe.queries.ts    # chaves e staleTime do TanStack Query (já devolvem as receitas traduzidas)
│   └── recipe.translation.ts # tradução de nome, passos, ingredientes e medidas (+ teste)
├── model/                   # tipos, categorias traduzidas e as 12 origens do filtro
├── lib/                     # splitSteps, translateCategory, translateOrigin (+ testes)
├── ui/                      # RecipeCard, IngredientList
└── index.ts

entities/measure/
├── model/                   # tipo Unit, sinônimos, conversões, traduções e o dicionário das palavras de medida
├── lib/                     # parser, escala, conversão, formatação, serializeMeasure e translateMeasureText (+ testes)
└── index.ts
```

As funções de `lib/` são TypeScript puro, sem React Native, e por isso poderiam ser copiadas sem mudança para a
versão web do Modo Cozinha.
