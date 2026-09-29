import { CATEGORY_LABELS, EXTRA_COUNTRY_LABELS, ORIGINS } from '../model/labels';

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

/** "Seafood" → "Frutos do Mar". Categoria desconhecida aparece como veio da API. */
export function translateCategory(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

/** "Italy" → "Italiana". País desconhecido aparece como veio da API. */
export function translateOrigin(country: string): string {
  const origin = ORIGINS.find((item) => item.country === country);
  return origin?.label ?? EXTRA_COUNTRY_LABELS[country] ?? country;
}

/** Ordena as categorias na ordem do Figma; as desconhecidas vão para o fim, em ordem alfabética. */
export function sortCategories(categories: string[]): string[] {
  const rank = (category: string) => {
    const index = CATEGORY_ORDER.indexOf(category);
    return index === -1 ? CATEGORY_ORDER.length : index;
  };

  return [...categories].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}
