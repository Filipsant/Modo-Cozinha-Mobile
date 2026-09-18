import { persistStorage, storageKey } from './persistStorage';

describe('storageKey', () => {
  it('usa o prefixo modo-cozinha:', () => {
    expect(storageKey('favorites')).toBe('modo-cozinha:favorites');
  });
});

describe('persistStorage', () => {
  it('salva e lê de volta um estado em JSON', async () => {
    const value = { state: { ids: ['52772'] }, version: 1 };

    await persistStorage?.setItem(storageKey('favorites'), value);

    expect(await persistStorage?.getItem(storageKey('favorites'))).toEqual(value);
  });
});
