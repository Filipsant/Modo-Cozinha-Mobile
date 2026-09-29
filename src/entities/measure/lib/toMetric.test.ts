import { parseMeasure } from './parseMeasure';
import { scaleMeasure, servingsFactor } from './scaleMeasure';
import { roundMetric, toBaseMetric, toMetric } from './toMetric';

describe('servingsFactor e scaleMeasure', () => {
  it('calcula o fator a partir da receita base de 4 porções', () => {
    expect(servingsFactor(10, 4)).toBe(2.5);
    expect(servingsFactor(1, 4)).toBe(0.25);
  });

  it('aplica o fator também no fim da faixa', () => {
    expect(scaleMeasure(parseMeasure('1-2 cloves'), 2)).toMatchObject({ quantity: 2, quantityMax: 4 });
  });

  it('não mexe em medidas sem número', () => {
    const toTaste = parseMeasure('to taste');

    expect(scaleMeasure(toTaste, 3)).toBe(toTaste);
  });
});

describe('roundMetric', () => {
  it.each([
    [453.592, 455],
    [22, 20],
    [2.5, 2.5],
    [1.25, 1.3],
  ])('%d → %d', (value, expected) => {
    expect(roundMetric(value)).toBe(expected);
  });
});

describe('toMetric', () => {
  it('converte peso para gramas e volume para mililitros', () => {
    expect(toMetric(parseMeasure('2 oz'))).toMatchObject({ quantity: 55, unit: 'g' });
    expect(toMetric(parseMeasure('1 cup'))).toMatchObject({ quantity: 240, unit: 'ml' });
    expect(toMetric(parseMeasure('2 fl oz'))).toMatchObject({ quantity: 60, unit: 'ml' });
  });

  it('mantém unidades métricas e medidas sem unidade', () => {
    const grams = parseMeasure('200g');
    const eggs = parseMeasure('3 large');

    expect(toMetric(grams)).toBe(grams);
    expect(toMetric(eggs)).toBe(eggs);
  });
});

describe('toBaseMetric', () => {
  it('leva kg, L e unidades imperiais para g ou ml, sem arredondar', () => {
    expect(toBaseMetric(parseMeasure('1.5 kg'))).toMatchObject({ quantity: 1500, unit: 'g' });
    expect(toBaseMetric(parseMeasure('1 L'))).toMatchObject({ quantity: 1000, unit: 'ml' });
    expect(toBaseMetric(parseMeasure('4 tbsp'))).toMatchObject({ quantity: 60, unit: 'ml' });
    expect(toBaseMetric(parseMeasure('1 oz'))).toMatchObject({ quantity: 28.3495, unit: 'g' });
  });
});
