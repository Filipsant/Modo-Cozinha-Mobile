import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from './icons/registry';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
}

/** Estado vazio do design system: ícone, título, texto e uma ação opcional. */
export function EmptyState({
  title,
  description,
  icon = 'searchOff',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceMuted,
          borderRadius: radius.xl,
          padding: spacing.lg,
          gap: spacing.sm,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.surface, borderRadius: radius.full }]}>
        <Icon name={icon} color={colors.textSecondary} />
      </View>
      <AppText accessibilityRole="header" variant="bodyStrong" style={styles.center}>
        {title}
      </AppText>
      <AppText variant="small" tone="secondary" style={styles.center}>
        {description}
      </AppText>
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="neutral"
          size="sm"
          style={{ marginTop: spacing.sm }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  icon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  center: {
    textAlign: 'center',
  },
});
