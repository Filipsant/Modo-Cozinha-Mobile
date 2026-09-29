# 009: Origens curadas por país

**Status:** aceita · setembro de 2026

## Contexto

O roadmap previa o filtro por origem com a lista da API (`list.php?a=list`). Em setembro de 2026 a TheMealDB mudou:

- a lista passou a ter cerca de 200 origens, e a maioria não tem receita nenhuma;
- a lista devolve adjetivos ("Brazilian"), mas o `filter.php?a=` agora filtra pelo **país** ("Brazil"):
  `a=Brazilian` devolve 0 receitas e `a=Brazil` devolve 11;
- as receitas ganharam o campo `strCountry`, e muitas ficaram com `strArea` vazio.

## Decisão

- O filtro usa uma lista **curada** de 12 países (`ORIGINS` em `entities/recipe/model/labels.ts`), com nome em
  português e bandeira: as 5 do Figma (Italiana, Brasileira, Francesa, Japonesa, Mexicana) e as que têm mais
  receitas.
- O parâmetro da rota guarda o país em inglês (`?origem=Italy`), que é o que a API entende.
- A origem mostrada nos cards vem de `strCountry`, com `strArea` como reserva, traduzida para o português.

## Consequências

- 12 chips cabem numa rolagem horizontal; 200 não caberiam.
- Se a API mudar a forma de filtrar de novo, o ajuste fica em um arquivo (`labels.ts`) e no cliente.
