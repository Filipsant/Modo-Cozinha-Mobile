import { fixtures } from '@/shared/testing';

import { formatMeasure, translateUnit } from './formatMeasure';

describe('formatMeasure', () => {
  // Tabela da Etapa 4 do roadmap: de 4 para 8 porções.
  it.each([
    ['1/2 cup', '1 xícara'],
    ['1 1/2 tbsp', '3 colheres de sopa'],
    ['200g', '400 g'],
    ['½ tsp', '1 colher de chá'],
    ['1-2 cloves', '2 a 4 cloves'],
    ['3 large', '6 large'],
    ['to taste', 'to taste'],
  ])('%s para 8 porções → %s', (measure, expected) => {
    expect(formatMeasure(measure, { factor: 2 })).toBe(expected);
  });

  it.each([
    ['1/2 cup', '120 ml'],
    ['1 tbsp', '15 ml'],
    ['½ tsp', '2,5 ml'],
    ['1 lb', '455 g'],
    ['8 oz', '225 g'],
    ['200g', '200 g'],
    ['2-3 tbsp', '30 a 45 ml'],
    ['3 large', '3 large'],
  ])('%s em medidas métricas → %s', (measure, expected) => {
    expect(formatMeasure(measure, { system: 'metric' })).toBe(expected);
  });

  it('mantém a receita base com fator 1 e só traduz a unidade', () => {
    expect(formatMeasure('3/4 cup')).toBe('¾ xícara');
    expect(formatMeasure('2 cups')).toBe('2 xícaras');
  });

  it('mostra kg e L com até duas casas decimais', () => {
    expect(formatMeasure('1 kg', { factor: 1.25 })).toBe('1,25 kg');
    expect(formatMeasure('1.5L', { factor: 0.5 })).toBe('0,75 L');
  });

  it('mudar de 4 para 10 porções recalcula as frações', () => {
    expect(formatMeasure('1/2 cup', { factor: 10 / 4 })).toBe('1¼ xícara');
    expect(formatMeasure('1 tsp', { factor: 10 / 4 })).toBe('2½ colheres de chá');
  });

  it('nenhuma medida real some ou vira NaN, em qualquer sistema', () => {
    for (const measure of fixtures.measures) {
      for (const options of [{ factor: 2.5 }, { factor: 0.25, system: 'metric' as const }]) {
        const formatted = formatMeasure(measure, options);

        expect(formatted).not.toMatch(/NaN|undefined|Infinity/);
        expect(formatted.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('translateUnit', () => {
  it.each([
    ['cup', 1, 'xícara'],
    ['cup', 2, 'xícaras'],
    ['tbsp', 1, 'colher de sopa'],
    ['tbsp', 2, 'colheres de sopa'],
    ['tsp', 0.5, 'colher de chá'],
    ['tsp', 3, 'colheres de chá'],
    ['l', 2, 'L'],
  ] as const)('%s com %d → %s', (unit, quantity, expected) => {
    expect(translateUnit(unit, quantity)).toBe(expected);
  });
});
