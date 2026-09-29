import { sortFavorites } from './sortFavorites';

const items = [
  { name: 'bolo de cenoura', savedAt: 1 },
  { name: 'Açaí bowl', savedAt: 3 },
  { name: 'Moqueca', savedAt: 2 },
];

describe('sortFavorites', () => {
  it('ordena pelos mais recentes', () => {
    expect(sortFavorites(items, 'recent').map((item) => item.savedAt)).toEqual([3, 2, 1]);
  });

  it('ordena de A a Z ignorando maiúsculas e acentos', () => {
    expect(sortFavorites(items, 'alphabetical').map((item) => item.name)).toEqual([
      'Açaí bowl',
      'bolo de cenoura',
      'Moqueca',
    ]);
  });

  it('não altera a lista original', () => {
    sortFavorites(items, 'alphabetical');

    expect(items[0]?.name).toBe('bolo de cenoura');
  });
});
