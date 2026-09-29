import { BASE_SERVINGS, MAX_SERVINGS, MIN_SERVINGS } from '@/shared/config';
import { clamp } from '@/shared/lib';

/**
 * Porções vindas do endereço (?porcoes=6). Texto inválido volta para a receita base (4);
 * números fora do limite ficam entre 1 e 20.
 */
export function parseServings(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (Number.isNaN(parsed)) return BASE_SERVINGS;
  return clamp(parsed, MIN_SERVINGS, MAX_SERVINGS);
}
