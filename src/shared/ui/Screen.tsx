import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

export interface ScreenProps {
  children: ReactNode;
  /**
   * Bordas que precisam desviar do notch e das barras do sistema.
   * Telas com cabeçalho (abas e detalhe) não precisam; o modo cozinha, em tela cheia, precisa de todas.
   */
  edges?: Edge[];
  /** Espaçamento interno de 16. Desligue quando a tela tiver uma lista que rola até a borda. */
  padded?: boolean;
}

/** O "fundo" de toda tela: cor do tema e área segura. */
export function Screen({ children, edges = [], padded = true }: ScreenProps) {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.container,
        { backgroundColor: colors.background },
        padded && { padding: spacing.md, gap: spacing.md },
      ]}
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
