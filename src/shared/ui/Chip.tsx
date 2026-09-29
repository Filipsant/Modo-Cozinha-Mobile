import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';

export interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Emoji ou texto curto antes do rótulo, como a bandeira da origem culinária. */
  leading?: string;
  /**
   * pill: chips de categoria (cinza, roxo quando selecionado).
   * card: chips de origem (cartão branco com sombra, borda roxa quando selecionado).
   */
  variant?: 'pill' | 'card';
  accessibilityLabel?: string;
}

/** Chip selecionável. O estado "selected" é anunciado pelo leitor de tela e testável com toBeSelected(). */
export function Chip({ label, selected, onPress, leading, variant = 'pill', accessibilityLabel }: ChipProps) {
  const { colors, spacing, radius, shadows } = useTheme();
  const isPill = variant === 'pill';

  const backgroundColor = isPill
    ? selected
      ? colors.primary
      : colors.surfaceVariant
    : selected
      ? colors.primaryContainer
      : colors.surface;
  const textColor = isPill
    ? selected
      ? colors.onPrimary
      : colors.textSecondary
    : selected
      ? colors.onPrimaryContainer
      : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      onPress={onPress}
      // 36 px de altura visível + 4 px de cada lado = 44 px de área de toque.
      hitSlop={{ top: 4, bottom: 4 }}
      style={({ pressed }) => [
        styles.base,
        (!isPill || selected) && shadows.card,
        {
          backgroundColor,
          borderRadius: isPill ? radius.full : radius.lg,
          paddingHorizontal: isPill ? spacing.md : 14,
          gap: 6,
          borderColor: !isPill && selected ? colors.primary : 'transparent',
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {leading ? (
        <AppText variant="label" importantForAccessibility="no" accessibilityElementsHidden>
          {leading}
        </AppText>
      ) : null}
      <AppText variant="label" style={{ color: textColor }} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1.5,
  },
});
