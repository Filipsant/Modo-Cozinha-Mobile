import { filterByCategoryAndCountry, intersectById, resolveQuery } from './resolveQuery';

describe('resolveQuery', () => {
  it.each([
    [{ term: '', category: null, country: null }, { kind: 'featured' }],
    [
      { term: 'chicken', category: null, country: null },
      { kind: 'search', term: 'chicken', category: null, country: null },
    ],
    [
      { term: '', category: 'Seafood', country: null },
      { kind: 'category', category: 'Seafood' },
    ],
    [
      { term: '', category: null, country: 'Italy' },
      { kind: 'country', country: 'Italy' },
    ],
    [
      { term: '', category: 'Seafood', country: 'Italy' },
      { kind: 'category-and-country', category: 'Seafood', country: 'Italy' },
    ],
    [
      { term: 'pasta', category: 'Pasta', country: 'Italy' },
      { kind: 'search', term: 'pasta', category: 'Pasta', country: 'Italy' },
    ],
  ])('%j → %j', (params, expected) => {
    expect(resolveQuery(params)).toEqual(expected);
  });

  it('ignora espaços em volta do termo', () => {
    expect(resolveQuery({ term: '   ', category: null, country: null })).toEqual({ kind: 'featured' });
    expect(resolveQuery({ term: ' cake ', category: null, country: null })).toMatchObject({ term: 'cake' });
  });
});

describe('intersectById', () => {
  it('mantém só os ids das duas listas, na ordem da primeira', () => {
    const first = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const second = [{ id: '3' }, { id: '1' }];

    expect(intersectById(first, second)).toEqual([{ id: '1' }, { id: '3' }]);
  });
});

describe('filterByCategoryAndCountry', () => {
  const recipes = [
    { id: '1', category: 'Pasta', area: 'Italy' },
    { id: '2', category: 'Pasta', area: 'Japan' },
    { id: '3', category: 'Dessert', area: 'Italy' },
  ];

  it('filtra por categoria, por origem ou pelas duas', () => {
    expect(filterByCategoryAndCountry(recipes, 'Pasta', null).map((r) => r.id)).toEqual(['1', '2']);
    expect(filterByCategoryAndCountry(recipes, null, 'Italy').map((r) => r.id)).toEqual(['1', '3']);
    expect(filterByCategoryAndCountry(recipes, 'Pasta', 'Italy').map((r) => r.id)).toEqual(['1']);
    expect(filterByCategoryAndCountry(recipes, null, null)).toHaveLength(3);
  });
});
