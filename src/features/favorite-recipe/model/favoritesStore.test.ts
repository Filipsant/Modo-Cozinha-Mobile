import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFavoritesStore } from './favoritesStore';

const recipe = { id: '52772', name: 'Teriyaki Chicken Casserole', thumbnail: 'https://exemplo/foto.jpg' };

beforeEach(() => {
  useFavoritesStore.setState(useFavoritesStore.getInitialState());
});

describe('favoritesStore', () => {
  it('adiciona a mesma receita uma vez só, com a data', () => {
    useFavoritesStore.getState().add(recipe);
    useFavoritesStore.getState().add(recipe);

    const { items } = useFavoritesStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject(recipe);
    expect(items[0]?.savedAt).toEqual(expect.any(Number));
  });

  it('guarda só o resumo, mesmo recebendo a receita completa', () => {
    useFavoritesStore.getState().add({ ...recipe, instructions: 'muito texto', ingredients: [] } as typeof recipe);

    expect(useFavoritesStore.getState().items[0]).not.toHaveProperty('instructions');
  });

  it('remove pelo id', () => {
    useFavoritesStore.getState().add(recipe);
    useFavoritesStore.getState().remove('52772');

    expect(useFavoritesStore.getState().items).toEqual([]);
  });

  it('desfaz a remoção mantendo a data original', () => {
    useFavoritesStore.getState().add(recipe);
    const [removed] = useFavoritesStore.getState().items;
    useFavoritesStore.getState().remove('52772');

    useFavoritesStore.getState().restore(removed!);

    expect(useFavoritesStore.getState().items).toEqual([removed]);
  });

  it('salva no armazenamento do celular com o prefixo e a versão', async () => {
    useFavoritesStore.getState().add(recipe);

    const saved = JSON.parse((await AsyncStorage.getItem('modo-cozinha:favorites')) ?? '{}');
    expect(saved.version).toBe(1);
    expect(saved.state.items[0].id).toBe('52772');
  });

  it('restaura os favoritos salvos ao abrir o app', async () => {
    await AsyncStorage.setItem(
      'modo-cozinha:favorites',
      JSON.stringify({ state: { items: [{ ...recipe, savedAt: 1 }] }, version: 1 }),
    );

    await useFavoritesStore.persist.rehydrate();

    expect(useFavoritesStore.getState().items).toEqual([{ ...recipe, savedAt: 1 }]);
  });
});
