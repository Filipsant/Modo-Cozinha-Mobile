import { HttpResponse, http, type RequestHandler } from 'msw';

import { API_BASE_URL, TRANSLATE_API_URL } from '@/shared/config';

import { fixtures } from '../fixtures';

/** Receitas completas por id, para o lookup.php. Qualquer outro id responde { meals: null }. */
const RECIPES_BY_ID: Record<string, unknown> = {
  '52772': fixtures.lookupWithVideo,
  '53481': fixtures.lookupNoVideo,
  '53060': fixtures.lookupSingleBlock,
  '53456': fixtures.lookupFractions,
};

/**
 * Traduções simuladas, tiradas do Google Tradutor de verdade. Textos fora desta lista voltam iguais,
 * então os testes que não falam de tradução continuam vendo o texto da API.
 */
export const FAKE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'en>pt': {
    'Teriyaki Chicken Casserole': 'Caçarola de Frango Teriyaki',
    'soy sauce': 'molho de soja',
    'brown sugar': 'açúcar mascavo',
    'Preheat oven to 350° F. Spray a 9x13-inch baking pan with non-stick spray.':
      'Pré-aqueça o forno a 350° F. Unte uma assadeira de 9x13 polegadas com spray antiaderente.',
  },
  'pt>en': {
    frango: 'chicken',
    'bolo de cenoura': 'carrot cake',
  },
};

/**
 * Respostas simuladas da TheMealDB e do tradutor, usadas por todos os testes.
 * Cada teste pode trocar uma resposta com server.use(...), por exemplo para simular erro.
 */
export const handlers: RequestHandler[] = [
  http.get(`${API_BASE_URL}/lookup.php`, ({ request }) => {
    const id = new URL(request.url).searchParams.get('i') ?? '';
    return HttpResponse.json(RECIPES_BY_ID[id] ?? fixtures.mealsNull);
  }),

  http.get(`${API_BASE_URL}/search.php`, ({ request }) => {
    const term = new URL(request.url).searchParams.get('s') ?? '';
    return HttpResponse.json(
      term.toLowerCase().startsWith('chicken') ? fixtures.searchChicken : fixtures.mealsNull,
    );
  }),

  http.get(`${API_BASE_URL}/random.php`, () => HttpResponse.json(fixtures.lookupWithVideo)),

  http.get(`${API_BASE_URL}/list.php`, () => HttpResponse.json(fixtures.categoriesList)),

  http.get(`${API_BASE_URL}/filter.php`, ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(params.has('c') ? fixtures.filterSeafood : fixtures.filterItaly);
  }),

  http.post(TRANSLATE_API_URL, async ({ request }) => {
    const params = new URL(request.url).searchParams;
    const dictionary = FAKE_TRANSLATIONS[`${params.get('sl')}>${params.get('tl')}`] ?? {};
    const texts = new URLSearchParams(await request.text()).getAll('q');
    return HttpResponse.json(texts.map((text) => dictionary[text] ?? text));
  }),
];
