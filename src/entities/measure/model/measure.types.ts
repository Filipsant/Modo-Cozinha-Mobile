import type { Unit } from './units';

/** Resultado do parser: "1-2 cloves" → { quantity: 1, quantityMax: 2, unit: null, rest: 'cloves' }. */
export interface ParsedMeasure {
  /** 0.5 em "1/2 cup"; null em "to taste". */
  quantity: number | null;
  /** 2 em "1-2 cloves"; null quando não é uma faixa. */
  quantityMax: number | null;
  unit: Unit | null;
  /** O que sobra depois do número e da unidade: "large", "chopped", "to taste". */
  rest: string;
  /** O texto original nunca se perde. */
  original: string;
}

/** original: medidas como vieram, só com as unidades traduzidas · metric: gramas e mililitros. */
export type UnitSystem = 'original' | 'metric';
