import { useLocalSearchParams, useRouter } from 'expo-router';

import { servingsFactor } from '@/entities/measure';
import { BASE_SERVINGS, MAX_SERVINGS, MIN_SERVINGS } from '@/shared/config';
import { clamp } from '@/shared/lib';

import { parseServings } from '../lib/parseServings';

export interface ServingsState {
  servings: number;
  /** Multiplicador das quantidades: 6 porções sobre a base de 4 → 1,5. */
  factor: number;
  setServings: (servings: number) => void;
}

/**
 * As porções moram no endereço (?porcoes=6): acompanham o usuário do detalhe até o modo cozinha
 * sem estado global, sobrevivem a recarregar e podem ser compartilhadas ("a receita para 8 pessoas").
 */
export function useServings(): ServingsState {
  const { porcoes } = useLocalSearchParams<{ porcoes?: string }>();
  const router = useRouter();
  const servings = parseServings(porcoes);

  return {
    servings,
    factor: servingsFactor(servings, BASE_SERVINGS),
    setServings: (next) => router.setParams({ porcoes: String(clamp(next, MIN_SERVINGS, MAX_SERVINGS)) }),
  };
}
