import { Tabs } from 'expo-router/js-tabs';

import { useTheme } from '@/shared/theme';

/**
 * Barra de abas inferior: substitui o cabeçalho de navegação da versão web.
 * Sem cabeçalho nativo: cada tela mostra o próprio título grande.
 */
export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary }}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="lista-de-compras" options={{ title: 'Lista de compras' }} />
    </Tabs>
  );
}
