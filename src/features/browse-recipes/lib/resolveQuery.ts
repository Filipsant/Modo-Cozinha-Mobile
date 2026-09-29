export interface BrowseParams {
  /** Termo de busca (já com debounce). */
  term: string;
  /** Categoria em inglês, como a API entende ("Seafood"). */
  category: string | null;
  /** País de origem em inglês ("Italy"). */
  country: string | null;
}

/**
 * Qual chamada fazer para cada combinação de busca e filtros (tabela da Etapa 3 do roadmap).
 * A API não combina filtros: filter.php aceita só categoria ou só origem.
 */
export type BrowseStrategy =
  | { kind: 'featured' }
  | { kind: 'search'; term: string; category: string | null; country: string | null }
  | { kind: 'category'; category: string }
  | { kind: 'country'; country: string }
  | { kind: 'category-and-country'; category: string; country: string };

export function resolveQuery({ term, category, country }: BrowseParams): BrowseStrategy {
  const trimmed = term.trim();

  // Com busca, o search.php já devolve categoria e origem: o filtro é feito no celular.
  if (trimmed) return { kind: 'search', term: trimmed, category, country };
  if (category && country) return { kind: 'category-and-country', category, country };
  if (category) return { kind: 'category', category };
  if (country) return { kind: 'country', country };
  return { kind: 'featured' };
}

/** Receitas presentes nas duas listas (interseção por id), mantendo a ordem da primeira. */
export function intersectById<T extends { id: string }>(first: T[], second: T[]): T[] {
  const ids = new Set(second.map((item) => item.id));
  return first.filter((item) => ids.has(item.id));
}

/** Filtro no celular para a busca: mantém só as receitas da categoria e da origem escolhidas. */
export function filterByCategoryAndCountry<T extends { category?: string; area?: string }>(
  recipes: T[],
  category: string | null,
  country: string | null,
): T[] {
  return recipes.filter(
    (recipe) => (!category || recipe.category === category) && (!country || recipe.area === country),
  );
}
