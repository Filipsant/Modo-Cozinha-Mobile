import type { ShoppingItem } from './addRecipeToList';
import { groupBySource, orderItems } from './organizeItems';

function item(key: string, checked: boolean, sourceIds: string[]): ShoppingItem {
  return {
    key,
    name: key,
    quantity: 1,
    quantityMax: null,
    unit: null,
    label: '',
    checked,
    sources: sourceIds.map((id) => ({ id, name: `Receita ${id}` })),
  };
}

describe('orderItems', () => {
  it('coloca os comprados no fim, mantendo a ordem', () => {
    const items = [
      item('a', true, ['1']),
      item('b', false, ['1']),
      item('c', true, ['1']),
      item('d', false, ['1']),
    ];

    expect(orderItems(items).map((i) => i.key)).toEqual(['b', 'd', 'a', 'c']);
  });
});

describe('groupBySource', () => {
  it('agrupa por receita e repete itens que vieram de duas receitas', () => {
    const groups = groupBySource([item('leite', false, ['1', '2']), item('ovo', false, ['2'])]);

    expect(groups.map((group) => [group.source.id, group.items.map((i) => i.key)])).toEqual([
      ['1', ['leite']],
      ['2', ['leite', 'ovo']],
    ]);
  });
});
