import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

export interface StepListProps {
  steps: string[];
}

/** Prévia do modo de preparo na página da receita: passos numerados. */
export function StepList({ steps }: StepListProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View style={{ gap: spacing.md }}>
      {steps.map((step, index) => (
        <View key={index} style={[styles.row, { gap: 12 }]}>
          <View
            style={[styles.number, { backgroundColor: colors.primaryContainer, borderRadius: radius.full }]}
          >
            <AppText variant="label" style={{ color: colors.onPrimaryContainer }}>
              {index + 1}
            </AppText>
          </View>
          <AppText
            variant="body"
            tone="secondary"
            style={styles.text}
            accessibilityLabel={`Passo ${index + 1}. ${step}`}
          >
            {step}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  number: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
});
