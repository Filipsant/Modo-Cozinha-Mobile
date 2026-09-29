import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';

export interface TagProps {
  label: string;
  /** primary: roxo claro (origem) · neutral: cinza (categoria). */
  tone?: 'primary' | 'neutral';
}

/** Etiqueta pequena dos cards, como "Italiana" e "Beef". */
export function Tag({ label, tone = 'neutral' }: TagProps) {
  const { colors, radius } = useTheme();
  const isPrimary = tone === 'primary';

  return (
    <View
      style={[
        styles.tag,
        { borderRadius: radius.sm, backgroundColor: isPrimary ? colors.tag : colors.surfaceVariant },
      ]}
    >
      <AppText
        variant="caption"
        style={{ color: isPrimary ? colors.onTag : colors.textSecondary }}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
