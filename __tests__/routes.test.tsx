import { renderRouter, screen } from 'expo-router/testing-library';

/**
 * Testa a navegação de verdade, com a pasta de rotas real.
 * Fica fora de src/app porque todo arquivo .tsx dentro dela vira uma rota do app.
 */
const APP_DIR = './src/app';

describe('rotas do Modo Cozinha', () => {
  it.each([
    ['/', 'Modo Cozinha'],
    ['/favoritos', 'Favoritos'],
    ['/lista-de-compras', 'Lista de compras'],
    ['/receita/52772', 'Receita 52772'],
    ['/receita/52772/cozinhar', 'Modo cozinha'],
    ['/rota-que-nao-existe', 'Página não encontrada'],
  ])('%s abre a tela com o título "%s"', async (url, title) => {
    await renderRouter(APP_DIR, { initialUrl: url });

    expect(await screen.findByRole('header', { name: title })).toBeOnTheScreen();
  });

  it('lê as porções da URL no detalhe', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/receita/52772?porcoes=6' });

    expect(await screen.findByText(/^6 porções/)).toBeOnTheScreen();
  });

  it('lê as porções da URL no modo cozinha', async () => {
    await renderRouter(APP_DIR, { initialUrl: '/receita/52772/cozinhar?porcoes=6' });

    expect(await screen.findByText(/Receita 52772, 6 porções/)).toBeOnTheScreen();
  });
});
