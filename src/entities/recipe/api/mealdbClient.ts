import { fetchJson } from '@/shared/api';
import { API_BASE_URL } from '@/shared/config';

import type { Recipe, RecipeSummary } from '../model/recipe.types';
import { categoriesResponseSchema, mealsResponseSchema, summariesResponseSchema } from './recipe.dto';
import { mapMealToRecipe, mapMealToSummary } from './recipe.mapper';

/** Busca, valida com Zod e converte. Se a API mudar de formato, o erro aparece aqui, não na tela. */
async function getRecipes(path: string, signal?: AbortSignal): Promise<Recipe[]> {
  const json = await fetchJson(`${API_BASE_URL}/${path}`, signal);
  const { meals } = mealsResponseSchema.parse(json);
  return (meals ?? []).map(mapMealToRecipe);
}

async function getSummaries(path: string, signal?: AbortSignal): Promise<RecipeSummary[]> {
  const json = await fetchJson(`${API_BASE_URL}/${path}`, signal);
  const { meals } = summariesResponseSchema.parse(json);
  return (meals ?? []).map(mapMealToSummary);
}

/** O único arquivo que conhece os endereços search.php, lookup.php etc. */
export const mealdbClient = {
  search(term: string, signal?: AbortSignal): Promise<Recipe[]> {
    return getRecipes(`search.php?s=${encodeURIComponent(term)}`, signal);
  },

  async getById(id: string, signal?: AbortSignal): Promise<Recipe | null> {
    const [recipe] = await getRecipes(`lookup.php?i=${encodeURIComponent(id)}`, signal);
    return recipe ?? null;
  },

  async getRandom(signal?: AbortSignal): Promise<Recipe> {
    const [recipe] = await getRecipes('random.php', signal);
    if (!recipe) throw new Error('A API não devolveu uma receita aleatória');
    return recipe;
  },

  async listCategories(signal?: AbortSignal): Promise<string[]> {
    const json = await fetchJson(`${API_BASE_URL}/list.php?c=list`, signal);
    const { meals } = categoriesResponseSchema.parse(json);
    return (meals ?? []).map((item) => item.strCategory);
  },

  filterByCategory(category: string, signal?: AbortSignal): Promise<RecipeSummary[]> {
    return getSummaries(`filter.php?c=${encodeURIComponent(category)}`, signal);
  },

  /** A API filtra a origem pelo país ("Brazil"), e não pelo adjetivo ("Brazilian"). */
  filterByCountry(country: string, signal?: AbortSignal): Promise<RecipeSummary[]> {
    return getSummaries(`filter.php?a=${encodeURIComponent(country)}`, signal);
  },
};
