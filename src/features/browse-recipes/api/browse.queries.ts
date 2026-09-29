import { queryOptions } from '@tanstack/react-query';

import { mealdbClient, type RecipeSummary } from '@/entities/recipe';

import { filterByCategoryAndCountry, intersectById, type BrowseStrategy } from '../lib/resolveQuery';

type ListStrategy = Exclude<BrowseStrategy, { kind: 'featured' }>;

const FIVE_MINUTES = 5 * 60 * 1000;

/**
 * Executa a estratégia escolhida pelo resolveQuery. Os filtros da API devolvem só id, nome e foto;
 * a categoria filtrada é conhecida, então ela é anotada nos resultados para aparecer no card.
 */
export async function fetchByStrategy(strategy: ListStrategy, signal?: AbortSignal): Promise<RecipeSummary[]> {
  switch (strategy.kind) {
    case 'search': {
      const recipes = await mealdbClient.search(strategy.term, signal);
      return filterByCategoryAndCountry(recipes, strategy.category, strategy.country);
    }
    case 'category': {
      const recipes = await mealdbClient.filterByCategory(strategy.category, signal);
      return recipes.map((recipe) => ({ ...recipe, category: strategy.category }));
    }
    case 'country': {
      const recipes = await mealdbClient.filterByCountry(strategy.country, signal);
      return recipes.map((recipe) => ({ ...recipe, area: strategy.country }));
    }
    case 'category-and-country': {
      // Duas chamadas em paralelo e interseção por id no celular.
      const [byCategory, byCountry] = await Promise.all([
        mealdbClient.filterByCategory(strategy.category, signal),
        mealdbClient.filterByCountry(strategy.country, signal),
      ]);
      return intersectById(byCategory, byCountry).map((recipe) => ({
        ...recipe,
        category: strategy.category,
        area: strategy.country,
      }));
    }
  }
}

export const browseQueries = {
  results: (strategy: ListStrategy) =>
    queryOptions({
      queryKey: ['recipes', 'browse', strategy],
      queryFn: ({ signal }) => fetchByStrategy(strategy, signal),
      staleTime: FIVE_MINUTES,
    }),
};
