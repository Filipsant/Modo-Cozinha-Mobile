import { fixtures } from '@/shared/testing';

import { parseMeasure } from './parseMeasure';

type Expected = [quantity: number | null, quantityMax: number | null, unit: string | null, rest: string];

/** Todos os formatos vêm do measures.json, coletado da TheMealDB pelo scripts/collect-measures.ts. */
describe('parseMeasure', () => {
  it.each<[string, Expected]>([
    // Tabela do roadmap
    ['1/2 cup', [0.5, null, 'cup', '']],
    ['1 1/2 tbsp', [1.5, null, 'tbsp', '']],
    ['200g', [200, null, 'g', '']],
    ['½ tsp', [0.5, null, 'tsp', '']],
    ['1-2 cloves', [1, 2, null, 'cloves']],
    ['3 large', [3, null, null, 'large']],
    ['to taste', [null, null, null, 'to taste']],
    // Inteiros e decimais
    ['2', [2, null, null, '']],
    ['0.25', [0.25, null, null, '']],
    ['1.5 tablespoon', [1.5, null, 'tbsp', '']],
    ['1,5 kg', [1.5, null, 'kg', '']],
    // Frações e números mistos
    ['2 1/2 cups', [2.5, null, 'cup', '']],
    ['2-1/2 cups', [2.5, null, 'cup', '']],
    ['1 and 1/8 cup', [1.125, null, 'cup', '']],
    ['3/4 teaspoon', [0.75, null, 'tsp', '']],
    // Frações unicode, sozinhas e junto de inteiros
    ['¼ cup', [0.25, null, 'cup', '']],
    ['1½ tbsp', [1.5, null, 'tbsp', '']],
    ['1 ½ teaspoons', [1.5, null, 'tsp', '']],
    ['1-⅓ cups', [1 + 1 / 3, null, 'cup', '']],
    ['½', [0.5, null, null, '']],
    // Unidade colada e sinônimos
    ['1.5kg', [1.5, null, 'kg', '']],
    ['1tbsp', [1, null, 'tbsp', '']],
    ['1.5L', [1.5, null, 'l', '']],
    ['10 tblsp', [10, null, 'tbsp', '']],
    ['2 1/2 Tbs', [2.5, null, 'tbsp', '']],
    ['100 Grams', [100, null, 'g', '']],
    ['2 Lbs', [2, null, 'lb', '']],
    ['4 qt', [4, null, 'quart', '']],
    ['8-ounce sliced', [8, null, 'oz', 'sliced']],
    // Faixas
    ['1-2tbsp', [1, 2, 'tbsp', '']],
    ['2-3 tbsp', [2, 3, 'tbsp', '']],
    ['4 - 6', [4, 6, null, '']],
    ['2 to 3 cups', [2, 3, 'cup', '']],
    ['4-5 pound', [4, 5, 'lb', '']],
    // Equivalências que não podem ser escaladas junto: saem do texto
    ['125g/4½oz', [125, null, 'g', '']],
    ['650g/1lb 8 oz', [650, null, 'g', '']],
    ['50ml/2fl oz', [50, null, 'ml', '']],
    ['6oz/180g', [6, null, 'oz', '']],
    ['12 ounces (340g)', [12, null, 'oz', '']],
    ['1 1/2 cups (360 milliliters)', [1.5, null, 'cup', '']],
    // Texto depois da medida é mantido
    ['1 litre hot', [1, null, 'l', 'hot']],
    ['½ tsp dissolved in ½ cup warm milk', [0.5, null, 'tsp', 'dissolved in ½ cup warm milk']],
    ['2 quarts neutral frying', [2, null, 'quart', 'neutral frying']],
    ['1 (12 oz.)', [1, null, null, '(12 oz.)']],
    ['2 x 400g tins', [2, null, null, 'x 400g tins']],
    ['1 Large Chopped', [1, null, null, 'Large Chopped']],
    ['1 Leaf', [1, null, null, 'Leaf']],
    ['1 – 14-ounce can', [1, null, null, '14-ounce can']],
    // Sem número no começo: texto original
    ['Juice of 1', [null, null, null, 'Juice of 1']],
    ['2cm piece', [null, null, null, '2cm piece']],
    ['3rd', [null, null, null, '3rd']],
    ['', [null, null, null, '']],
  ])('%s', (input, [quantity, quantityMax, unit, rest]) => {
    const parsed = parseMeasure(input);

    if (quantity === null) expect(parsed.quantity).toBeNull();
    else expect(parsed.quantity).toBeCloseTo(quantity);
    expect(parsed.quantityMax).toBe(quantityMax);
    expect(parsed.unit).toBe(unit);
    expect(parsed.rest).toBe(rest);
    expect(parsed.original).toBe(input);
  });

  it('junta espaços repetidos', () => {
    expect(parseMeasure('3  tablespoons')).toMatchObject({ quantity: 3, unit: 'tbsp' });
    expect(parseMeasure('1  bunch')).toMatchObject({ quantity: 1, rest: 'bunch' });
  });

  it('entende todas as medidas reais da TheMealDB sem lançar erro nem gerar NaN', () => {
    const results = fixtures.measures.map((measure) => parseMeasure(measure));

    for (const result of results) {
      expect(Number.isNaN(result.quantity)).toBe(false);
      expect(Number.isNaN(result.quantityMax)).toBe(false);
    }

    const recognized = results.filter((result) => result.quantity !== null).length;
    const percentage = Math.round((recognized / results.length) * 100);
    // Registro da cobertura do parser sobre dados reais; o resto fica como texto.
    console.info(`parseMeasure reconheceu ${recognized} de ${results.length} medidas reais (${percentage}%)`);
    expect(percentage).toBeGreaterThanOrEqual(80);
  });
});
