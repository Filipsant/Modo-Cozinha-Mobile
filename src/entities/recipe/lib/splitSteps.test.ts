import { fixtures } from '@/shared/testing';

import { splitSteps } from './splitSteps';

const instructionsOf = (response: { meals: { strInstructions: string }[] }) =>
  response.meals[0]?.strInstructions ?? '';

describe('splitSteps', () => {
  it('divide por quebra de linha (receita real com \\r\\n)', () => {
    const steps = splitSteps(instructionsOf(fixtures.lookupWithVideo));

    expect(steps).toHaveLength(6);
    expect(steps[0]).toBe('Preheat oven to 350° F. Spray a 9x13-inch baking pan with non-stick spray.');
    // O asterisco no começo da linha sai.
    expect(steps[4]).toBe('Meanwhile, steam or cook the vegetables according to package directions.');
  });

  it('remove as linhas "step 1", "step 2" e as linhas vazias', () => {
    const steps = splitSteps(instructionsOf(fixtures.lookupNoVideo));

    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatch(/^Place the prawns in a bowl/);
    expect(steps.some((step) => /^step \d/i.test(step))).toBe(false);
  });

  it('divide por frase quando vem um bloco único', () => {
    const steps = splitSteps(instructionsOf(fixtures.lookupSingleBlock));

    expect(steps).toHaveLength(6);
    expect(steps[0]).toBe('Fry the finely chopped onions and minced meat in oil.');
    expect(steps[5]).toMatch(/^When you have five or six layers.*serve\.$/);
  });

  it('não quebra números decimais nem temperaturas', () => {
    expect(splitSteps('Add 1.5 cups of milk. Bake at 200ºC/392ºF for 30 mins.')).toEqual([
      'Add 1.5 cups of milk.',
      'Bake at 200ºC/392ºF for 30 mins.',
    ]);
  });

  it('tira os prefixos "STEP 1:" e "1." do começo das linhas', () => {
    expect(splitSteps('STEP 1: Heat the oil.\nSTEP 2 - Add the onion.\n3. Stir well.')).toEqual([
      'Heat the oil.',
      'Add the onion.',
      'Stir well.',
    ]);
  });

  it('devolve uma lista vazia sem instruções', () => {
    expect(splitSteps('')).toEqual([]);
    expect(splitSteps('  \r\n  ')).toEqual([]);
  });
});
