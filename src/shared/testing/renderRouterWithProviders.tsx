import { QueryClientProvider } from '@tanstack/react-query';
import { renderRouter } from 'expo-router/testing-library';
import type { ComponentType, ReactNode } from 'react';

import { createTestQueryClient } from './renderWithProviders';

/**
 * Monta um app de mentira com as rotas indicadas e o TanStack Query, para testar telas que leem
 * o endereço (?q=, ?porcoes=) e buscam dados. Ex.: renderRouterWithProviders({ index: HomeScreen }, '/').
 */
export function renderRouterWithProviders(routes: Record<string, ComponentType>, initialUrl: string) {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderRouter(routes, { initialUrl, wrapper });
}
