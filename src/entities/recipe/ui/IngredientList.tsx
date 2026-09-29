import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

import type { Ingredient } from '../model/recipe.types';

export interface IngredientListProps {
  ingredients: Ingredient[];
  /** Formata a medida nas porções e no sistema escolhidos. Vem de cima: a entity não conhece a feature. */
  formatMeasure: (measure: string) => string;
}

/**
 * Ingredientes: o nome à esquerda e a medida em destaque à direita. Separados, eles não formam frases
 * estranhas em português ("2 dentes alho"), e a medida fica fácil de achar de longe.
 */
export function IngredientList({ ingredients, formatMeasure }: IngredientListProps) {
  const { colors, spacing, radius, shadows } = useTheme();

  return (
    <View style={[styles.card, shadows.card, { backgroundColor: colors.surface, borderRadius: radius.xl }]}>
      {ingredients.map((ingredient, index) => {
        const measure = formatMeasure(ingredient.measure);
        return (
          <View
            key={`${ingredient.name}-${index}`}
            accessible
            accessibilityLabel={measure ? `${ingredient.name}: ${measure}` : ingredient.name}
            style={[
              styles.row,
              { paddingHorizontal: spacing.md, gap: 12 },
              index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: colors.primary, borderRadius: radius.full }]} />
            <AppText variant="body" style={styles.name}>
              {ingredient.name}
            </AppText>
            {measure ? (
              <AppText variant="label" tone="primary" style={styles.measure}>
                {measure}
              </AppText>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 6,
    height: 6,
  },
  name: {
    flex: 1,
  },
  measure: {
    maxWidth: '45%',
    textAlign: 'right',
  },
});
