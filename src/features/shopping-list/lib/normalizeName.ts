/** Plural simples em inglês, na última palavra: eggs → egg, tomatoes → tomato, berries → berry. */
function singularize(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.endsWith('oes')) return word.slice(0, -2);
  if (/(ches|shes|xes)$/.test(word)) return word.slice(0, -2);
  if (word.endsWith('s') && !/(ss|us|is)$/.test(word)) return word.slice(0, -1);
  return word;
}

/**
 * Chave para comparar ingredientes de receitas diferentes antes de somar:
 * minúsculas, sem espaços extras e sem plural simples ("Eggs" e "egg" viram o mesmo item).
 */
export function normalizeName(name: string): string {
  const words = name.toLowerCase().trim().replace(/\s+/g, ' ').split(' ');
  const last = words.pop() ?? '';
  return [...words, singularize(last)].join(' ');
}
