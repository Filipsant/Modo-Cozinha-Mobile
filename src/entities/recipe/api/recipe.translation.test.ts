import { HttpResponse, http } from 'msw';

import { formatMeasure } from '@/entities/measure';
import { TRANSLATE_API_URL } from '@/shared/config';
import { fixtures, server } from '@/shared/testing';

import { splitSteps } from '../lib/splitSteps';
import { mealDtoSchema } from './recipe.dto';
import { mapMealToRecipe } from './recipe.mapper';
import { translateRecipeNames, translateRecipeOrKeep } from './recipe.translation';

const teriyaki = mapMealToRecipe(mealDtoSchema.parse(fixtures.lookupWithVideo.meals[0]));

describe('translateRecipeOrKeep', () => {
  it('traduz nome, passos e ingredientes (dicionário simulado do MSW)', async () => {
    const recipe = await translateRecipeOrKeep(teriyaki);

    expect(recipe.isTranslated).toBe(true);
    expect(recipe.name).toBe('Caçarola de Frango Teriyaki');
    expect(splitSteps(recipe.instructions)[0]).toBe(
      'Pré-aqueça o forno a 350° F. Unte uma assadeira de 9x13 polegadas com spray antiaderente.',
    );
    expect(splitSteps(recipe.instructions)).toHaveLength(6);
    expect(recipe.ingredients[0]).toEqual({ name: 'molho de soja', measure: '0.75 cup' });
  });

  it('as medidas traduzidas continuam escalando e convertendo', async () => {
    const recipe = recipeWith([
      ['Garlic', '2 cloves chopped'],
      ['Salt', 'to taste'],
      ['Milk', '1/2 cup'],
    ]);

    const translated = await translateRecipeOrKeep(recipe);
    const measures = translated.ingredients.map((ingredient) => ingredient.measure);

    expect(measures).toEqual(['2 dentes picados', 'a gosto', '0.5 cup']);
    expect(formatMeasure(measures[0]!, { factor: 2 })).toBe('4 dentes picados');
    expect(formatMeasure(measures[1]!, { factor: 2 })).toBe('a gosto');
    expect(formatMeasure(measures[2]!, { system: 'metric' })).toBe('120 ml');
  });

  it('manda para o tradutor só as medidas que o dicionário não conhece', async () => {
    const sent: string[] = [];
    server.use(
      http.post(TRANSLATE_API_URL, async ({ request }) => {
        const texts = new URLSearchParams(await request.text()).getAll('q');
        sent.push(...texts);
        return HttpResponse.json(texts);
      }),
    );

    await translateRecipeOrKeep(
      recipeWith([
        ['Carrot', '1 cut into 1/2-inch cubes'],
        ['Egg', '2 large'],
      ]),
    );

    expect(sent).toContain('cut into 1/2-inch cubes');
    expect(sent).not.toContain('large');
  });

  it('mostra a receita em inglês, marcada como não traduzida, se o tradutor falhar', async () => {
    server.use(http.post(TRANSLATE_API_URL, () => new HttpResponse(null, { status: 429 })));

    const recipe = await translateRecipeOrKeep(teriyaki);

    expect(recipe).toEqual({ ...teriyaki, isTranslated: false });
  });
});

describe('translateRecipeNames', () => {
  it('traduz só os nomes e mantém o resto', async () => {
    const [summary] = await translateRecipeNames([
      { id: '52772', name: 'Teriyaki Chicken Casserole', thumbnail: 'x' },
    ]);

    expect(summary).toEqual({ id: '52772', name: 'Caçarola de Frango Teriyaki', thumbnail: 'x' });
  });

  it('mantém os nomes em inglês se o tradutor falhar', async () => {
    server.use(http.post(TRANSLATE_API_URL, () => HttpResponse.error()));
    const recipes = [{ id: '1', name: 'Pancakes', thumbnail: 'x' }];

    expect(await translateRecipeNames(recipes)).toEqual(recipes);
  });
});

function recipeWith(ingredients: [name: string, measure: string][]) {
  return {
    ...teriyaki,
    ingredients: ingredients.map(([name, measure]) => ({ name, measure })),
    ingredientCount: ingredients.length,
  };
}
