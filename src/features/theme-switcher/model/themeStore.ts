import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { persistStorage, storageKey } from '@/shared/lib';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    { name: storageKey('theme'), version: 1, storage: persistStorage },
  ),
);

/** Traduz a preferência para o React Native: 'unspecified' volta a seguir o sistema. */
export function applyThemePreference(preference: ThemePreference): void {
  Appearance.setColorScheme(preference === 'system' ? 'unspecified' : preference);
}

/**
 * Aplica a preferência salva ao abrir o app e sempre que ela mudar. Fica no _layout raiz.
 * O useTheme (shared) percebe a troca sozinho pelo useColorScheme, sem conhecer esta feature.
 */
export function useApplyThemePreference(): void {
  const preference = useThemeStore((state) => state.preference);

  useEffect(() => {
    applyThemePreference(preference);
  }, [preference]);
}
