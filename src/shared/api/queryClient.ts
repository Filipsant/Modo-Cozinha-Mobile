import { QueryClient, focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';

const FIVE_MINUTES = 5 * 60 * 1000;

/** Cada query define o próprio staleTime; este é o padrão (busca e filtros). */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: FIVE_MINUTES,
        retry: 1,
      },
    },
  });
}

/**
 * No navegador o TanStack Query percebe sozinho quando a aba volta a ficar visível.
 * No celular é preciso avisá-lo quando o app volta do segundo plano.
 */
export function useRefetchOnAppFocus(): void {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });

    return () => subscription.remove();
  }, []);
}
