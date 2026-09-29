import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useApplyThemePreference } from '@/features/theme-switcher';
import { createQueryClient, useRefetchOnAppFocus } from '@/shared/api';
import { useAppFonts, useTheme } from '@/shared/theme';
import { ToastHost } from '@/shared/ui';

const queryClient = createQueryClient();

// A tela de abertura fica até a fonte Plus Jakarta Sans carregar, para o texto não "pular" de fonte.
SplashScreen.preventAutoHideAsync().catch(() => undefined);

/** Raiz do app: fonte, tema salvo, providers, pilha de navegação e o toast. As abas ficam no grupo (tabs). */
export default function RootLayout() {
  useRefetchOnAppFocus();
  useApplyThemePreference();
  const fontsReady = useAppFonts();
  const { colors, scheme } = useTheme();

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="receita/[id]/index" />
        <Stack.Screen name="receita/[id]/cozinhar" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <ToastHost />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </QueryClientProvider>
  );
}
