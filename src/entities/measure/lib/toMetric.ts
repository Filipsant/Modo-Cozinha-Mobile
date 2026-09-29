import type { ParsedMeasure } from '../model/measure.types';
import { METRIC_CONVERSIONS } from '../model/units';

/** Arredondamento prático: múltiplos de 5 acima de 20 g ou ml; abaixo, uma casa decimal. */
export function roundMetric(value: number): number {
  if (value > 20) return Math.round(value / 5) * 5;
  return Math.round(value * 10) / 10;
}

/**
 * oz e lb viram gramas; cup, tbsp, tsp, fl oz, pint e quart viram mililitros.
 * Xícaras não viram gramas, porque isso depende da densidade de cada ingrediente (ADR 007).
 */
export function toMetric(measure: ParsedMeasure): ParsedMeasure {
  const conversion = measure.unit ? METRIC_CONVERSIONS[measure.unit] : undefined;
  if (!conversion || measure.quantity === null) return measure;

  return {
    ...measure,
    unit: conversion.unit,
    quantity: roundMetric(measure.quantity * conversion.factor),
    quantityMax: measure.quantityMax === null ? null : roundMetric(measure.quantityMax * conversion.factor),
  };
}

/**
 * Para somar na lista de compras: tudo o que é peso ou volume vira g ou ml, inclusive kg e L.
 * Sem arredondar, para a soma não acumular erro (ADR 008).
 */
export function toBaseMetric(measure: ParsedMeasure): ParsedMeasure {
  if (measure.quantity === null || !measure.unit) return measure;

  const multiply = (factor: number, unit: 'g' | 'ml'): ParsedMeasure => ({
    ...measure,
    unit,
    quantity: (measure.quantity ?? 0) * factor,
    quantityMax: measure.quantityMax === null ? null : measure.quantityMax * factor,
  });

  if (measure.unit === 'kg') return multiply(1000, 'g');
  if (measure.unit === 'l') return multiply(1000, 'ml');

  const conversion = METRIC_CONVERSIONS[measure.unit];
  return conversion ? multiply(conversion.factor, conversion.unit) : measure;
}
