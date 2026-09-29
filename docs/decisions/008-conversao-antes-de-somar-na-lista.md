# 008: Conversão antes de somar na lista

**Status:** aceita · setembro de 2026

## Contexto

A lista de compras junta várias receitas. A mesma coisa aparece em unidades diferentes: 1 xícara de leite numa
receita, 4 colheres de sopa noutra, 0,5 L numa terceira. E itens contados vêm com palavras diferentes: "2", "3 Beaten",
"2 large".

## Decisão

- Antes de somar, todo peso e volume vira **g ou ml** (`toBaseMetric`), sem arredondar. 1 cup + 4 tbsp = 300 ml.
- Os nomes são normalizados (minúsculas, espaços e plural simples): "Eggs" e "egg" são o mesmo item.
- Itens contados só somam com a mesma **palavra de contagem** (clove, can, large, pinch...). Palavras de preparo
  ("beaten", "chopped") são ignoradas: "2" + "3 Beaten" ovos = 5 ovos, mas "1 large" fica numa linha à parte.
- Medidas sem número ("to taste") viram uma linha só, sem soma.
- Cada item guarda de quais receitas veio, para a lista agrupada por receita.
- Um item já comprado volta a ficar pendente quando recebe mais quantidade.

## Consequências

- Três receitas com ovos e leite geram uma linha para cada ingrediente, com o total certo (teste em
  `addRecipeToList.test.ts`).
- Na lista, tudo aparece em g/ml (ou kg/L acima de 1000), mesmo com a receita no sistema "original".
