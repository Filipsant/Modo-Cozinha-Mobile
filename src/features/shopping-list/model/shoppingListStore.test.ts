import { act, renderHook } from '@testing-library/react-native';

import type { Recipe } from '@/entities/recipe';

import { usePendingCount, useShoppingListStore } from './shoppingListStore';

const pancakes: Recipe = {
  id: '52855',
  name: 'Banana Pancakes',
  thumbnail: 'https://exemplo/foto.jpg',
  category: 'Dessert',
  area: 'United States',
  instructions: '',
  youtubeUrl: null,
  ingredients: [
    { name: 'Banana', measure: '1 large' },
    { name: 'Eggs', measure: '2' },
    { name: 'Salt', measure: 'pinch' },
  ],
  ingredientCount: 3,
};

const store = () => useShoppingListStore.getState();
const keys = () => store().items.map((item) => item.name);

beforeEach(() => {
  useShoppingListStore.setState(useShoppingListStore.getInitialState());
});

describe('shoppingListStore', () => {
  it('adiciona os ingredientes da receita', () => {
    store().addRecipe(pancakes, 1);

    expect(keys()).toEqual(['Banana', 'Eggs', 'Salt']);
  });

  it('marca e desmarca como comprado', () => {
    store().addRecipe(pancakes, 1);
    const [banana] = store().items;

    store().toggleChecked(banana!.key);
    expect(store().items[0]!.checked).toBe(true);

    store().toggleChecked(banana!.key);
    expect(store().items[0]!.checked).toBe(false);
  });

  it('remove um item e desfaz na mesma posição', () => {
    store().addRecipe(pancakes, 1);
    const eggs = store().items[1]!;

    store().removeItem(eggs.key);
    expect(keys()).toEqual(['Banana', 'Salt']);

    store().restoreItem(eggs, 1);
    expect(keys()).toEqual(['Banana', 'Eggs', 'Salt']);
  });

  it('limpa só os comprados ou tudo', () => {
    store().addRecipe(pancakes, 1);
    store().toggleChecked(store().items[0]!.key);

    store().clearChecked();
    expect(keys()).toEqual(['Eggs', 'Salt']);

    store().clearAll();
    expect(store().items).toEqual([]);
  });

  it('conta só os itens pendentes', async () => {
    const { result } = await renderHook(() => usePendingCount());
    expect(result.current).toBe(0);

    await act(() => store().addRecipe(pancakes, 1));
    expect(result.current).toBe(3);

    await act(() => store().toggleChecked(store().items[0]!.key));
    expect(result.current).toBe(2);
  });
});
