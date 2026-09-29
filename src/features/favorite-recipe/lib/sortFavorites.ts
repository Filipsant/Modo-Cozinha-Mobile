export type FavoritesSort = 'recent' | 'alphabetical';

interface Sortable {
  name: string;
  savedAt: number;
}

/** Mais recentes primeiro, ou de A a Z (sem diferenciar maiúsculas e acentos). */
export function sortFavorites<T extends Sortable>(items: T[], sort: FavoritesSort): T[] {
  const copy = [...items];

  if (sort === 'alphabetical') {
    return copy.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
  }

  return copy.sort((a, b) => b.savedAt - a.savedAt);
}
