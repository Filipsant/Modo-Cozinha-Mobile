/**
 * Termos de cozinha que o tradutor erra sem contexto ("massa" vira "mass", e não "pasta").
 * A TheMealDB só entende inglês, então a busca em português passa por aqui ou pelo tradutor.
 */
const SEARCH_TERM_OVERRIDES: Record<string, string> = {
  massa: 'pasta',
  massas: 'pasta',
  macarrão: 'pasta',
  macarrao: 'pasta',
  carne: 'beef',
  'carne moída': 'mince',
  bolo: 'cake',
  torta: 'pie',
  sopa: 'soup',
  peixe: 'fish',
  porco: 'pork',
  frango: 'chicken',
  sobremesa: 'dessert',
};

/** Tradução fixa para o termo, ou null para usar o tradutor automático. */
export function searchTermOverride(term: string): string | null {
  return SEARCH_TERM_OVERRIDES[term.trim().toLowerCase()] ?? null;
}

/** Junta os resultados de várias buscas sem repetir receitas, na ordem em que chegaram. */
export function mergeById<T extends { id: string }>(...lists: T[][]): T[] {
  const byId = new Map<string, T>();
  for (const item of lists.flat()) {
    if (!byId.has(item.id)) byId.set(item.id, item);
  }
  return [...byId.values()];
}
