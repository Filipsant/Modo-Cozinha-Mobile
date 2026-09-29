import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

import { recipeQueries, type RecipeSummary } from '@/entities/recipe';
import { SEARCH_DEBOUNCE_MS } from '@/shared/config';
import { useDebounce } from '@/shared/lib';

import { browseQueries } from '../api/browse.queries';
import { resolveQuery, type BrowseParams, type BrowseStrategy } from '../lib/resolveQuery';

export interface RecipeResults {
  strategy: BrowseStrategy;
  recipes: RecipeSummary[] | undefined;
  isPending: boolean;
  isError: boolean;
  isRefetching: boolean;
  refetch: () => void;
}

/** "12 receitas encontradas" / "1 receita encontrada" / "Nenhuma receita encontrada". */
export function describeCount(count: number): string {
  if (count === 0) return 'Nenhuma receita encontrada';
  return count === 1 ? '1 receita encontrada' : `${count} receitas encontradas`;
}

/**
 * Escolhe a consulta pela combinação de busca e filtros. A busca espera 400 ms sem digitar (RF01), e o
 * TanStack Query cancela a requisição anterior quando a chave muda.
 */
export function useRecipeResults({ term, category, country }: BrowseParams): RecipeResults {
  const debouncedTerm = useDebounce(term, SEARCH_DEBOUNCE_MS);
  const strategy = resolveQuery({ term: debouncedTerm, category, country });
  const isFeatured = strategy.kind === 'featured';

  const featured = useQuery({ ...recipeQueries.featured(), enabled: isFeatured });
  const browse = useQuery({
    ...browseQueries.results(strategy.kind === 'featured' ? { kind: 'search', term: '', category, country } : strategy),
    enabled: !isFeatured,
  });

  const active = isFeatured ? featured : browse;
  const count = isFeatured ? undefined : browse.data?.length;

  // RNF06: anuncia a quantidade para o TalkBack e o VoiceOver quando um resultado novo chega.
  useEffect(() => {
    if (count !== undefined) AccessibilityInfo.announceForAccessibility(describeCount(count));
  }, [count, browse.dataUpdatedAt]);

  return {
    strategy,
    recipes: active.data,
    isPending: active.isPending,
    isError: active.isError,
    isRefetching: active.isRefetching,
    refetch: () => void active.refetch(),
  };
}
