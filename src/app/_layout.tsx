import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { createQueryClient, useRefetchOnAppFocus } from '@/shared/api';

const queryClient = createQueryClient();

/** Raiz do app: providers + pilha de navegação. As abas ficam no grupo (tabs). */
export default function RootLayout() {
  useRefetchOnAppFocus();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="receita/[id]/index" options={{ title: 'Receita' }} />
        <Stack.Screen
          name="receita/[id]/cozinhar"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
