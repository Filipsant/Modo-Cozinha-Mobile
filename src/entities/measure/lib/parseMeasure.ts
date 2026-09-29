import type { ParsedMeasure } from '../model/measure.types';
import { UNIT_SYNONYMS, type Unit } from '../model/units';

const UNICODE_FRACTIONS: Record<string, number> = {
  '¼': 1 / 4,
  '½': 1 / 2,
  '¾': 3 / 4,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅕': 1 / 5,
  '⅛': 1 / 8,
  '⅜': 3 / 8,
  '⅝': 5 / 8,
  '⅞': 7 / 8,
};
const FRACTION_CHARS = Object.keys(UNICODE_FRACTIONS).join('');

/** Formatos de número, do mais específico para o mais simples. Todos ancorados no começo do texto. */
const NUMBER_PATTERNS: { pattern: RegExp; read: (match: RegExpMatchArray) => number }[] = [
  // Número misto: "1 1/2", "2-1/2", "1 and 1/8"
  {
    pattern: /^(\d+)(?:\s+and\s+|\s*-\s*|\s+)(\d+)\/(\d+)/,
    read: (m) => Number(m[1]) + Number(m[2]) / Number(m[3]),
  },
  // Inteiro + fração unicode: "1½", "1 ½", "1-½"
  {
    pattern: new RegExp(`^(\\d+)\\s*-?\\s*([${FRACTION_CHARS}])`),
    read: (m) => Number(m[1]) + (UNICODE_FRACTIONS[m[2] ?? ''] ?? 0),
  },
  // Fração: "1/2"
  { pattern: /^(\d+)\/(\d+)/, read: (m) => Number(m[1]) / Number(m[2]) },
  // Fração unicode sozinha: "½"
  { pattern: new RegExp(`^([${FRACTION_CHARS}])`), read: (m) => UNICODE_FRACTIONS[m[1] ?? ''] ?? 0 },
  // Inteiro ou decimal com ponto ou vírgula: "2", "0.25", "1,5"
  { pattern: /^(\d+(?:[.,]\d+)?)/, read: (m) => Number((m[1] ?? '').replace(',', '.')) },
];

/** Separador de faixa: "1-2", "4 - 6", "2 to 3". */
const RANGE_SEPARATOR = /^\s*(?:-|–|to)\s*/;
/** Palavra que pode ser uma unidade, colada ("200g"), com hífen ("8-ounce") ou depois de espaço. */
const UNIT_WORD = /^(?:\s*|-)(fl\.?\s*oz|[a-zA-Z]+)\.?(?![a-zA-Z])/;
/** Equivalência em outra unidade depois de uma barra: "/4½oz", "/1lb 8 oz", "/2fl oz", "/180g". */
const SLASH_EQUIVALENT = new RegExp(
  `^\\/\\s*[\\d${FRACTION_CHARS}.,]+\\s*(?:(?:fl\\s*)?oz|lbs?|fl|g|kg|ml)\\b\\.?(?:\\s*[\\d${FRACTION_CHARS}.,]+\\s*(?:oz|lbs?)\\b\\.?)?`,
  'i',
);
/** Equivalência entre parênteses: "(340g)", "(360 milliliters)", "(55 grams)". */
const PARENTHESIS_EQUIVALENT =
  /^\(\s*[\d.,]+\s*(?:g|grams?|ml|milliliters?|millilitres?|oz\.?|ounces?)\s*\)/i;

function readNumber(text: string): { value: number; length: number } | null {
  for (const { pattern, read } of NUMBER_PATTERNS) {
    const match = text.match(pattern);
    if (match) return { value: read(match), length: match[0].length };
  }
  return null;
}

function textOnly(text: string, original: string): ParsedMeasure {
  return { quantity: null, quantityMax: null, unit: null, rest: text, original };
}

/**
 * Transforma a medida em texto livre da TheMealDB em número, unidade e resto.
 * Quando não há número no começo ("to taste", "Juice of 1"), devolve o texto como veio.
 */
export function parseMeasure(input: string): ParsedMeasure {
  const text = input.trim().replace(/\s+/g, ' ');
  const first = readNumber(text);
  if (!first) return textOnly(text, input);

  let cursor = first.length;
  let quantityMax: number | null = null;

  const separator = text.slice(cursor).match(RANGE_SEPARATOR);
  if (separator) {
    const afterSeparator = text.slice(cursor + separator[0].length);
    const second = readNumber(afterSeparator);
    // "1 – 14-ounce can" não é uma faixa: o 14 faz parte de "14-ounce".
    const isHyphenatedWord = second ? afterSeparator.charAt(second.length) === '-' : false;
    if (second && second.value > first.value && !isHyphenatedWord) {
      quantityMax = second.value;
      cursor += separator[0].length + second.length;
    }
  }

  let rest = text.slice(cursor);
  const isGlued = /^[a-zA-Z]/.test(rest);
  let unit: Unit | null = null;

  const unitWord = rest.match(UNIT_WORD);
  if (unitWord) {
    unit = UNIT_SYNONYMS[(unitWord[1] ?? '').toLowerCase().replace(/[.\s]/g, '')] ?? null;
    if (unit) rest = rest.slice(unitWord[0].length);
  }

  // Letras coladas no número que não são unidade ("3rd", "2cm piece"): melhor não mexer.
  if (isGlued && !unit) return textOnly(text, input);

  rest = rest.trim();
  if (unit) {
    rest = rest.replace(SLASH_EQUIVALENT, '').trim().replace(PARENTHESIS_EQUIVALENT, '').trim();
  }
  rest = rest.replace(/^[,;–-]\s*/, '');

  return { quantity: first.value, quantityMax, unit, rest, original: input };
}
