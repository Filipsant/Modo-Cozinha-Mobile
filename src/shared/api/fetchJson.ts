/** Erro de HTTP com o status, para a tela diferenciar "não encontrada" (404) de "erro de rede". */
export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/** Único lugar do app que chama fetch. Devolve unknown: quem chama valida com Zod. */
export async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new HttpError(response.status, `A requisição falhou com status ${response.status}`);
  }

  return response.json();
}
