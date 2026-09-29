import type { Recipe } from '@/entities/recipe';

import { addRecipeToList, type ShoppingItem } from './addRecipeToList';
import { formatItemAmount, formatShoppingList } from './formatShoppingList';

function recipe(id: string, ingredients: [name: string, measure: string][]): Recipe {
  return {
    id,
    name: `Receita ${id}`,
    thumbnail: 'https://exemplo/foto.jpg',
    category: 'Dessert',
    area: 'Brazil',
    instructions: '',
    youtubeUrl: null,
    ingredients: ingredients.map(([name, measure]) => ({ name, measure })),
    ingredientCount: ingredients.length,
  };
}

const find = (items: ShoppingItem[], name: string) =>
  items.filter((item) => item.name.toLowerCase().startsWith(name.toLowerCase()));

describe('addRecipeToList', () => {
  it('converte para ml antes de somar: 1 cup + 4 tbsp de leite = 300 ml numa linha só', () => {
    let items = addRecipeToList([], recipe('1', [['Milk', '1 cup']]), 1);
    items = addRecipeToList(items, recipe('2', [['milk', '4 tbsp']]), 1);

    const milk = find(items, 'milk');
    expect(milk).toHaveLength(1);
    expect(formatItemAmount(milk[0]!)).toBe('300 ml');
    expect(milk[0]!.sources.map((source) => source.id)).toEqual(['1', '2']);
  });

  it('três receitas com ovos e leite geram uma linha para cada ingrediente, com o total certo', () => {
    let items = addRecipeToList([], recipe('1', [['Eggs', '2'], ['Milk', '200ml']]), 1);
    items = addRecipeToList(items, recipe('2', [['Egg', '3 Beaten'], ['Milk', '1/2 cup']]), 1);
    items = addRecipeToList(items, recipe('3', [['eggs', '1'], ['Milk', '0.5 L']]), 1);

    expect(find(items, 'egg')).toHaveLength(1);
    expect(formatItemAmount(find(items, 'egg')[0]!)).toBe('6');
    expect(find(items, 'milk')).toHaveLength(1);
    expect(formatItemAmount(find(items, 'milk')[0]!)).toBe('820 ml');
  });

  it('não soma unidades diferentes', () => {
    let items = addRecipeToList([], recipe('1', [['Onion', '2']]), 1);
    items = addRecipeToList(items, recipe('2', [['Onion', '200g']]), 1);
    items = addRecipeToList(items, recipe('3', [['Onion', '1 large']]), 1);

    expect(find(items, 'onion').map(formatItemAmount)).toEqual(['2', '200 g', '1 large']);
  });

  it('usa a quantidade das porções escolhidas', () => {
    const items = addRecipeToList([], recipe('1', [['Flour', '200g'], ['Garlic', '2 cloves']]), 2.5);

    expect(items.map(formatItemAmount)).toEqual(['500 g', '5 cloves']);
  });

  it('adicionar a mesma receita duas vezes dobra as quantidades e não repete a origem', () => {
    const cake = recipe('1', [['Sugar', '100g']]);
    const items = addRecipeToList(addRecipeToList([], cake, 1), cake, 1);

    expect(items).toHaveLength(1);
    expect(formatItemAmount(items[0]!)).toBe('200 g');
    expect(items[0]!.sources).toHaveLength(1);
  });

  it('medida sem número vira um item só com o texto e não é somada', () => {
    let items = addRecipeToList([], recipe('1', [['Salt', 'to taste']]), 1);
    items = addRecipeToList(items, recipe('2', [['Salt', 'To taste']]), 1);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ quantity: null, label: 'to taste' });
    expect(items[0]!.sources).toHaveLength(2);
  });

  it('um item comprado volta a ficar pendente quando recebe mais quantidade', () => {
    const items = addRecipeToList([], recipe('1', [['Butter', '50g']]), 1).map((item) => ({ ...item, checked: true }));

    expect(addRecipeToList(items, recipe('2', [['Butter', '25g']]), 1)[0]!.checked).toBe(false);
  });

  it('mostra kg e L acima de 1000 e soma faixas', () => {
    let items = addRecipeToList([], recipe('1', [['Flour', '800g'], ['Garlic', '1-2 cloves']]), 1);
    items = addRecipeToList(items, recipe('2', [['Flour', '400g'], ['Garlic', '2 cloves']]), 1);

    expect(items.map(formatItemAmount)).toEqual(['1,2 kg', '3 a 4 cloves']);
  });
});

describe('formatShoppingList', () => {
  it('gera o texto com os pendentes primeiro e os comprados no fim', () => {
    const items = addRecipeToList([], recipe('1', [['Milk', '1 cup'], ['Eggs', '2']]), 1);
    const text = formatShoppingList([items[0]!, { ...items[1]!, checked: true }]);

    expect(text).toBe('Lista de compras (Modo Cozinha)\n\n☐ Milk: 240 ml\n\nJá comprados:\n☑ Eggs: 2');
  });

  it('avisa quando a lista está vazia', () => {
    expect(formatShoppingList([])).toContain('A lista está vazia.');
  });
});
