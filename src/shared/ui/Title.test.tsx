import { render, screen } from '@testing-library/react-native';

import { Title } from './Title';

describe('Title', () => {
  it('é anunciado como título pelos leitores de tela', async () => {
    await render(<Title>Favoritos</Title>);

    expect(screen.getByRole('header', { name: 'Favoritos' })).toBeOnTheScreen();
  });
});
