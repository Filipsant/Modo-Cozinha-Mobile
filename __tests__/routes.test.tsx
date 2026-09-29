import { userEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';

/**
 * Testa a navegação de verdade, com a pasta de rotas real e a API simulada pelo MSW
 * (a receita 52772 é a "Teriyaki Chicken Casserole" das fixtures, traduzida pelo tradutor simulado).
 * Fica fora de src/app porque todo arquivo .tsx dentro dela vira uma rota do app.
 */
const APP_DIR = './src/app';
// Nome traduzido pelo tradutor simulado do MSW (shared/testing/msw/handlers.ts).
const RECIPE = 'Caçarola de Frango Teriyaki';

describe('rotas do Modo Cozinha', () => {
  it.each([
    ['/', 'Modo Cozinha'],
    ['/favoritos', 'Favoritos'],
    ['/lista-de-compras', 'Lista de compras'],
    ['/receita/52772', RECIPE],
    ['/receita/52772/cozinhar', RECIPE],
    ['/rota-que-nao-existe', 'Página não encontrada'],
  ])('%s abre a tela com o título "%s"', async (url, title) => {
    await renderRouter(APP_DIR, { initialUrl: url });

    expect(await screen.findByRole('header', { name: title })).toBeOnTheScreen();
  });

  it('lê as porções da URL no detalhe e recalcula as medidas', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/receita/52772?porcoes=6' });

    expect(await screen.findByText('6 porções')).toBeOnTheScreen();
    // 3/4 cup de soy sauce na receita base (4 porções) × 1,5 = 1⅛ xícara.
    expect(screen.getByText('1⅛ xícara')).toBeOnTheScreen();
  });

  it('lê as porções da URL no modo cozinha', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderRouter(APP_DIR, { initialUrl: '/receita/52772/cozinhar?porcoes=6' });

    await user.press(await screen.findByRole('button', { name: 'Ver ingredientes' }));

    expect(await screen.findByRole('header', { name: 'Ingredientes · 6 porções' })).toBeOnTheScreen();
  });
});
