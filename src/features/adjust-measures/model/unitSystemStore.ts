import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { formatMeasure, type UnitSystem } from '@/entities/measure';
import { persistStorage, storageKey } from '@/shared/lib';

interface UnitSystemState {
  system: UnitSystem;
  setSystem: (system: UnitSystem) => void;
}

/** Preferência "medidas originais" ou "métricas (g e ml)", salva no celular (RF13). */
export const useUnitSystemStore = create<UnitSystemState>()(
  persist(
    (set) => ({
      system: 'original',
      setSystem: (system) => set({ system }),
    }),
    { name: storageKey('unit-system'), version: 1, storage: persistStorage },
  ),
);

/**
 * Função que formata qualquer medida da receita já nas porções e no sistema escolhidos.
 * Valor derivado: calculado na hora, nunca guardado.
 */
export function useMeasureFormatter(factor: number): (measure: string) => string {
  const system = useUnitSystemStore((state) => state.system);
  return (measure) => formatMeasure(measure, { factor, system });
}
