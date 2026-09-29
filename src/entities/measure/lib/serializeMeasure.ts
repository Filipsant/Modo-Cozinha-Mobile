import type { ParsedMeasure } from '../model/measure.types';

const toText = (value: number) => String(Math.round(value * 10000) / 10000);

/**
 * O caminho inverso do parser: volta a medida para texto que o parseMeasure entende de novo.
 * Usado na tradução: número e unidade ficam como a API manda ("2 tbsp"), só o resto muda de idioma
 * ("2 cloves" → "2 dentes"). Assim porções, conversão e soma na lista continuam funcionando.
 */
export function serializeMeasure({ quantity, quantityMax, unit, rest }: ParsedMeasure): string {
  if (quantity === null) return rest;

  const amount = quantityMax === null ? toText(quantity) : `${toText(quantity)}-${toText(quantityMax)}`;
  return [amount, unit, rest].filter(Boolean).join(' ');
}
