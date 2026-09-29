import { fixtures } from '@/shared/testing';

import { parseMeasure } from './parseMeasure';
import { serializeMeasure } from './serializeMeasure';
import { translateMeasureText } from './translateMeasureText';

describe('translateMeasureText', () => {
  it.each([
    ['to taste', 'a gosto'],
    ['To Taste', 'a gosto'],
    ['cloves', 'dentes'],
    ['cloves chopped', 'dentes picados'],
    ['finely chopped', 'bem picado'],
    ['large', 'grande'],
    ['large chopped', 'grande picado'],
    ['Juice of 1', 'suco de 1'],
    ['clove, peeled and crushed', 'dente descascado e amassado'],
    ['(chopped)', '(picado)'],
    ['', ''],
  ])('%s → %s', (text, expected) => {
    expect(translateMeasureText(text)).toBe(expected);
  });

  it('devolve null quando não conhece todas as palavras (vai para o tradutor automático)', () => {
    expect(translateMeasureText('chopped into ½-inch pieces')).toBeNull();
    expect(translateMeasureText('reserve any fronds to garnish')).toBeNull();
  });
});

describe('serializeMeasure', () => {
  it.each([
    ['1/2 cup', '0.5 cup'],
    ['1-2 cloves', '1-2 cloves'],
    ['125g/4½oz', '125 g'],
    ['1 (12 oz.)', '1 (12 oz.)'],
    ['to taste', 'to taste'],
  ])('%s → %s', (measure, expected) => {
    expect(serializeMeasure(parseMeasure(measure))).toBe(expected);
  });

  it('troca só o resto: "2 cloves" com o resto traduzido vira "2 dentes"', () => {
    expect(serializeMeasure({ ...parseMeasure('2 cloves'), rest: 'dentes' })).toBe('2 dentes');
  });

  it('o parser lê de volta todas as medidas reais sem perder número, faixa ou unidade', () => {
    for (const measure of fixtures.measures) {
      const parsed = parseMeasure(measure);
      const again = parseMeasure(serializeMeasure(parsed));

      expect({ measure, quantity: again.quantity, max: again.quantityMax, unit: again.unit }).toEqual({
        measure,
        quantity: parsed.quantity === null ? null : expect.closeTo(parsed.quantity, 3),
        max: parsed.quantityMax === null ? null : expect.closeTo(parsed.quantityMax, 3),
        unit: parsed.unit,
      });
    }
  });
});
