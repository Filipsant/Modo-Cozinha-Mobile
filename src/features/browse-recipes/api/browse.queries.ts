import { queryOptions } from '@tanstack/react-query';

import { mealdbClient, translateRecipeNames, type RecipeSummary } from '@/entities/recipe';
import { translateTexts } from '@/shared/api';
import { APP_LANGUAGE, RECIPE_LANGUAGE } from '@/shared/config';

import { filterByCategoryAndCountry, intersectById, type BrowseStrategy } from '../lib/resolveQuery';
import { mergeById, searchTermOverride } from '../lib/searchTerms';

type ListStrategy = Exclude<BrowseStrategy, { kind: 'featured' }>;

const FIVE_MINUTES = 5 * 60 * 1000;

/** O termo em inglês, que é o que a TheMealDB entende. Se o tradutor falhar, busca como foi digitado. */
async function toEnglish(term: string, signal?: AbortSignal): Promise<string> {
  const override = searchTermOverride(term);
  if (override) return override;

  try {
    const [english] = await translateTexts([term], { from: APP_LANGUAGE, to: RECIPE_LANGUAGE, signal });
    return english ?? term;
  } catch (error) {
    if (signal?.aborted) throw error;
    return term;
  }
}

/**
 * Busca em português: procura o termo traduzido e o termo como foi digitado (receitas como
 * "pão de queijo" têm o nome original no título) e junta os resultados sem repetir.
 */
async function searchInAnyLanguage(term: string, signal?: AbortSignal) {
  const english = await toEnglish(term, signal);
  const terms = [...new Set([english.toLowerCase(), term.toLowerCase()])];
  const results = await Promise.all(terms.map((searchTerm) => mealdbClient.search(searchTerm, signal)));
  return mergeById(...results);
}

async function fetchList(strategy: ListStrategy, signal?: AbortSignal): Promise<RecipeSummary[]> {
  switch (strategy.kind) {
    case 'search': {
      const recipes = await searchInAnyLanguage(strategy.term, signal);
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

/**
 * Executa a estratégia escolhida pelo resolveQuery e traduz os nomes para os cards.
 * Os filtros da API devolvem só id, nome e foto; a categoria filtrada é conhecida, então ela é anotada
 * nos resultados para aparecer no card.
 */
export async function fetchByStrategy(
  strategy: ListStrategy,
  signal?: AbortSignal,
): Promise<RecipeSummary[]> {
  return translateRecipeNames(await fetchList(strategy, signal), signal);
}

export const browseQueries = {
  results: (strategy: ListStrategy) =>
    queryOptions({
      queryKey: ['recipes', 'browse', strategy],
      queryFn: ({ signal }) => fetchByStrategy(strategy, signal),
      staleTime: FIVE_MINUTES,
    }),
};
