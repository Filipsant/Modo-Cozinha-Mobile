import { fixtures } from '@/shared/testing';

import { mealDtoSchema, mealSummaryDtoSchema } from './recipe.dto';
import { mapMealToRecipe, mapMealToSummary } from './recipe.mapper';

const baseMeal = {
  idMeal: '1',
  strMeal: ' Teste ',
  strMealThumb: 'https://exemplo/foto.jpg',
};

describe('mapMealToRecipe', () => {
  it('converte uma resposta real da API para o formato do app', () => {
    const recipe = mapMealToRecipe(mealDtoSchema.parse(fixtures.lookupWithVideo.meals[0]));

    expect(recipe).toMatchObject({
      id: '52772',
      name: 'Teriyaki Chicken Casserole',
      category: 'Chicken',
      area: 'Japan',
      youtubeUrl: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
    });
    expect(recipe.ingredients[0]).toEqual({ name: 'soy sauce', measure: '3/4 cup' });
    expect(recipe.ingredientCount).toBe(recipe.ingredients.length);
  });

  it('usa null quando não há vídeo', () => {
    const recipe = mapMealToRecipe(mealDtoSchema.parse(fixtures.lookupNoVideo.meals[0]));

    expect(recipe.youtubeUrl).toBeNull();
  });

  it('ignora ingredientes vazios, nulos ou só com espaços', () => {
    const recipe = mapMealToRecipe(
      mealDtoSchema.parse({
        ...baseMeal,
        strIngredient1: 'Egg',
        strMeasure1: '2',
        strIngredient2: '',
        strMeasure2: '',
        strIngredient3: null,
        strMeasure3: null,
        strIngredient4: '   ',
        strIngredient5: 'Salt',
        strMeasure5: null,
      }),
    );

    expect(recipe.ingredients).toEqual([
      { name: 'Egg', measure: '2' },
      { name: 'Salt', measure: '' },
    ]);
  });

  it('usa a origem antiga quando o país não vem e tira espaços do nome', () => {
    const recipe = mapMealToRecipe(mealDtoSchema.parse({ ...baseMeal, strArea: 'Italian', strCountry: null }));

    expect(recipe.area).toBe('Italian');
    expect(recipe.name).toBe('Teste');
    expect(recipe.category).toBe('');
    expect(recipe.instructions).toBe('');
  });
});

describe('mapMealToSummary', () => {
  it('guarda a origem só quando ela existe', () => {
    expect(mapMealToSummary(mealSummaryDtoSchema.parse({ ...baseMeal, strCountry: 'Brazil' }))).toEqual({
      id: '1',
      name: 'Teste',
      thumbnail: 'https://exemplo/foto.jpg',
      area: 'Brazil',
    });
    expect(mapMealToSummary(mealSummaryDtoSchema.parse(baseMeal))).not.toHaveProperty('area');
  });
});
