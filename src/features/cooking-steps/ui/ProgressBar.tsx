import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

export interface ProgressBarProps {
  current: number;
  total: number;
}

/** "Passo 3 de 8" com a barra de progresso (RF15). */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const { colors, radius, spacing } = useTheme();
  const progress = total > 0 ? current / total : 0;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`Passo ${current} de ${total}`}
      accessibilityValue={{ min: 1, max: total, now: current }}
      style={{ gap: spacing.sm }}
    >
      <AppText variant="label" tone="primary">
        Passo {current} de {total}
      </AppText>
      <View style={[styles.track, { backgroundColor: colors.surfaceVariant, borderRadius: radius.full }]}>
        <View
          style={[
            styles.fill,
            { width: `${progress * 100}%`, backgroundColor: colors.primary, borderRadius: radius.full },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
