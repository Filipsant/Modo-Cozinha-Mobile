import { Pressable, StyleSheet, View } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

export interface ErrorMessageProps {
  title: string;
  description: string;
  onRetry: () => void;
}

/** Faixa de erro do design system ("Falha ao sincronizar") com o botão "Tentar de novo" (RNF14). */
export function ErrorMessage({ title, description, onRetry }: ErrorMessageProps) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View
      accessibilityRole="alert"
      style={{ backgroundColor: colors.errorContainer, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md }}
    >
      <View style={[styles.row, { gap: 12 }]}>
        <Icon name="cloudOff" color={colors.onErrorContainer} />
        <View style={styles.texts}>
          <AppText variant="label" style={{ color: colors.onErrorContainer }}>
            {title}
          </AppText>
          <AppText variant="small" style={{ color: colors.onErrorContainer }}>
            {description}
          </AppText>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tentar de novo"
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retry,
          { backgroundColor: colors.surface, borderRadius: radius.md, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <AppText style={[typography.label, { color: colors.error }]}>Tentar de novo</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  retry: {
    alignSelf: 'flex-end',
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
