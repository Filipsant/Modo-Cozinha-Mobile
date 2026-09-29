import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { COOKING_TOUCH_TARGET, MIN_TOUCH_TARGET, useTheme, type ColorPalette } from '@/shared/theme';

import { Icon } from './Icon';
import type { IconName } from './icons/registry';

export type IconButtonVariant = 'plain' | 'neutral' | 'tonal' | 'primary' | 'overlay';

export interface IconButtonProps {
  icon: IconName;
  /** Obrigatório: um botão só com ícone precisa de um nome para o leitor de tela. */
  accessibilityLabel: string;
  onPress: () => void;
  /** plain: sem fundo · neutral: cinza · tonal: roxo claro · primary: roxo · overlay: branco sobre fotos. */
  variant?: IconButtonVariant;
  /** md: 44 px (padrão WCAG) · lg: 48 px · xl: 64 px (modo cozinha). */
  size?: 'md' | 'lg' | 'xl';
  /** Cor do ícone, quando for diferente da cor do texto da variante (ex.: coração vermelho). */
  iconColor?: string;
  /** Para botões que ligam e desligam algo (favoritar). */
  selected?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_COLORS: Record<
  IconButtonVariant,
  { background: keyof ColorPalette | null; icon: keyof ColorPalette }
> = {
  plain: { background: null, icon: 'textSecondary' },
  neutral: { background: 'surfaceVariant', icon: 'textSecondary' },
  tonal: { background: 'primaryContainer', icon: 'onPrimaryContainer' },
  primary: { background: 'primary', icon: 'onPrimary' },
  overlay: { background: 'overlay', icon: 'textSecondary' },
};

const SIZE = { md: MIN_TOUCH_TARGET, lg: 48, xl: COOKING_TOUCH_TARGET } as const;

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'plain',
  size = 'md',
  iconColor,
  selected,
  disabled = false,
  accessibilityHint,
  style,
}: IconButtonProps) {
  const { colors, radius, shadows } = useTheme();
  const palette = VARIANT_COLORS[variant];
  const dimension = SIZE[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'overlay' && shadows.card,
        {
          width: dimension,
          height: dimension,
          borderRadius: radius.full,
          backgroundColor: palette.background ? colors[palette.background] : 'transparent',
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Icon name={icon} color={iconColor ?? colors[palette.icon]} scale={size === 'xl' ? 1.3 : 1} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
