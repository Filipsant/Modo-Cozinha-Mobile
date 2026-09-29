/** Mantém um número dentro de um intervalo: clamp(25, 1, 20) → 20. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
