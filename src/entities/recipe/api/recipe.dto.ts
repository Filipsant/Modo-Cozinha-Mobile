import { z } from 'zod';

/**
 * Formato cru de uma receita da TheMealDB (DTO = Data Transfer Object).
 * Os ingredientes chegam em 40 campos soltos (strIngredient1..20 e strMeasure1..20);
 * looseObject mantém esses campos extras para o mapper ler.
 */
export const mealDtoSchema = z.looseObject({
  idMeal: z.string(),
  strMeal: z.string(),
  strMealThumb: z.string(),
  strCategory: z.string().nullish(),
  strArea: z.string().nullish(),
  /** Campo novo da API: o país ("Brazil"), usado pelo filtro por origem. */
  strCountry: z.string().nullish(),
  strInstructions: z.string().nullish(),
  strYoutube: z.string().nullish(),
});

/** Toda resposta vem como { meals: [...] } ou { meals: null } quando não há resultado. */
export const mealsResponseSchema = z.object({
  meals: z.array(mealDtoSchema).nullable(),
});

/** O filter.php devolve só o resumo: id, nome, foto e, às vezes, a origem. */
export const mealSummaryDtoSchema = z.object({
  idMeal: z.string(),
  strMeal: z.string(),
  strMealThumb: z.string(),
  strArea: z.string().nullish(),
  strCountry: z.string().nullish(),
});

export const summariesResponseSchema = z.object({
  meals: z.array(mealSummaryDtoSchema).nullable(),
});

export const categoriesResponseSchema = z.object({
  meals: z.array(z.object({ strCategory: z.string() })).nullable(),
});

export type MealDto = z.infer<typeof mealDtoSchema>;
export type MealSummaryDto = z.infer<typeof mealSummaryDtoSchema>;
