import { Pressable, StyleSheet, View } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';
import { AppText, Icon } from '@/shared/ui';

export interface KitchenTipProps {
  onClose: () => void;
}

/** "Dica da Bancada": cartão flutuante do Figma (node 1:847), no canto inferior direito. */
export function KitchenTip({ onClose }: KitchenTipProps) {
  const { colors, spacing, radius, shadows } = useTheme();

  return (
    <View
      accessibilityRole="summary"
      style={[
        styles.card,
        shadows.floating,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          padding: 12,
          gap: 10,
          right: spacing.md,
          bottom: spacing.md,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.primaryContainer, borderRadius: radius.full }]}>
        <Icon name="tips" color={colors.onPrimaryContainer} />
      </View>
      <View style={styles.texts}>
        <AppText variant="label" style={styles.heading}>
          Dica da Bancada
        </AppText>
        <AppText variant="small" tone="secondary" style={styles.body}>
          Toque no modo cozinha para botões extragrandes!
        </AppText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar dica"
        onPress={onClose}
        hitSlop={14}
        style={styles.close}
      >
        <Icon name="close" color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    maxWidth: 220,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flexShrink: 1,
    gap: 1,
  },
  heading: {
    lineHeight: 18,
  },
  body: {
    lineHeight: 17.5,
  },
  close: {
    minWidth: MIN_TOUCH_TARGET / 2,
    minHeight: MIN_TOUCH_TARGET / 2,
    alignItems: 'center',
    paddingTop: 2,
  },
});
