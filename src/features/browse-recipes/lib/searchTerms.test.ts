import { mergeById, searchTermOverride } from './searchTerms';

describe('searchTermOverride', () => {
  it('corrige termos que o tradutor erra sem contexto', () => {
    expect(searchTermOverride(' Massa ')).toBe('pasta');
    expect(searchTermOverride('bolo')).toBe('cake');
  });

  it('devolve null para usar o tradutor automático', () => {
    expect(searchTermOverride('bolo de cenoura')).toBeNull();
  });
});

describe('mergeById', () => {
  it('junta as listas sem repetir, mantendo a ordem', () => {
    expect(mergeById([{ id: '1' }, { id: '2' }], [{ id: '2' }, { id: '3' }])).toEqual([
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ]);
  });
});
