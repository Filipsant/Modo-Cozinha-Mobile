import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet } from 'react-native';

import { recipeQueries, sortCategories, translateCategory } from '@/entities/recipe';
import { useTheme } from '@/shared/theme';
import { Chip } from '@/shared/ui';

export interface CategoryFilterProps {
  selected: string | null;
  onChange: (category: string | null) => void;
}

/** Chips de categoria em rolagem horizontal (RF08). "Todos" limpa o filtro; tocar no selecionado também. */
export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { spacing } = useTheme();
  const { data: categories = [] } = useQuery(recipeQueries.categories());

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel="Categorias"
      contentContainerStyle={[styles.row, { gap: spacing.sm, paddingHorizontal: spacing.md }]}
    >
      <Chip label="Todos" selected={selected === null} onPress={() => onChange(null)} />
      {sortCategories(categories).map((category) => (
        <Chip
          key={category}
          label={translateCategory(category)}
          selected={selected === category}
          onPress={() => onChange(selected === category ? null : category)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    // Espaço para a sombra e a área de toque extra dos chips.
    paddingVertical: 4,
  },
});
