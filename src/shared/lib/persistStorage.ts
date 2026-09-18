import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

import { STORAGE_PREFIX } from '@/shared/config';

/**
 * Armazenamento dos stores Zustand persistidos. No web era o localStorage;
 * no celular é o AsyncStorage, que é assíncrono.
 *
 * Uso num store:
 *   persist(creator, { name: storageKey('favorites'), version: 1, storage: persistStorage })
 */
export const persistStorage = createJSONStorage(() => AsyncStorage);

export function storageKey(name: string): string {
  return `${STORAGE_PREFIX}${name}`;
}
