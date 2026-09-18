import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

export interface TitleProps {
  children: ReactNode;
}

/** Título da tela. accessibilityRole="header" faz o TalkBack e o VoiceOver o anunciarem como título. */
export function Title({ children }: TitleProps) {
  const { colors, fontSize } = useTheme();

  return (
    <Text accessibilityRole="header" style={[styles.title, { color: colors.text, fontSize: fontSize.xxl }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
  },
});
