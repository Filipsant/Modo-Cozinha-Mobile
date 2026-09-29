import type { ShoppingItem, ShoppingItemSource } from './addRecipeToList';

/** Pendentes primeiro e comprados no fim, mantendo a ordem em que foram adicionados. */
export function orderItems(items: ShoppingItem[]): ShoppingItem[] {
  return [...items.filter((item) => !item.checked), ...items.filter((item) => item.checked)];
}

export interface ItemGroup {
  source: ShoppingItemSource;
  items: ShoppingItem[];
}

/**
 * Lista agrupada por receita. Um item somado de duas receitas aparece nas duas,
 * com o total, para quem vai ao mercado pensando em uma receita de cada vez.
 */
export function groupBySource(items: ShoppingItem[]): ItemGroup[] {
  const groups = new Map<string, ItemGroup>();

  for (const item of orderItems(items)) {
    for (const source of item.sources) {
      const group = groups.get(source.id) ?? { source, items: [] };
      group.items.push(item);
      groups.set(source.id, group);
    }
  }

  return [...groups.values()];
}
