# 006: Porções base e volume em ml

**Status:** aceita · setembro de 2026

## Contexto

A TheMealDB não informa o rendimento das receitas, e as medidas chegam em texto livre e em unidades americanas
("1/2 cup", "2 tbsp", "8 oz"). Para escalar as porções e mostrar medidas métricas é preciso um ponto de partida e
uma regra de conversão.

## Decisão

- Toda receita rende **4 porções** (`BASE_SERVINGS`). O fator é `porções / 4`, de 1 a 20 porções.
- As porções ficam no endereço (`?porcoes=6`), não num estado global.
- O parser (`parseMeasure`) transforma o texto em quantidade, faixa, unidade e resto. Quando não há número no
  começo ("to taste", "Juice of 1"), o texto original é mantido.
- Peso vira grama (oz, lb). **Volume vira mililitro** (cup, tbsp, tsp, fl oz), inclusive a xícara: converter xícara
  em grama depende da densidade de cada ingrediente, e errar isso é pior do que mostrar ml.
- Arredondamento prático: múltiplos de 5 acima de 20 g ou ml; abaixo, uma casa decimal.
- No sistema "original", as unidades são só traduzidas (cup → xícara) e as quantidades mostram frações amigáveis
  (0,5 → ½).

## Consequências

- O parser reconhece 86% das 637 medidas reais coletadas pelo `scripts/collect-measures.ts`; o resto aparece como
  texto e nunca some nem vira `NaN` (há um teste que roda todas as medidas).
- Receitas com rendimento diferente de 4 ficam aproximadas. É uma limitação conhecida da fonte de dados.
