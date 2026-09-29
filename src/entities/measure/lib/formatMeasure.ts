import type { ParsedMeasure, UnitSystem } from '../model/measure.types';
import { METRIC_UNITS, UNIT_LABELS, type Unit } from '../model/units';
import { formatDecimal, formatQuantity } from './formatQuantity';
import { parseMeasure } from './parseMeasure';
import { scaleMeasure } from './scaleMeasure';
import { toMetric } from './toMetric';

/** "cup" → "xícara" ou "xícaras". Plural a partir de 2, como se fala na cozinha ("1½ xícara"). */
export function translateUnit(unit: Unit, quantity: number): string {
  const label = UNIT_LABELS[unit];
  return quantity >= 2 ? label.plural : label.singular;
}

export interface FormatMeasureOptions {
  /** Fator das porções (1 = receita base). */
  factor?: number;
  system?: UnitSystem;
}

/**
 * A medida pronta para mostrar: escalada, convertida (se pedir) e traduzida.
 * "1/2 cup" com fator 2 → "1 xícara"; com sistema métrico → "240 ml". "to taste" continua "to taste".
 */
export function formatMeasure(
  input: string | ParsedMeasure,
  { factor = 1, system = 'original' }: FormatMeasureOptions = {},
): string {
  const parsed = typeof input === 'string' ? parseMeasure(input) : input;
  if (parsed.quantity === null) return parsed.original.trim().replace(/\s+/g, ' ');

  const scaled = scaleMeasure(parsed, factor);
  const measure = system === 'metric' ? toMetric(scaled) : scaled;
  const quantity = measure.quantity ?? 0;

  const isMetric = measure.unit !== null && METRIC_UNITS.has(measure.unit);
  const decimals = measure.unit === 'kg' || measure.unit === 'l' ? 2 : 1;
  const format = (value: number) => (isMetric ? formatDecimal(value, decimals) : formatQuantity(value));

  const amount =
    measure.quantityMax === null ? format(quantity) : `${format(quantity)} a ${format(measure.quantityMax)}`;
  const unit = measure.unit ? translateUnit(measure.unit, measure.quantityMax ?? quantity) : '';

  return [amount, unit, measure.rest].filter(Boolean).join(' ');
}
