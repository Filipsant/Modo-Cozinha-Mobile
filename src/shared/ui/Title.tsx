import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import type { TypographyVariant } from '@/shared/theme';

import { AppText } from './AppText';

export interface TitleProps {
  children: ReactNode;
  /** "title" (24) para o título da tela; "headline" (20) para seções e cards. */
  variant?: Extract<TypographyVariant, 'display' | 'title' | 'headline'>;
  style?: StyleProp<TextStyle>;
}

/** Título. accessibilityRole="header" faz o TalkBack e o VoiceOver o anunciarem como título. */
export function Title({ children, variant = 'title', style }: TitleProps) {
  return (
    <AppText accessibilityRole="header" variant={variant} style={style}>
      {children}
    </AppText>
  );
}
