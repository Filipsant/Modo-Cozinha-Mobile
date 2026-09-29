import { parseMeasure, scaleMeasure, toBaseMetric } from '@/entities/measure';
import type { Recipe } from '@/entities/recipe';

import { normalizeName } from './normalizeName';

export interface ShoppingItemSource {
  id: string;
  name: string;
}

export interface ShoppingItem {
  /** Nome normalizado + unidade: dois itens com a mesma chave são somados. */
  key: string;
  /** Nome como apareceu na primeira receita. */
  name: string;
  quantity: number | null;
  quantityMax: number | null;
  /** g ou ml para peso e volume; null para itens contados ou só texto. */
  unit: 'g' | 'ml' | null;
  /** Palavra de contagem ("cloves", "large") ou o texto sem número ("to taste"). */
  label: string;
  checked: boolean;
  /** De quais receitas o item veio (para a lista agrupada por receita). */
  sources: ShoppingItemSource[];
}

/**
 * Palavras de contagem que definem "a mesma unidade" para itens sem peso ou volume.
 * O que não está aqui é modo de preparo ("beaten", "chopped") e é ignorado na soma.
 */
const COUNT_WORDS = new Set([
  'bag',
  'bottle',
  'box',
  'bulb',
  'bunch',
  'can',
  'clove',
  'dash',
  'drop',
  'fillet',
  'handful',
  'head',
  'jar',
  'knob',
  'large',
  'leaf',
  'leave',
  'medium',
  'pack',
  'package',
  'packet',
  'piece',
  'pinch',
  'pod',
  'rasher',
  'shank',
  'slice',
  'small',
  'sprig',
  'stalk',
  'stick',
  'strip',
  'tin',
  'tub',
  'whole',
  'yolk',
]);

function countWordOf(rest: string): string {
  const [first = ''] = rest.split(' ');
  return COUNT_WORDS.has(normalizeName(first)) ? first.toLowerCase() : '';
}

function sumOptional(a: number | null, b: number | null): number | null {
  return a === null && b === null ? null : (a ?? 0) + (b ?? 0);
}

function addSource(sources: ShoppingItemSource[], source: ShoppingItemSource): ShoppingItemSource[] {
  return sources.some((item) => item.id === source.id) ? sources : [...sources, source];
}

/** Um ingrediente da receita vira um item da lista, já escalado e convertido para g ou ml. */
function toItem(name: string, measure: string, factor: number, source: ShoppingItemSource): ShoppingItem {
  const normalized = normalizeName(name);
  const base = toBaseMetric(scaleMeasure(parseMeasure(measure), factor));
  const common = { name, checked: false, sources: [source] };

  if (base.quantity === null) {
    return {
      ...common,
      key: `${normalized}|texto:${base.rest.toLowerCase()}`,
      quantity: null,
      quantityMax: null,
      unit: null,
      label: base.rest,
    };
  }

  if (base.unit === 'g' || base.unit === 'ml') {
    return {
      ...common,
      key: `${normalized}|${base.unit}`,
      quantity: base.quantity,
      quantityMax: base.quantityMax,
      unit: base.unit,
      label: '',
    };
  }

  const countWord = countWordOf(base.rest);
  return {
    ...common,
    key: `${normalized}|conta:${normalizeName(countWord)}`,
    quantity: base.quantity,
    // Faixa em itens contados ("1-2 cloves") soma o máximo à parte.
    quantityMax: base.quantityMax,
    unit: null,
    label: countWord,
  };
}

/**
 * Soma os ingredientes da receita na lista (RF19 e RF20). Mesmo nome e mesma unidade somam;
 * unidades diferentes ficam em linhas separadas. Um item já comprado volta a ficar pendente
 * quando recebe mais quantidade.
 */
export function addRecipeToList(items: ShoppingItem[], recipe: Recipe, factor: number): ShoppingItem[] {
  const source = { id: recipe.id, name: recipe.name };
  const result = [...items];

  for (const ingredient of recipe.ingredients) {
    const item = toItem(ingredient.name, ingredient.measure, factor, source);
    const index = result.findIndex((existing) => existing.key === item.key);
    const existing = result[index];

    if (!existing) {
      result.push(item);
      continue;
    }

    const isTextOnly = item.quantity === null;
    result[index] = {
      ...existing,
      quantity: isTextOnly ? existing.quantity : sumOptional(existing.quantity, item.quantity),
      quantityMax:
        existing.quantityMax === null && item.quantityMax === null
          ? null
          : (existing.quantityMax ?? existing.quantity ?? 0) + (item.quantityMax ?? item.quantity ?? 0),
      checked: isTextOnly ? existing.checked : false,
      sources: addSource(existing.sources, source),
    };
  }

  return result;
}
