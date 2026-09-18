import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/** Cada teste pode sobrescrever uma resposta com server.use(...), por exemplo para simular erro da API. */
export const server = setupServer(...handlers);
