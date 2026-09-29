import { fireEvent, userEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { HttpResponse, http } from 'msw';

import { useUnitSystemStore } from '@/features/adjust-measures';
import { useFavoritesStore } from '@/features/favorite-recipe';
import { useShoppingListStore } from '@/features/shopping-list';
import { API_BASE_URL, TRANSLATE_API_URL } from '@/shared/config';
import { renderRouterWithProviders, server } from '@/shared/testing';

import { RecipeDetailsScreen } from './RecipeDetailsScreen';

/** Nome traduzido pelo tradutor simulado do MSW (shared/testing/msw/handlers.ts). */
const RECIPE = 'Caçarola de Frango Teriyaki';

async function renderDetails(url = '/receita/52772') {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await renderRouterWithProviders({ 'receita/[id]/index': RecipeDetailsScreen }, url);
  return { user };
}

beforeEach(() => {
  useUnitSystemStore.setState(useUnitSystemStore.getInitialState());
  useFavoritesStore.setState(useFavoritesStore.getInitialState());
  useShoppingListStore.setState(useShoppingListStore.getInitialState());
});

describe('RecipeDetailsScreen', () => {
  it('mostra a receita traduzida, com as unidades em português e o modo de preparo', async () => {
    await renderDetails();

    expect(await screen.findByRole('header', { name: RECIPE })).toBeOnTheScreen();
    expect(screen.getByText('molho de soja')).toBeOnTheScreen();
    expect(screen.getByText(/^Pré-aqueça o forno/)).toBeOnTheScreen();
    expect(screen.getByText('¾ xícara')).toBeOnTheScreen();
    expect(screen.getByText('4 colheres de sopa')).toBeOnTheScreen();
    expect(screen.getByText('6 passos')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Assistir ao vídeo no YouTube' })).toBeOnTheScreen();
  });

  it('recalcula as quantidades ao mudar as porções', async () => {
    const { user } = await renderDetails('/receita/52772?porcoes=7');

    await user.press(await screen.findByRole('button', { name: 'Aumentar porções' }));

    expect(await screen.findByText('8 porções')).toBeOnTheScreen();
    expect(screen.getByText('1½ xícara')).toBeOnTheScreen();
    expect(screen.getByText('6 xícaras')).toBeOnTheScreen();
  });

  it('não passa de 20 porções', async () => {
    await renderDetails('/receita/52772?porcoes=20');

    expect(await screen.findByRole('button', { name: 'Aumentar porções' })).toBeDisabled();
  });

  it('troca para medidas métricas', async () => {
    await renderDetails();

    // O Switch nativo responde a "valueChange", e não a um toque simples.
    const toggle = await screen.findByLabelText('Usar medidas métricas, em gramas e mililitros');
    await fireEvent(toggle, 'valueChange', true);

    expect(await screen.findByText('180 ml')).toBeOnTheScreen();
    expect(useUnitSystemStore.getState().system).toBe('metric');
  });

  it('adiciona os ingredientes traduzidos à lista de compras nas porções escolhidas', async () => {
    const { user } = await renderDetails('/receita/52772?porcoes=8');

    await user.press(await screen.findByRole('button', { name: 'Adicionar à lista' }));

    const soySauce = useShoppingListStore.getState().items.find((item) => item.name === 'molho de soja');
    expect(soySauce).toMatchObject({ quantity: 360, unit: 'ml' });
  });

  it('favorita pelo cabeçalho, com o nome em português', async () => {
    const { user } = await renderDetails();

    await user.press(await screen.findByRole('button', { name: 'Adicionar aos favoritos' }));

    expect(useFavoritesStore.getState().items[0]).toMatchObject({ id: '52772', name: RECIPE });
  });

  it('diferencia receita inexistente de erro de rede', async () => {
    await renderDetails('/receita/99999');

    expect(await screen.findByRole('header', { name: 'Receita não encontrada' })).toBeOnTheScreen();
  });

  it('mostra o erro de rede e tenta de novo', async () => {
    server.use(http.get(`${API_BASE_URL}/lookup.php`, () => HttpResponse.error()));
    const { user } = await renderDetails();

    const retry = await screen.findByRole('button', { name: 'Tentar de novo' });
    server.resetHandlers();
    await user.press(retry);

    expect(await screen.findByRole('header', { name: RECIPE })).toBeOnTheScreen();
  });

  it('mostra a receita em inglês com um aviso quando a tradução falha, e traduz ao tentar de novo', async () => {
    server.use(http.post(TRANSLATE_API_URL, () => new HttpResponse(null, { status: 429 })));
    const { user } = await renderDetails();

    expect(await screen.findByRole('header', { name: 'Teriyaki Chicken Casserole' })).toBeOnTheScreen();
    expect(screen.getByText(/Não foi possível traduzir agora/)).toBeOnTheScreen();

    server.resetHandlers();
    await user.press(screen.getByRole('button', { name: 'Traduzir' }));

    expect(await screen.findByRole('header', { name: RECIPE })).toBeOnTheScreen();
    expect(screen.queryByText(/Não foi possível traduzir agora/)).toBeNull();
  });
});
