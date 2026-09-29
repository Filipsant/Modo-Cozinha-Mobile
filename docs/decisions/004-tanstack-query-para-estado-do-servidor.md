# 004: TanStack Query para o estado do servidor

**Status:** aceita · setembro de 2026

## Contexto

As telas buscam receitas, detalhes e categorias na TheMealDB. Com `useEffect` e `useState`, cada tela teria de
reescrever carregando, erro, nova tentativa, cancelamento da busca anterior e cache ao voltar de uma receita.

## Decisão

- Todo dado que vem da API mora no **TanStack Query**. Nenhum componente copia esses dados para `useState` ou Zustand.
- Chaves, funções e `staleTime` ficam num lugar só: `recipeQueries` (entity `recipe`) e `browseQueries` (feature
  `browse-recipes`).
- Tempos de cache do roadmap: busca e filtros 5 min, detalhe 30 min, categorias e sugestões uma vez por sessão.
- A receita aleatória do "Surpreenda-me" não usa cache: cada toque chama `mealdbClient.getRandom()`.
- O `signal` de cada consulta é repassado ao `fetch`, então digitar cancela a requisição anterior.
- No celular, `useRefetchOnAppFocus` avisa o TanStack Query quando o app volta do segundo plano.

## Consequências

- Voltar de uma receita mostra a busca na hora, sem nova requisição.
- Os estados carregando, erro e "tentar de novo" vêm prontos (`isPending`, `isError`, `refetch`).
- Os testes usam um `QueryClient` novo por teste, sem novas tentativas (`createTestQueryClient`).
