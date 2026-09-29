/** Unidades de medida que o app entende. Todo o resto ("large", "cloves") fica no texto. */
export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'cup' | 'tbsp' | 'tsp' | 'oz' | 'lb' | 'floz' | 'pint' | 'quart';

/** Como as receitas escrevem cada unidade, em minúsculas e sem ponto (tablespoons, Tbs, tbsp → tbsp). */
export const UNIT_SYNONYMS: Record<string, Unit> = {
  g: 'g',
  gr: 'g',
  gram: 'g',
  grams: 'g',
  gramme: 'g',
  grammes: 'g',
  kg: 'kg',
  kgs: 'kg',
  kilo: 'kg',
  kilos: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  ml: 'ml',
  milliliter: 'ml',
  milliliters: 'ml',
  millilitre: 'ml',
  millilitres: 'ml',
  l: 'l',
  liter: 'l',
  liters: 'l',
  litre: 'l',
  litres: 'l',
  cup: 'cup',
  cups: 'cup',
  tbsp: 'tbsp',
  tbsps: 'tbsp',
  tbs: 'tbsp',
  tbls: 'tbsp',
  tblsp: 'tbsp',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  tsp: 'tsp',
  tsps: 'tsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  oz: 'oz',
  ounce: 'oz',
  ounces: 'oz',
  lb: 'lb',
  lbs: 'lb',
  pound: 'lb',
  pounds: 'lb',
  floz: 'floz',
  pint: 'pint',
  pints: 'pint',
  quart: 'quart',
  quarts: 'quart',
  qt: 'quart',
};

/** Unidades imperiais e a conversão para o sistema métrico (volume vira ml: veja o ADR 006). */
export const METRIC_CONVERSIONS: Partial<Record<Unit, { unit: 'g' | 'ml'; factor: number }>> = {
  oz: { unit: 'g', factor: 28.3495 },
  lb: { unit: 'g', factor: 453.592 },
  cup: { unit: 'ml', factor: 240 },
  tbsp: { unit: 'ml', factor: 15 },
  tsp: { unit: 'ml', factor: 5 },
  floz: { unit: 'ml', factor: 29.5735 },
  pint: { unit: 'ml', factor: 473.176 },
  quart: { unit: 'ml', factor: 946.353 },
};

/** Unidades já métricas: mostradas com decimais, nunca com frações. */
export const METRIC_UNITS: ReadonlySet<Unit> = new Set<Unit>(['g', 'kg', 'ml', 'l']);

/** Tradução das unidades para a interface (RF14), no singular e no plural. */
export const UNIT_LABELS: Record<Unit, { singular: string; plural: string }> = {
  g: { singular: 'g', plural: 'g' },
  kg: { singular: 'kg', plural: 'kg' },
  ml: { singular: 'ml', plural: 'ml' },
  l: { singular: 'L', plural: 'L' },
  cup: { singular: 'xícara', plural: 'xícaras' },
  tbsp: { singular: 'colher de sopa', plural: 'colheres de sopa' },
  tsp: { singular: 'colher de chá', plural: 'colheres de chá' },
  oz: { singular: 'oz', plural: 'oz' },
  lb: { singular: 'lb', plural: 'lb' },
  floz: { singular: 'fl oz', plural: 'fl oz' },
  pint: { singular: 'pint', plural: 'pints' },
  quart: { singular: 'quart', plural: 'quarts' },
};
