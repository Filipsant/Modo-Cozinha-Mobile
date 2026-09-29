import { MEASURE_PHRASES, MEASURE_WORDS } from '../model/measureWords';

/** Palavra com pontuação em volta: "(chopped)," → ["(", "chopped", "),"]. */
const WORD_WITH_PUNCTUATION = /^([^\p{L}]*)([\p{L}-]+)([^\p{L}]*)$/u;

/**
 * Traduz o texto de uma medida pelo dicionário: primeiro a expressão inteira ("to taste" → "a gosto"),
 * depois palavra por palavra, se todas forem conhecidas ("large chopped" → "grande picado").
 * Devolve null quando não sabe: aí o texto vai para o tradutor automático.
 */
export function translateMeasureText(text: string): string | null {
  const normalized = text.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!normalized) return '';

  const phrase = MEASURE_PHRASES[normalized];
  if (phrase) return phrase;

  const translated: string[] = [];
  for (const token of normalized.split(' ')) {
    const match = token.match(WORD_WITH_PUNCTUATION);
    const word = match ? MEASURE_WORDS[match[2] ?? ''] : undefined;
    if (!match || !word) return null;
    translated.push(`${match[1]}${word}${match[3]}`);
  }
  return translated.join(' ');
}
