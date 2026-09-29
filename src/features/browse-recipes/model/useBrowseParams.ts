import { useLocalSearchParams, useRouter } from 'expo-router';

import type { BrowseParams } from '../lib/resolveQuery';

export interface BrowseParamsState extends BrowseParams {
  setTerm: (term: string) => void;
  setCategory: (category: string | null) => void;
  setCountry: (country: string | null) => void;
  clearAll: () => void;
}

type RouteParams = { q?: string; categoria?: string; origem?: string };

/**
 * Busca e filtros moram nos parâmetros da rota (RF04 e RF08): /?q=chicken&categoria=Seafood&origem=Italy.
 * Sobrevivem ao voltar de uma receita e podem ser compartilhados por link (modocozinha://?categoria=Dessert).
 */
export function useBrowseParams(): BrowseParamsState {
  const { q, categoria, origem } = useLocalSearchParams<RouteParams>();
  const router = useRouter();

  // setParams troca o valor sem empilhar uma tela nova a cada letra digitada.
  const update = (params: RouteParams) => router.setParams(params);

  return {
    term: q ?? '',
    category: categoria || null,
    country: origem || null,
    setTerm: (term) => update({ q: term || undefined }),
    setCategory: (category) => update({ categoria: category ?? undefined }),
    setCountry: (country) => update({ origem: country ?? undefined }),
    clearAll: () => update({ q: undefined, categoria: undefined, origem: undefined }),
  };
}
