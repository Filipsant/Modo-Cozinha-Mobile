# Fixtures

Respostas **reais** da TheMealDB salvas em JSON, usadas pelos handlers do MSW. Salve aqui na tarefa
"Exploração da API" da Etapa 0:

| Arquivo                   | Origem                                      | Para testar              |
| ------------------------- | ------------------------------------------- | ------------------------ |
| `lookup-com-video.json`   | `lookup.php?i=52772`                        | Receita com `strYoutube` |
| `lookup-sem-video.json`   | Uma receita sem `strYoutube`                | Link de vídeo ausente    |
| `lookup-bloco-unico.json` | Receita com instruções sem quebra de linha  | `splitSteps` por frase   |
| `lookup-fracoes.json`     | Receita com medidas como `1/2 cup`          | Parser de medidas        |
| `meals-null.json`         | `search.php?s=xyzxyz` → `{ "meals": null }` | Estado vazio             |

Na Etapa 4 entra também o `measures.json`, gerado pelo script `scripts/collect-measures.ts`.
