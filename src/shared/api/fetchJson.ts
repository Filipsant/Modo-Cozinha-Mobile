/** Erro de HTTP com o status, para a tela diferenciar "não encontrada" (404) de "erro de rede". */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Método, corpo e cabeçalhos para requisições que não são um GET simples (ex.: a tradução, por POST). */
export type FetchJsonInit = Pick<RequestInit, 'method' | 'body' | 'headers'>;

/** Único lugar do app que chama fetch. Devolve unknown: quem chama valida com Zod. */
export async function fetchJson(url: string, signal?: AbortSignal, init?: FetchJsonInit): Promise<unknown> {
  const response = await fetch(url, { ...init, signal });

  if (!response.ok) {
    throw new HttpError(response.status, `A requisição falhou com status ${response.status}`);
  }

  return response.json();
}
