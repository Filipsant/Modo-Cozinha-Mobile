import { formatDecimal, formatQuantity, roundMetric } from '@/entities/measure';

import type { ShoppingItem } from './addRecipeToList';

/** Tamanhos não vão para o plural ("2 large"); o resto ganha "s" ou "es" ("2 cloves", "2 pinches"). */
const ADJECTIVES = new Set(['large', 'medium', 'small', 'whole']);

function pluralize(word: string, amount: number): string {
  if (amount < 2 || ADJECTIVES.has(word) || word.endsWith('s')) return word;
  if (word === 'leaf') return 'leaves';
  if (/(ch|sh|x)$/.test(word)) return `${word}es`;
  return `${word}s`;
}

function formatMetric(value: number, unit: 'g' | 'ml'): { value: string; unit: string } {
  if (value >= 1000) return { value: formatDecimal(value / 1000, 2), unit: unit === 'g' ? 'kg' : 'L' };
  return { value: formatDecimal(roundMetric(value)), unit };
}

/** Quantidade de um item pronta para mostrar: "300 ml", "1,5 kg", "5", "3 cloves", "to taste". */
export function formatItemAmount(item: ShoppingItem): string {
  if (item.quantity === null) return item.label;

  if (item.unit) {
    const min = formatMetric(item.quantity, item.unit);
    if (item.quantityMax === null) return `${min.value} ${min.unit}`;
    const max = formatMetric(item.quantityMax, item.unit);
    return `${min.value} a ${max.value} ${max.unit}`;
  }

  const amount =
    item.quantityMax === null
      ? formatQuantity(item.quantity)
      : `${formatQuantity(item.quantity)} a ${formatQuantity(item.quantityMax)}`;
  const top = item.quantityMax ?? item.quantity;
  return item.label ? `${amount} ${pluralize(item.label, top)}` : amount;
}

/** Texto da lista para compartilhar (RF22): pendentes primeiro, comprados no fim. */
export function formatShoppingList(items: ShoppingItem[]): string {
  const line = (item: ShoppingItem) => `${item.name}: ${formatItemAmount(item)}`;
  const pending = items.filter((item) => !item.checked);
  const checked = items.filter((item) => item.checked);

  const sections = ['Lista de compras (Modo Cozinha)'];
  if (pending.length > 0) sections.push(pending.map((item) => `☐ ${line(item)}`).join('\n'));
  if (checked.length > 0) sections.push(`Já comprados:\n${checked.map((item) => `☑ ${line(item)}`).join('\n')}`);
  if (items.length === 0) sections.push('A lista está vazia.');

  return sections.join('\n\n');
}
