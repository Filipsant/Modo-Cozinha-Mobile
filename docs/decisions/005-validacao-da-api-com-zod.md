# 005: Validação da API com Zod

**Status:** aceita · setembro de 2026

## Contexto

A TheMealDB devolve campos com nomes como `strMeal`, ingredientes espalhados em 40 campos soltos e valores que
podem ser `null`, `""` ou `" "`. Durante o desenvolvimento a própria API mudou: ganhou o campo `strCountry`, e
o `filter.php` passou a devolver a origem. Sem validação, uma mudança dessas vira `undefined` na tela.

## Decisão

- `fetchJson` (em `shared/api`) é o único lugar que chama `fetch` e devolve `unknown`.
- Os schemas Zod em `entities/recipe/api/recipe.dto.ts` validam cada resposta na entrada.
- Um mapper (`recipe.mapper.ts`) converte o formato da API para os tipos do app (`Recipe`, `RecipeSummary`).
  Nenhum outro arquivo conhece `strMeal`: é a "camada anticorrupção".
- `looseObject` mantém os campos extras (os 40 de ingredientes) para o mapper ler.

## Consequências

- Se a API mudar de formato, o erro aparece com mensagem clara no cliente, e a tela mostra "Tentar de novo".
- O campo novo `strCountry` entrou em um arquivo só (DTO + mapper), sem mexer em nenhuma tela.
- O mapper é testado com respostas reais salvas em `src/shared/testing/fixtures`.
