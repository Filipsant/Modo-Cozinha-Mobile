import { act, userEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';

import { useFavoritesStore } from '@/features/favorite-recipe';
import { renderRouterWithProviders } from '@/shared/testing';
import { useToastStore } from '@/shared/ui';

import { FavoritesScreen } from './FavoritesScreen';

const favorite = (id: string, name: string, savedAt: number) => ({
  id,
  name,
  savedAt,
  thumbnail: 'https://exemplo/foto.jpg',
});

async function renderFavorites() {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await renderRouterWithProviders({ favoritos: FavoritesScreen }, '/favoritos');
  return { user };
}

beforeEach(() => {
  useFavoritesStore.setState(useFavoritesStore.getInitialState());
  useToastStore.setState(useToastStore.getInitialState());
});

describe('FavoritesScreen', () => {
  it('convida a buscar quando não há favoritos', async () => {
    await renderFavorites();

    expect(await screen.findByRole('header', { name: 'Nenhum favorito ainda' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Buscar receitas' })).toBeOnTheScreen();
  });

  it('ordena por mais recentes ou de A a Z', async () => {
    // Moqueca foi salva por último; em ordem alfabética, Brigadeiro vem antes.
    useFavoritesStore.setState({ items: [favorite('1', 'Brigadeiro', 1), favorite('2', 'Moqueca', 2)] });
    const { user } = await renderFavorites();

    const names = () =>
      screen.getAllByRole('button', { name: /^Abrir receita/ }).map((card) => card.props.accessibilityLabel);
    expect(await screen.findByText('2 receitas salvas no celular.')).toBeOnTheScreen();
    expect(names()).toEqual(['Abrir receita Moqueca', 'Abrir receita Brigadeiro']);

    await user.press(screen.getByRole('radio', { name: 'A a Z' }));

    expect(names()).toEqual(['Abrir receita Brigadeiro', 'Abrir receita Moqueca']);
  });

  it('remove com a opção de desfazer', async () => {
    useFavoritesStore.setState({ items: [favorite('1', 'Moqueca', 1)] });
    const { user } = await renderFavorites();

    await user.press(await screen.findByRole('button', { name: 'Remover Moqueca dos favoritos' }));
    expect(useFavoritesStore.getState().items).toEqual([]);

    // O toast aparece no _layout raiz; aqui conferimos o que ele recebeu e tocamos em "Desfazer".
    const toast = useToastStore.getState().toast;
    expect(toast).toMatchObject({ message: 'Moqueca removida dos favoritos', actionLabel: 'Desfazer' });
    await act(() => toast?.onAction?.());

    expect(await screen.findByRole('button', { name: 'Abrir receita Moqueca' })).toBeOnTheScreen();
  });
});
