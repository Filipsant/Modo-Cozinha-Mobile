import { parseMeasure, serializeMeasure, translateMeasureText } from '@/entities/measure';
import { translateTexts } from '@/shared/api';
import { APP_LANGUAGE, RECIPE_LANGUAGE } from '@/shared/config';

import { splitSteps } from '../lib/splitSteps';
import type { Recipe, RecipeSummary } from '../model/recipe.types';

const toAppLanguage = (signal?: AbortSignal) => ({ from: RECIPE_LANGUAGE, to: APP_LANGUAGE, signal });

/**
 * Traduz nome, passos, ingredientes e medidas numa requisição só (ADR 011).
 * - Os passos são traduzidos um a um, depois do splitSteps, para cada um continuar sendo um passo.
 * - As palavras das medidas saem do dicionário ("to taste" → "a gosto"); só o que ele não conhece vai
 *   para o tradutor. Número e unidade ficam como estão, para porções, conversão e soma continuarem certas.
 */
export async function translateRecipe(recipe: Recipe, signal?: AbortSignal): Promise<Recipe> {
  const steps = splitSteps(recipe.instructions);
  const measures = recipe.ingredients.map((ingredient) => {
    const parsed = parseMeasure(ingredient.measure);
    return { parsed, rest: translateMeasureText(parsed.rest) };
  });

  const translated = await translateTexts(
    [
      recipe.name,
      ...steps,
      ...recipe.ingredients.map((ingredient) => ingredient.name),
      ...measures.flatMap((measure) => (measure.rest === null ? [measure.parsed.rest] : [])),
    ],
    toAppLanguage(signal),
  );

  // As traduções voltam na mesma ordem em que foram pedidas.
  let position = 0;
  const next = (original: string) => translated[position++] ?? original;

  const name = next(recipe.name);
  const translatedSteps = steps.map(next);
  const names = recipe.ingredients.map((ingredient) => next(ingredient.name));
  const ingredients = recipe.ingredients.map((ingredient, index) => {
    const { parsed, rest } = measures[index] ?? { parsed: parseMeasure(ingredient.measure), rest: null };
    return {
      name: names[index] ?? ingredient.name,
      measure: serializeMeasure({ ...parsed, rest: rest ?? next(parsed.rest) }),
    };
  });

  return { ...recipe, name, instructions: translatedSteps.join('\n'), ingredients, isTranslated: true };
}

/** Tradução que nunca quebra a tela: se o serviço falhar, a receita aparece em inglês, com o aviso. */
export async function translateRecipeOrKeep(recipe: Recipe, signal?: AbortSignal): Promise<Recipe> {
  try {
    return await translateRecipe(recipe, signal);
  } catch (error) {
    if (signal?.aborted) throw error;
    return { ...recipe, isTranslated: false };
  }
}

/** Traduz só os nomes, para os cards das listas. Se falhar, mantém os nomes em inglês. */
export async function translateRecipeNames<T extends RecipeSummary>(
  recipes: T[],
  signal?: AbortSignal,
): Promise<T[]> {
  if (recipes.length === 0) return recipes;

  try {
    const names = await translateTexts(
      recipes.map((recipe) => recipe.name),
      toAppLanguage(signal),
    );
    return recipes.map((recipe, index) => ({ ...recipe, name: names[index] ?? recipe.name }));
  } catch (error) {
    if (signal?.aborted) throw error;
    return recipes;
  }
}
