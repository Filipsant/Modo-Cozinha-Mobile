/** TheMealDB com a chave de teste 1, liberada para uso educacional. */
export const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/** A API não informa o rendimento; a receita base é considerada para 4 porções. */
export const BASE_SERVINGS = 4;
export const MIN_SERVINGS = 1;
export const MAX_SERVINGS = 20;

export const SEARCH_DEBOUNCE_MS = 400;

/** Quantas sugestões aparecem em "Receitas em Destaque" antes de buscar (o Figma mostra 3). */
export const FEATURED_RECIPES_COUNT = 3;

/**
 * Tradução automática das receitas (a TheMealDB só tem inglês). Serviço gratuito e sem chave do Google
 * Tradutor, que aceita vários textos por requisição. Veja o ADR 011.
 */
export const TRANSLATE_API_URL = 'https://translate.googleapis.com/translate_a/t';
export const RECIPE_LANGUAGE = 'en';
export const APP_LANGUAGE = 'pt';

/** Prefixo obrigatório das chaves dos stores persistidos. */
export const STORAGE_PREFIX = 'modo-cozinha:';
