import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { COOKING_MIN_FONT_SIZE, useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

export interface StepViewProps {
  step: string;
  number: number;
  /** Botões de timer do passo, vindos de outra feature (kitchen-timers) pela tela. */
  children?: ReactNode;
}

/** Um passo por vez, com fonte de pelo menos 24 px para ler de longe na bancada (RNF08). */
export function StepView({ step, number, children }: StepViewProps) {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing.lg }}>
      <AppText
        accessibilityRole="header"
        variant="display"
        style={styles.step}
        accessibilityLabel={`Passo ${number}. ${step}`}
      >
        {step}
      </AppText>
      {children ? <View style={[styles.actions, { gap: spacing.sm }]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    fontSize: Math.max(COOKING_MIN_FONT_SIZE, 26),
    lineHeight: 36,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
