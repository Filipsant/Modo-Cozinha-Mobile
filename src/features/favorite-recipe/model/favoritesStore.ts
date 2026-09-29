import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { RecipeSummary } from '@/entities/recipe';
import { persistStorage, storageKey } from '@/shared/lib';

export interface FavoriteRecipe extends RecipeSummary {
  savedAt: number;
}

interface FavoritesState {
  items: FavoriteRecipe[];
  add: (recipe: RecipeSummary) => void;
  remove: (id: string) => void;
  /** Devolve um favorito removido (botão "Desfazer"), mantendo a data original. */
  restore: (favorite: FavoriteRecipe) => void;
}

/** Guarda só o resumo: é o que o card precisa, e a receita completa vem da API quando abrir. */
function toSummary({ id, name, thumbnail, category, area, ingredientCount }: RecipeSummary): RecipeSummary {
  return { id, name, thumbnail, category, area, ingredientCount };
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],

      add: (recipe) =>
        set((state) =>
          state.items.some((item) => item.id === recipe.id)
            ? state
            : { items: [{ ...toSummary(recipe), savedAt: Date.now() }, ...state.items] },
        ),

      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      restore: (favorite) =>
        set((state) =>
          state.items.some((item) => item.id === favorite.id) ? state : { items: [...state.items, favorite] },
        ),
    }),
    {
      name: storageKey('favorites'),
      version: 1,
      storage: persistStorage,
    },
  ),
);

/** Seletor pequeno: o componente só renderiza de novo quando ESTA receita muda. */
export function useIsFavorite(id: string): boolean {
  return useFavoritesStore((state) => state.items.some((item) => item.id === id));
}

/**
 * O AsyncStorage é assíncrono: ao abrir o app, os favoritos levam alguns milissegundos para carregar.
 * Enquanto isso, a página de favoritos não deve mostrar "nenhum favorito".
 */
export function useFavoritesHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useFavoritesStore.persist.hasHydrated());

  useEffect(() => useFavoritesStore.persist.onFinishHydration(() => setHydrated(true)), []);

  return hydrated;
}
