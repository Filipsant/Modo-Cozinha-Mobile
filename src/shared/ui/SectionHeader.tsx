import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';

export interface SectionHeaderProps {
  title: string;
  /** Texto roxo à direita, como "3 sugestões" ou "5 regiões". */
  meta?: string;
  /** headline: "Receitas em Destaque" · overline: "ORIGEM CULINÁRIA". */
  variant?: 'headline' | 'overline';
}

export function SectionHeader({ title, meta, variant = 'headline' }: SectionHeaderProps) {
  const isHeadline = variant === 'headline';

  return (
    <View style={styles.row}>
      <AppText
        accessibilityRole={isHeadline ? 'header' : undefined}
        variant={variant}
        tone={isHeadline ? 'default' : 'muted'}
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </AppText>
      {meta ? (
        <AppText variant="caption" tone="primary">
          {meta}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flexShrink: 1,
  },
});
