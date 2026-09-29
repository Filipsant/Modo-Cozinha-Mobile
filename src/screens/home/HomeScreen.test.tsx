import { userEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { HttpResponse, http } from 'msw';
import { Text } from 'react-native';

import { API_BASE_URL } from '@/shared/config';
import { renderRouterWithProviders, server } from '@/shared/testing';

import { HomeScreen } from './HomeScreen';

/** Só para conferir para onde o card leva. */
function RecipeStub() {
  return <Text>Página da receita</Text>;
}

async function renderHome(url = '/') {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await renderRouterWithProviders({ index: HomeScreen, 'receita/[id]/index': RecipeStub }, url);
  return { user };
}

describe('HomeScreen', () => {
  it('mostra as receitas em destaque antes de buscar', async () => {
    await renderHome();

    expect(await screen.findByRole('header', { name: 'Receitas em Destaque' })).toBeOnTheScreen();
    // O nome vem traduzido (tradutor simulado do MSW).
    expect(
      await screen.findByRole('button', { name: 'Abrir receita Caçarola de Frango Teriyaki' }),
    ).toBeOnTheScreen();
  });

  it('o botão "Modo Cozinha" do card abre a página da receita', async () => {
    const { user } = await renderHome();

    await user.press(
      await screen.findByRole('button', {
        name: 'Modo Cozinha: abrir a receita Caçarola de Frango Teriyaki',
      }),
    );

    expect(screen.getByText('Página da receita')).toBeOnTheScreen();
  });

  it('busca em português, traduzindo o termo para a API', async () => {
    const { user } = await renderHome();

    await user.type(screen.getByLabelText('Buscar receitas pelo nome'), 'frango');

    expect(await screen.findByRole('header', { name: 'Resultados para "frango"' })).toBeOnTheScreen();
    expect(await screen.findByText('3 receitas')).toBeOnTheScreen();
  });

  it('busca pelo nome depois de parar de digitar e mostra os cards', async () => {
    const { user } = await renderHome();

    await user.type(screen.getByLabelText('Buscar receitas pelo nome'), 'chicken');

    expect(await screen.findByRole('header', { name: 'Resultados para "chicken"' })).toBeOnTheScreen();
    expect(await screen.findByText('3 receitas')).toBeOnTheScreen();
  });

  it('restaura a busca que está no endereço (?q=)', async () => {
    await renderHome('/?q=chicken');

    expect(await screen.findByText('3 receitas')).toBeOnTheScreen();
    expect(screen.getByLabelText('Buscar receitas pelo nome')).toHaveDisplayValue('chicken');
  });

  it('mostra o estado vazio com dica quando nada é encontrado', async () => {
    await renderHome('/?q=xyzxyz');

    expect(await screen.findByRole('header', { name: 'Nenhuma receita encontrada' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Limpar busca e filtros' })).toBeOnTheScreen();
  });

  it('mostra o erro da API e tenta de novo', async () => {
    server.use(http.get(`${API_BASE_URL}/search.php`, () => new HttpResponse(null, { status: 500 })));
    const { user } = await renderHome('/?q=chicken');

    const retry = await screen.findByRole('button', { name: 'Tentar de novo' });
    server.resetHandlers();
    await user.press(retry);

    expect(await screen.findByText('3 receitas')).toBeOnTheScreen();
  });

  it('filtra por categoria e marca o chip como selecionado', async () => {
    const { user } = await renderHome();

    await user.press(await screen.findByRole('button', { name: 'Frutos do Mar' }));

    expect(await screen.findByRole('header', { name: 'Receitas filtradas' })).toBeOnTheScreen();
    expect(await screen.findByText('5 receitas')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Frutos do Mar' })).toBeSelected();
  });

  it('combina categoria e origem pela interseção das duas listas', async () => {
    server.use(
      http.get(`${API_BASE_URL}/filter.php`, ({ request }) => {
        const params = new URL(request.url).searchParams;
        const meal = (id: string) => ({
          idMeal: id,
          strMeal: `Receita ${id}`,
          strMealThumb: 'https://exemplo/f.jpg',
        });
        return HttpResponse.json({
          meals: params.has('c') ? [meal('1'), meal('2')] : [meal('2'), meal('3')],
        });
      }),
    );

    await renderHome('/?categoria=Seafood&origem=Italy');

    expect(await screen.findByText('1 receita')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Abrir receita Receita 2' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Culinária Italiana' })).toBeSelected();
  });
});
