import type { ReactNode } from 'react';
import { Text } from 'react-native';

import { useTheme } from '@/shared/theme';

export interface ParagraphProps {
  children: ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  const { colors, fontSize } = useTheme();

  return <Text style={{ color: colors.textSecondary, fontSize: fontSize.md }}>{children}</Text>;
}
