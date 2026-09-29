import type { ReactNode } from 'react';

import { AppText } from './AppText';

export interface ParagraphProps {
  children: ReactNode;
}

/** Texto de apoio (14/20, cinza secundário), como "Toques ampliados para mãos ocupadas na bancada." */
export function Paragraph({ children }: ParagraphProps) {
  return (
    <AppText variant="small" tone="secondary">
      {children}
    </AppText>
  );
}
