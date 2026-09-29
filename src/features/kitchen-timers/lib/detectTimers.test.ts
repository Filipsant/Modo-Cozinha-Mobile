import { detectTimers } from './detectTimers';
import { describeRemaining, formatCountdown, formatDuration } from './formatDuration';

describe('detectTimers', () => {
  it.each([
    ['Place chicken in oven and bake 35 minutes.', [['35 minutes', 2100, null]]],
    ['Chill for 1 hr.', [['1 hr', 3600, null]]],
    ['Fry for 5 mins, then add the pepper.', [['5 mins', 300, null]]],
    ['Leave for 30-40 mins until doubled.', [['30-40 mins', 1800, 2400]]],
    ['Bake for 25 to 30 minutes.', [['25 to 30 minutes', 1500, 1800]]],
    ['Stir for 45 secs.', [['45 secs', 45, null]]],
    ['Cook for one minute once boiling.', [['one minute', 60, null]]],
    ['Bake at 200ºC/392ºF for half an hour.', [['half an hour', 1800, null]]],
    [
      'Knead for 10 minutes, rest 1 hour and bake 1.5 hours.',
      [
        ['10 minutes', 600, null],
        ['1 hour', 3600, null],
        ['1.5 hours', 5400, null],
      ],
    ],
  ])('%s', (step, expected) => {
    expect(detectTimers(step).map((timer) => [timer.text, timer.seconds, timer.secondsMax])).toEqual(
      expected,
    );
  });

  it.each([
    ['Leve ao forno e asse por 35 minutos.', [['35 minutos', 2100, null]]],
    ['Leve à geladeira por 1 hora.', [['1 hora', 3600, null]]],
    ['Cozinhe por um minuto depois de ferver.', [['um minuto', 60, null]]],
    ['Asse de 25 a 30 minutos.', [['25 a 30 minutos', 1500, 1800]]],
    ['Deixe crescer entre 40 e 50 minutos.', [['40 e 50 minutos', 2400, 3000]]],
    ['Deixe crescer por 30-40 min até dobrar.', [['30-40 min', 1800, 2400]]],
    ['Mexa por 45 segundos.', [['45 segundos', 45, null]]],
    ['Asse por meia hora.', [['meia hora', 1800, null]]],
    ['Cozinhe por uma hora e meia.', [['uma hora e meia', 5400, null]]],
    ['Descanse duas horas.', [['duas horas', 7200, null]]],
  ])('em português: %s', (step, expected) => {
    expect(detectTimers(step).map((timer) => [timer.text, timer.seconds, timer.secondsMax])).toEqual(
      expected,
    );
  });

  it('não confunde temperaturas, medidas ou números soltos com tempo', () => {
    expect(detectTimers('Preheat oven to 350° F. Use a 20cm tin and 2 minced cloves.')).toEqual([]);
    expect(detectTimers('Aqueça o forno a 180 graus e use 2 dentes de alho.')).toEqual([]);
  });

  it('não repete o mesmo tempo no mesmo passo', () => {
    expect(detectTimers('Cook 5 minutes, stir, then cook 5 minutes more.')).toHaveLength(1);
  });
});

describe('formatDuration', () => {
  it.each([
    [45, '45 s'],
    [600, '10 min'],
    [630, '10 min 30 s'],
    [3600, '1 h'],
    [5400, '1 h 30 min'],
  ])('%d s → %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });
});

describe('formatCountdown', () => {
  it.each([
    [599_000, '09:59'],
    [599_001, '10:00'],
    [3_905_000, '1:05:05'],
    [-5, '00:00'],
  ])('%d ms → %s', (milliseconds, expected) => {
    expect(formatCountdown(milliseconds)).toBe(expected);
  });
});

describe('describeRemaining', () => {
  it('descreve o tempo para o leitor de tela', () => {
    expect(describeRemaining(599_000)).toBe('9 minutos e 59 segundos restantes');
    expect(describeRemaining(60_000)).toBe('1 minuto restante');
    expect(describeRemaining(1_000)).toBe('1 segundo restante');
    expect(describeRemaining(0)).toBe('0 segundos restantes');
  });
});
