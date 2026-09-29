import { sortCategories, translateCategory, translateOrigin } from './labels';

describe('translateCategory', () => {
  it.each([
    ['Pasta', 'Massas'],
    ['Seafood', 'Frutos do Mar'],
    ['Categoria Nova', 'Categoria Nova'],
  ])('%s → %s', (category, expected) => {
    expect(translateCategory(category)).toBe(expected);
  });
});

describe('translateOrigin', () => {
  it.each([
    ['Italy', 'Italiana'],
    ['Brazil', 'Brasileira'],
    ['Jamaica', 'Jamaicana'],
    ['Atlantis', 'Atlantis'],
  ])('%s → %s', (country, expected) => {
    expect(translateOrigin(country)).toBe(expected);
  });
});

describe('sortCategories', () => {
  it('segue a ordem do Figma e deixa as desconhecidas no fim', () => {
    expect(sortCategories(['Beef', 'Zeta', 'Seafood', 'Pasta', 'Alfa'])).toEqual([
      'Pasta',
      'Seafood',
      'Beef',
      'Alfa',
      'Zeta',
    ]);
  });
});
