import { render, screen, userEvent } from '@testing-library/react-native';

import { useFavoritesStore } from '../model/favoritesStore';
import { FavoriteButton } from './FavoriteButton';

const recipe = { id: '52772', name: 'Teriyaki Chicken Casserole', thumbnail: 'https://exemplo/foto.jpg' };

beforeEach(() => {
  useFavoritesStore.setState(useFavoritesStore.getInitialState());
});

describe('FavoriteButton', () => {
  it('adiciona e remove dos favoritos, trocando o rótulo e o estado selecionado', async () => {
    const user = userEvent.setup();
    await render(<FavoriteButton recipe={recipe} />);

    const addButton = screen.getByRole('button', { name: 'Adicionar aos favoritos' });
    expect(addButton).not.toBeSelected();
    await user.press(addButton);
    expect(useFavoritesStore.getState().items).toHaveLength(1);

    const removeButton = screen.getByRole('button', { name: 'Remover dos favoritos' });
    expect(removeButton).toBeSelected();
    await user.press(removeButton);
    expect(useFavoritesStore.getState().items).toHaveLength(0);
  });
});
