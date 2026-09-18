import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

/** Um QueryClient novo por teste, sem novas tentativas, para os testes de erro não esperarem. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
    },
  });
}

/** Renderiza um componente com os providers do app. Use no lugar do render da Testing Library. */
export function renderWithProviders(ui: ReactElement, queryClient: QueryClient = createTestQueryClient()) {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}
