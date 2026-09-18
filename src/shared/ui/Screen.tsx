import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

export interface ScreenProps {
  children: ReactNode;
  /**
   * Bordas que precisam desviar do notch e das barras do sistema.
   * Telas com cabeçalho nativo não precisam; as abas precisam de 'top'; o modo cozinha, em tela cheia, de todas.
   */
  edges?: Edge[];
}

export function Screen({ children, edges = [] }: ScreenProps) {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: colors.background, padding: spacing.md, gap: spacing.md }]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
