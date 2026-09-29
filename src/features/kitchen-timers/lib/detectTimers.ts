export interface DetectedTimer {
  /** O trecho encontrado, como está na receita: "10 minutos", "30-40 mins". */
  text: string;
  /** Duração em segundos (numa faixa, o começo: melhor conferir antes do que queimar). */
  seconds: number;
  /** Fim da faixa em segundos, ou null. */
  secondsMax: number | null;
}

/** Números por extenso em português (receitas traduzidas) e inglês (quando a tradução falha). */
const WORD_NUMBERS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  três: 3,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  quinze: 15,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  sessenta: 60,
  an: 1,
  a: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  fifteen: 15,
  twenty: 20,
  thirty: 30,
  forty: 40,
  sixty: 60,
};

const NUMBER = `(?:\\d+(?:[.,]\\d+)?|${Object.keys(WORD_NUMBERS).join('|')})`;
/** "25 a 30", "entre 25 e 30", "30-40", "25 to 30". */
const RANGE = `(?:\\s*(?:-|–|\\bto\\b|\\ba\\b|\\be\\b)\\s*(\\d+(?:[.,]\\d+)?))?`;
const UNIT = '(horas?|hours?|hrs?|minutos?|minutes?|mins?|min|segundos?|seconds?|segs?|secs?|seg|sec)';
/** "uma hora e meia", "1 hour and a half". */
const AND_A_HALF = '(\\s+(?:e meia|and a half))?';
const HALF_HOUR = 'meia[\\s-]hora|half an? hour';

const DURATION = new RegExp(`\\b(?:${HALF_HOUR}|(${NUMBER})${RANGE}\\s*${UNIT}${AND_A_HALF})\\b`, 'gi');

function toNumber(value: string): number {
  return WORD_NUMBERS[value.toLowerCase()] ?? Number(value.replace(',', '.'));
}

function unitSeconds(unit: string): number {
  const lower = unit.toLowerCase();
  if (lower.startsWith('h')) return 3600;
  if (lower.startsWith('m')) return 60;
  return 1;
}

/**
 * Encontra tempos no texto de um passo para virar botões de timer (RF16).
 * "Asse por 35 minutos" → [{ text: '35 minutos', seconds: 2100 }].
 */
export function detectTimers(step: string): DetectedTimer[] {
  const timers: DetectedTimer[] = [];

  for (const match of step.matchAll(DURATION)) {
    const [text, amount, amountMax, unit, andAHalf] = match;

    if (!amount || !unit) {
      timers.push({ text, seconds: 30 * 60, secondsMax: null }); // "meia hora"
      continue;
    }

    const multiplier = unitSeconds(unit);
    const half = andAHalf ? 0.5 : 0;
    const seconds = Math.round((toNumber(amount) + half) * multiplier);
    const secondsMax = amountMax ? Math.round((toNumber(amountMax) + half) * multiplier) : null;

    if (seconds > 0 && !timers.some((timer) => timer.seconds === seconds)) {
      timers.push({ text, seconds, secondsMax: secondsMax && secondsMax > seconds ? secondsMax : null });
    }
  }

  return timers;
}
