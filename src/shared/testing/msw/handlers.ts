import { HttpResponse, http, type RequestHandler } from 'msw';

import { API_BASE_URL } from '@/shared/config';

import { fixtures } from '../fixtures';

/** Receitas completas por id, para o lookup.php. Qualquer outro id responde { meals: null }. */
const RECIPES_BY_ID: Record<string, unknown> = {
  '52772': fixtures.lookupWithVideo,
  '53481': fixtures.lookupNoVideo,
  '53060': fixtures.lookupSingleBlock,
  '53456': fixtures.lookupFractions,
};

/**
 * Respostas simuladas da TheMealDB, usadas por todos os testes.
 * Cada teste pode trocar uma resposta com server.use(...), por exemplo para simular erro.
 */
export const handlers: RequestHandler[] = [
  http.get(`${API_BASE_URL}/lookup.php`, ({ request }) => {
    const id = new URL(request.url).searchParams.get('i') ?? '';
    return HttpResponse.json(RECIPES_BY_ID[id] ?? fixtures.mealsNull);
  }),

  http.get(`${API_BASE_URL}/search.php`, ({ request }) => {
    const term = new URL(request.url).searchParams.get('s') ?? '';
    return HttpResponse.json(term.toLowerCase().startsWith('chicken') ? fixtures.searchChicken : fixtures.mealsNull);
  }),

  http.get(`${API_BASE_URL}/random.php`, () => HttpResponse.json(fixtures.lookupWithVideo)),

  http.get(`${API_BASE_URL}/list.php`, () => HttpResponse.json(fixtures.categoriesList)),

  http.get(`${API_BASE_URL}/filter.php`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(params.has('c') ? fixtures.filterSeafood : fixtures.filterItaly);
  }),
];
