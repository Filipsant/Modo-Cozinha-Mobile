import type { RequestHandler } from 'msw';

/**
 * Respostas simuladas da TheMealDB, usadas por todos os testes.
 * Na Etapa 2 entram aqui os handlers de search.php, lookup.php etc., respondendo com os JSON de ../fixtures.
 */
export const handlers: RequestHandler[] = [];
