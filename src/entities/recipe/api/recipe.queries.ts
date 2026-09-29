import { queryOptions } from '@tanstack/react-query';

import { FEATURED_RECIPES_COUNT } from '@/shared/config';

import type { Recipe } from '../model/recipe.types';
import { mealdbClient } from './mealdbClient';
import { translateRecipeNames, translateRecipeOrKeep } from './recipe.translation';

const THIRTY_MINUTES = 30 * 60 * 1000;

/** Sorteia receitas diferentes para a seção "Receitas em Destaque", com os nomes em português. */
async function fetchFeatured(count: number, signal?: AbortSignal): Promise<Recipe[]> {
  const recipes = await Promise.all(Array.from({ length: count }, () => mealdbClient.getRandom(signal)));
  const unique = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  return translateRecipeNames([...unique.values()], signal);
}

/** A receita completa, já traduzida (ou em inglês, com isTranslated: false, se a tradução falhar). */
async function fetchDetail(id: string, signal?: AbortSignal): Promise<Recipe | null> {
  const recipe = await mealdbClient.getById(id, signal);
  return recipe ? translateRecipeOrKeep(recipe, signal) : null;
}

/**
 * Chave + função + tempo de cache de cada consulta, num lugar só.
 * O `signal` cancela a requisição anterior quando o usuário continua digitando.
 */
export const recipeQueries = {
  detail: (id: string) =>
    queryOptions({
      queryKey: ['recipes', 'detail', id],
      queryFn: ({ signal }) => fetchDetail(id, signal),
      staleTime: THIRTY_MINUTES,
    }),

  /** Sugestões da tela inicial: sorteadas uma vez por sessão, para não mudarem a cada volta. */
  featured: () =>
    queryOptions({
      queryKey: ['recipes', 'featured'],
      queryFn: ({ signal }) => fetchFeatured(FEATURED_RECIPES_COUNT, signal),
      staleTime: Infinity,
    }),

  /** Categorias quase nunca mudam: buscadas uma vez por sessão. */
  categories: () =>
    queryOptions({
      queryKey: ['recipes', 'categories'],
      queryFn: ({ signal }) => mealdbClient.listCategories(signal),
      staleTime: Infinity,
    }),
};
