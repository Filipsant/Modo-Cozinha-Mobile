import { userEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';

import type { Recipe } from '@/entities/recipe';
import { useShoppingListStore } from '@/features/shopping-list';
import { renderRouterWithProviders } from '@/shared/testing';

import { ShoppingListScreen } from './ShoppingListScreen';

function recipe(id: string, name: string, ingredients: [string, string][]): Recipe {
  return {
    id,
    name,
    thumbnail: 'https://exemplo/foto.jpg',
    category: 'Dessert',
    area: 'Brazil',
    instructions: '',
    youtubeUrl: null,
    ingredients: ingredients.map(([ingredient, measure]) => ({ name: ingredient, measure })),
    ingredientCount: ingredients.length,
  };
}

async function renderList() {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await renderRouterWithProviders({ 'lista-de-compras': ShoppingListScreen }, '/lista-de-compras');
  return { user };
}

beforeEach(() => {
  useShoppingListStore.setState(useShoppingListStore.getInitialState());
  const { addRecipe } = useShoppingListStore.getState();
  addRecipe(
    recipe('1', 'Bolo', [
      ['Milk', '1 cup'],
      ['Eggs', '2'],
    ]),
    1,
  );
  addRecipe(
    recipe('2', 'Panqueca', [
      ['Milk', '4 tbsp'],
      ['Flour', '200g'],
    ]),
    1,
  );
});

describe('ShoppingListScreen', () => {
  it('mostra a lista somada, com o leite numa linha só', async () => {
    await renderList();

    expect(await screen.findByText('3 itens para comprar')).toBeOnTheScreen();
    expect(screen.getByRole('checkbox', { name: 'Milk, 300 ml' })).toBeOnTheScreen();
  });

  it('marca como comprado e move o item para o fim', async () => {
    const { user } = await renderList();

    await user.press(await screen.findByRole('checkbox', { name: 'Milk, 300 ml' }));

    expect(screen.getByRole('checkbox', { name: 'Milk, 300 ml' })).toBeChecked();
    expect(screen.getByText('2 itens para comprar')).toBeOnTheScreen();
    const order = screen.getAllByRole('checkbox').map((row) => row.props.accessibilityLabel);
    expect(order.at(-1)).toBe('Milk, 300 ml');
  });

  it('agrupa por receita', async () => {
    const { user } = await renderList();

    await user.press(await screen.findByRole('radio', { name: 'Por receita' }));

    expect(screen.getByRole('header', { name: 'Bolo' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Panqueca' })).toBeOnTheScreen();
  });

  it('limpa tudo só depois de confirmar', async () => {
    const { user } = await renderList();

    await user.press(await screen.findByRole('button', { name: 'Limpar tudo' }));
    expect(
      screen.getByText('Esta ação removerá 3 ingredientes e não poderá ser desfeita.'),
    ).toBeOnTheScreen();

    await user.press(screen.getAllByRole('button', { name: 'Limpar tudo' }).at(-1)!);

    expect(await screen.findByRole('header', { name: 'Sua lista está vazia' })).toBeOnTheScreen();
  });
});
