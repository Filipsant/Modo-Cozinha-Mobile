import type { ParsedMeasure } from '../model/measure.types';

/** Fator das porções: a receita base rende `baseServings` (4); para 10 porções, o fator é 2,5. */
export function servingsFactor(servings: number, baseServings: number): number {
  return servings / baseServings;
}

/** Multiplica a quantidade (e o fim da faixa) pelo fator. Medida sem número não muda. */
export function scaleMeasure(measure: ParsedMeasure, factor: number): ParsedMeasure {
  if (measure.quantity === null) return measure;

  return {
    ...measure,
    quantity: measure.quantity * factor,
    quantityMax: measure.quantityMax === null ? null : measure.quantityMax * factor,
  };
}
