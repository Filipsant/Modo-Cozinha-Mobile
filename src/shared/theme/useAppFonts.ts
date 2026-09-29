import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { useFonts } from 'expo-font';

import { fontFamily } from './tokens';

/**
 * Carrega os 4 pesos da Plus Jakarta Sans usados no design.
 * Devolve true quando pode desenhar: fontes carregadas ou, se falharem, com a fonte do sistema.
 */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    [fontFamily.regular]: PlusJakartaSans_400Regular,
    [fontFamily.medium]: PlusJakartaSans_500Medium,
    [fontFamily.semibold]: PlusJakartaSans_600SemiBold,
    [fontFamily.bold]: PlusJakartaSans_700Bold,
  });

  return loaded || error !== null;
}
