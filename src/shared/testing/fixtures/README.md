# Fixtures

Respostas **reais** da TheMealDB salvas em JSON, usadas pelos handlers do MSW e pelos testes. Todas são exportadas
por `index.ts` como `fixtures` (importe com `import { fixtures } from '@/shared/testing'`).

| Arquivo                   | Origem                                      | Para testar                                 |
| ------------------------- | ------------------------------------------- | ------------------------------------------- |
| `lookup-com-video.json`   | `lookup.php?i=52772`                        | Receita com `strYoutube` e quebras de linha |
| `lookup-sem-video.json`   | `lookup.php?i=53481`                        | Sem vídeo, com linhas "step 1"              |
| `lookup-bloco-unico.json` | `lookup.php?i=53060`                        | `splitSteps` por frase                      |
| `lookup-fracoes.json`     | `lookup.php?i=53456`                        | Medidas como `2 1/2 cups`                   |
| `meals-null.json`         | `search.php?s=xyzxyz` → `{ "meals": null }` | Estado vazio                                |
| `search-chicken.json`     | `search.php?s=chicken` (3 primeiras)        | Busca                                       |
| `filter-seafood.json`     | `filter.php?c=Seafood` (5 primeiras)        | Filtro por categoria                        |
| `filter-italy.json`       | `filter.php?a=Italy` (5 primeiras)          | Filtro por origem                           |
| `categories-list.json`    | `list.php?c=list`                           | Chips de categoria                          |
| `measures.json`           | `scripts/collect-measures.ts`               | Parser com as 637 medidas reais da API      |

Para atualizar o `measures.json`: `node scripts/collect-measures.ts`.
