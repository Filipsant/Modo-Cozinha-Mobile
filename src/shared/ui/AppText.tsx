import { Text, type TextProps } from 'react-native';

import { useTheme, type ColorPalette, type TypographyVariant } from '@/shared/theme';

export type TextTone = 'default' | 'secondary' | 'muted' | 'primary' | 'onPrimary' | 'error' | 'onToast';

const TONE_COLOR: Record<TextTone, keyof ColorPalette> = {
  default: 'text',
  secondary: 'textSecondary',
  muted: 'textMuted',
  primary: 'primaryStrong',
  onPrimary: 'onPrimary',
  error: 'error',
  onToast: 'onToast',
};

export interface AppTextProps extends TextProps {
  /** Estilo do design system: display, title, headline, body, small, label, caption... */
  variant?: TypographyVariant;
  tone?: TextTone;
}

/** Todo texto do app passa por aqui, com a fonte e a cor do tema. */
export function AppText({ variant = 'body', tone = 'default', style, ...props }: AppTextProps) {
  const { colors, typography } = useTheme();

  return <Text {...props} style={[typography[variant], { color: colors[TONE_COLOR[tone]] }, style]} />;
}
