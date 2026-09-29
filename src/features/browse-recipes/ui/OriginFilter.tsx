import { ScrollView, StyleSheet, View } from 'react-native';

import { ORIGINS } from '@/entities/recipe';
import { useTheme } from '@/shared/theme';
import { Chip, SectionHeader } from '@/shared/ui';

export interface OriginFilterProps {
  selected: string | null;
  onChange: (country: string | null) => void;
}

/** "ORIGEM CULINÁRIA": chips com bandeira que combinam com a categoria (RF09). */
export function OriginFilter({ selected, onChange }: OriginFilterProps) {
  const { spacing } = useTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={{ paddingHorizontal: spacing.md }}>
        <SectionHeader variant="overline" title="Origem culinária" meta={`${ORIGINS.length} regiões`} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityLabel="Origem culinária"
        contentContainerStyle={[styles.row, { gap: spacing.sm, paddingHorizontal: spacing.md }]}
      >
        {ORIGINS.map((origin) => (
          <Chip
            key={origin.country}
            variant="card"
            leading={origin.flag}
            label={origin.label}
            accessibilityLabel={`Culinária ${origin.label}`}
            selected={selected === origin.country}
            onPress={() => onChange(selected === origin.country ? null : origin.country)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    paddingVertical: 4,
  },
});
