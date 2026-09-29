import { Image } from 'expo-image';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';

import {
  IngredientList,
  splitSteps,
  translateCategory,
  translateOrigin,
  type Recipe,
} from '@/entities/recipe';
import { ServingsControl, UnitToggle, type ServingsState } from '@/features/adjust-measures';
import { AddToListButton } from '@/features/shopping-list';
import { useTheme } from '@/shared/theme';
import { AppText, Button, SectionHeader, Tag, Title } from '@/shared/ui';

import { StepList } from './StepList';

export interface RecipeDetailsContentProps {
  recipe: Recipe;
  servings: ServingsState;
  formatMeasure: (measure: string) => string;
  onCook: () => void;
  onViewList: () => void;
  /** Busca a receita de novo, quando a tradução falhou. */
  onRetryTranslation: () => void;
}

const HERO_HEIGHT = 260;

/** Conteúdo da receita (RF05, RF12 a RF14 e RF19). A tela compõe as features; elas não se conhecem. */
export function RecipeDetailsContent({
  recipe,
  servings,
  formatMeasure,
  onCook,
  onViewList,
  onRetryTranslation,
}: RecipeDetailsContentProps) {
  const { colors, spacing, radius } = useTheme();
  const steps = splitSteps(recipe.instructions);
  const youtubeUrl = recipe.youtubeUrl;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <Image
        source={{ uri: recipe.thumbnail }}
        style={[styles.hero, { backgroundColor: colors.surfaceVariant }]}
        contentFit="cover"
        transition={200}
        accessibilityLabel={`Foto de ${recipe.name}`}
      />

      <View style={{ padding: spacing.md, gap: spacing.lg }}>
        <View style={{ gap: spacing.sm }}>
          <View style={[styles.row, { gap: spacing.sm }]}>
            {recipe.area ? <Tag label={translateOrigin(recipe.area)} tone="primary" /> : null}
            {recipe.category ? <Tag label={translateCategory(recipe.category)} /> : null}
            <AppText variant="caption" tone="muted" style={styles.count}>
              {recipe.ingredientCount} ingredientes
            </AppText>
          </View>
          <Title>{recipe.name}</Title>
          {recipe.isTranslated === false ? (
            <View
              accessibilityRole="alert"
              style={[
                styles.notice,
                {
                  backgroundColor: colors.surfaceMuted,
                  borderRadius: radius.lg,
                  padding: 12,
                  gap: spacing.sm,
                },
              ]}
            >
              <AppText variant="small" tone="secondary" style={styles.noticeText}>
                Não foi possível traduzir agora. A receita está em inglês, como veio do site.
              </AppText>
              <Button label="Traduzir" variant="ghost" size="sm" onPress={onRetryTranslation} />
            </View>
          ) : null}
        </View>

        <View style={[styles.row, { gap: 12 }]}>
          <ServingsControl servings={servings.servings} onChange={servings.setServings} />
          <UnitToggle />
        </View>

        <View style={{ gap: 12 }}>
          <Button
            label="Começar a cozinhar"
            icon="skillet"
            onPress={onCook}
            accessibilityHint={`Abre o passo a passo para ${servings.servings} porções`}
          />
          <AddToListButton
            recipe={recipe}
            factor={servings.factor}
            servings={servings.servings}
            onViewList={onViewList}
          />
        </View>

        <View style={{ gap: 12 }}>
          <SectionHeader title="Ingredientes" meta={`${servings.servings} porções`} />
          <IngredientList ingredients={recipe.ingredients} formatMeasure={formatMeasure} />
        </View>

        {steps.length > 0 ? (
          <View style={{ gap: 12 }}>
            <SectionHeader title="Modo de preparo" meta={`${steps.length} passos`} />
            <StepList steps={steps} />
          </View>
        ) : null}

        {youtubeUrl ? (
          <Button
            label="Assistir ao vídeo no YouTube"
            icon="playCircle"
            variant="ghost"
            accessibilityHint="Abre o vídeo no YouTube"
            onPress={() => void Linking.openURL(youtubeUrl)}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    flex: 1,
    textAlign: 'right',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeText: {
    flex: 1,
  },
});
