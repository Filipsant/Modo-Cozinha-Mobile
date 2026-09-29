import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePendingCount } from '@/features/shopping-list';
import { useTheme } from '@/shared/theme';
import { AppBar, Icon } from '@/shared/ui';

/**
 * Barra de abas inferior do Figma (node 1:875): Início, Favoritos e Lista, com o contador de itens
 * pendentes da lista de compras. O cabeçalho com o logo é o mesmo nas três abas.
 */
export default function TabsLayout() {
  const { colors, typography } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const pendingCount = usePendingCount();

  return (
    <Tabs
      screenOptions={{
        header: () => <AppBar title="Modo Cozinha" />,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primaryStrong,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 64 + bottom,
          paddingTop: 6,
          backgroundColor: colors.background,
          borderTopWidth: 0,
          shadowColor: '#191C1F',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: { ...typography.caption, marginTop: 2 },
        tabBarBadgeStyle: {
          ...typography.badge,
          backgroundColor: colors.primary,
          color: colors.onPrimary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: ({ color }) => <Icon name="restaurant" color={color} /> }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{ title: 'Favoritos', tabBarIcon: ({ color }) => <Icon name="favorite" color={color} /> }}
      />
      <Tabs.Screen
        name="lista-de-compras"
        options={{
          title: 'Lista',
          tabBarAccessibilityLabel:
            pendingCount > 0 ? `Lista de compras, ${pendingCount} itens pendentes` : 'Lista de compras',
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
          tabBarIcon: ({ color }) => <Icon name="checklist" color={color} />,
        }}
      />
    </Tabs>
  );
}
