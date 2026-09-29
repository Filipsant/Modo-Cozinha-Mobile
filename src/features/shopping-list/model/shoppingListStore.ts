import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Recipe } from '@/entities/recipe';
import { persistStorage, storageKey } from '@/shared/lib';

import { addRecipeToList, type ShoppingItem } from '../lib/addRecipeToList';

interface ShoppingListState {
  items: ShoppingItem[];
  /** Soma os ingredientes na quantidade das porções escolhidas (fator 2 = dobro da receita base). */
  addRecipe: (recipe: Recipe, factor: number) => void;
  toggleChecked: (key: string) => void;
  removeItem: (key: string) => void;
  /** Devolve um item removido na mesma posição (botão "Desfazer"). */
  restoreItem: (item: ShoppingItem, index: number) => void;
  clearChecked: () => void;
  clearAll: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      items: [],

      addRecipe: (recipe, factor) =>
        set((state) => ({ items: addRecipeToList(state.items, recipe, factor) })),

      toggleChecked: (key) =>
        set((state) => ({
          items: state.items.map((item) => (item.key === key ? { ...item, checked: !item.checked } : item)),
        })),

      removeItem: (key) => set((state) => ({ items: state.items.filter((item) => item.key !== key) })),

      restoreItem: (item, index) =>
        set((state) => {
          if (state.items.some((existing) => existing.key === item.key)) return state;
          const items = [...state.items];
          items.splice(index, 0, item);
          return { items };
        }),

      clearChecked: () => set((state) => ({ items: state.items.filter((item) => !item.checked) })),

      clearAll: () => set({ items: [] }),
    }),
    { name: storageKey('shopping-list'), version: 1, storage: persistStorage },
  ),
);

/** Itens ainda não comprados, para o contador na aba Lista. É um número: calculado, nunca guardado. */
export function usePendingCount(): number {
  return useShoppingListStore((state) => state.items.filter((item) => !item.checked).length);
}

/** Espera a lista carregar do celular, para a tela não mostrar "lista vazia" por um instante. */
export function useShoppingListHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useShoppingListStore.persist.hasHydrated());

  useEffect(() => useShoppingListStore.persist.onFinishHydration(() => setHydrated(true)), []);

  return hydrated;
}
