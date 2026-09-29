import { AccessibilityInfo, StyleSheet, View } from 'react-native';

import { MAX_SERVINGS, MIN_SERVINGS } from '@/shared/config';
import { useTheme } from '@/shared/theme';
import { AppText, IconButton } from '@/shared/ui';

export interface ServingsControlProps {
  servings: number;
  onChange: (servings: number) => void;
}

/** "Seletor de Porções" do design system: − 4 porções + (RF12, de 1 a 20). */
export function ServingsControl({ servings, onChange }: ServingsControlProps) {
  const { colors, spacing, radius, shadows } = useTheme();

  const change = (next: number) => {
    onChange(next);
    // RNF06: o leitor de tela confirma o novo valor.
    AccessibilityInfo.announceForAccessibility(
      `Receita ajustada para ${next} ${next === 1 ? 'porção' : 'porções'}`,
    );
  };

  return (
    <View
      style={[
        styles.card,
        shadows.card,
        { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 12, gap: spacing.xs },
      ]}
    >
      <AppText variant="caption" tone="muted">
        Porções
      </AppText>
      <View style={styles.row}>
        <IconButton
          icon="remove"
          variant="neutral"
          accessibilityLabel="Diminuir porções"
          disabled={servings <= MIN_SERVINGS}
          onPress={() => change(servings - 1)}
        />
        <AppText variant="headline" style={styles.value} accessibilityLabel={`${servings} porções`}>
          {servings}
        </AppText>
        <IconButton
          icon="add"
          variant="primary"
          accessibilityLabel="Aumentar porções"
          disabled={servings >= MAX_SERVINGS}
          onPress={() => change(servings + 1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    minWidth: 32,
    textAlign: 'center',
  },
});
