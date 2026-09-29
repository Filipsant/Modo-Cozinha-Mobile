import { StyleSheet, Switch, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

import { useUnitSystemStore } from '../model/unitSystemStore';

/** "Sistema de Medidas" do design system: interruptor entre medidas originais e métricas (RF13). */
export function UnitToggle() {
  const { colors, spacing, radius, shadows } = useTheme();
  const system = useUnitSystemStore((state) => state.system);
  const setSystem = useUnitSystemStore((state) => state.setSystem);
  const isMetric = system === 'metric';

  return (
    <View
      style={[
        styles.card,
        shadows.card,
        { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 12, gap: spacing.xs },
      ]}
    >
      <AppText variant="caption" tone="muted">
        Medidas
      </AppText>
      <View style={styles.row}>
        <AppText variant="label" style={styles.label} numberOfLines={2}>
          {isMetric ? 'Métricas (g/ml)' : 'Originais'}
        </AppText>
        <Switch
          value={isMetric}
          onValueChange={(value) => setSystem(value ? 'metric' : 'original')}
          accessibilityLabel="Usar medidas métricas, em gramas e mililitros"
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor={colors.surface}
          ios_backgroundColor={colors.border}
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
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    flexShrink: 1,
  },
});
