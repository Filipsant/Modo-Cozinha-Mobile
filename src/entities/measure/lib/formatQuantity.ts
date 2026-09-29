/** Frações que aparecem em receitas, com a tolerância para 0,33 → ⅓ e 0,67 → ⅔. */
const FRIENDLY_FRACTIONS: [value: number, symbol: string][] = [
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [1 / 2, '½'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
];
const TOLERANCE = 0.02;

/** Número com vírgula e no máximo `maxDecimals` casas: 1.25 → "1,3"; 2.0 → "2". */
export function formatDecimal(value: number, maxDecimals = 1): string {
  const power = 10 ** maxDecimals;
  const rounded = Math.round(value * power) / power;
  return String(rounded).replace('.', ',');
}

/**
 * Quantidade amigável para medidas caseiras: 0,5 → "½", 1,5 → "1½", 0,33 → "⅓".
 * Quando não é uma fração conhecida, usa no máximo uma casa decimal.
 */
export function formatQuantity(value: number): string {
  const whole = Math.floor(value);
  const fraction = value - whole;

  if (fraction < TOLERANCE) return String(whole);
  if (fraction > 1 - TOLERANCE) return String(whole + 1);

  const friendly = FRIENDLY_FRACTIONS.find(
    ([fractionValue]) => Math.abs(fraction - fractionValue) < TOLERANCE,
  );
  if (friendly) return whole === 0 ? friendly[1] : `${whole}${friendly[1]}`;

  return formatDecimal(value);
}
