import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { COOKING_TOUCH_TARGET, useTheme, type ColorPalette } from '@/shared/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import type { IconName } from './icons/registry';

export type ButtonVariant = 'primary' | 'tonal' | 'neutral' | 'ghost' | 'danger';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  /** primary: ação principal · tonal: roxo claro · neutral: cinza · ghost: só texto · danger: vermelho. */
  variant?: ButtonVariant;
  /** md: 48 px (navegação) · lg: 64 px (modo cozinha, mãos molhadas) · sm: 36 px. */
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  /** Nome para o leitor de tela, quando o rótulo visível não basta. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_COLORS: Record<
  ButtonVariant,
  { background: keyof ColorPalette | null; text: keyof ColorPalette }
> = {
  primary: { background: 'primary', text: 'onPrimary' },
  tonal: { background: 'primaryContainer', text: 'onPrimaryContainer' },
  neutral: { background: 'surfaceVariant', text: 'textSecondary' },
  ghost: { background: null, text: 'primaryStrong' },
  danger: { background: 'error', text: 'onPrimary' },
};

const HEIGHT = { sm: 36, md: 48, lg: COOKING_TOUCH_TARGET } as const;

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  accessibilityLabel,
  accessibilityHint,
  style,
}: ButtonProps) {
  const { colors, spacing, radius, shadows, scheme } = useTheme();
  const palette = VARIANT_COLORS[variant];
  const isInactive = disabled || loading;
  const textColor =
    variant === 'danger' && scheme === 'dark' ? colors.onErrorContainer : colors[palette.text];
  const backgroundColor =
    variant === 'danger' && scheme === 'dark'
      ? colors.errorContainer
      : palette.background
        ? colors[palette.background]
        : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      onPress={onPress}
      hitSlop={size === 'sm' ? 4 : undefined}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && shadows.card,
        {
          minHeight: HEIGHT[size],
          backgroundColor,
          borderRadius: size === 'lg' ? radius.lg : radius.full,
          paddingHorizontal: size === 'sm' ? spacing.md : spacing.lg,
          opacity: isInactive ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={[styles.content, { gap: spacing.sm }]}>
          {icon ? <Icon name={icon} color={textColor} scale={size === 'lg' ? 1.3 : 1} /> : null}
          <AppText
            variant={size === 'sm' ? 'label' : 'bodyStrong'}
            style={[{ color: textColor }, size === 'lg' && styles.largeLabel]}
            numberOfLines={1}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeLabel: {
    fontSize: 20,
    lineHeight: 28,
  },
});
