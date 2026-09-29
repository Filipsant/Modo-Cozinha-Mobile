import type { Ingredient, Recipe, RecipeSummary } from '../model/recipe.types';
import type { MealDto, MealSummaryDto } from './recipe.dto';

const MAX_INGREDIENTS = 20;

function readText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** O país é o campo novo; receitas antigas só têm a origem antiga (strArea). */
function readOrigin(dto: { strCountry?: string | null; strArea?: string | null }): string {
  return readText(dto.strCountry) || readText(dto.strArea);
}

/** Converte o formato da API para o formato do app. Nenhum outro arquivo conhece "strMeal". */
export function mapMealToRecipe(dto: MealDto): Recipe {
  const ingredients: Ingredient[] = [];

  for (let index = 1; index <= MAX_INGREDIENTS; index++) {
    const name = readText(dto[`strIngredient${index}`]);
    if (name) {
      ingredients.push({ name, measure: readText(dto[`strMeasure${index}`]) });
    }
  }

  return {
    id: dto.idMeal,
    name: dto.strMeal.trim(),
    thumbnail: dto.strMealThumb,
    category: readText(dto.strCategory),
    area: readOrigin(dto),
    instructions: readText(dto.strInstructions),
    ingredients,
    ingredientCount: ingredients.length,
    youtubeUrl: readText(dto.strYoutube) || null,
  };
}

/** Resumo vindo do filter.php. Campos vazios ficam de fora, e não como string vazia. */
export function mapMealToSummary(dto: MealSummaryDto): RecipeSummary {
  const area = readOrigin(dto);

  return {
    id: dto.idMeal,
    name: dto.strMeal.trim(),
    thumbnail: dto.strMealThumb,
    ...(area ? { area } : {}),
  };
}
