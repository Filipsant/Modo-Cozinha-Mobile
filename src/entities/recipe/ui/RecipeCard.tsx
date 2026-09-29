import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText, Button, IconButton, Tag } from '@/shared/ui';

import { translateCategory, translateOrigin } from '../lib/labels';
import type { RecipeSummary } from '../model/recipe.types';

export interface RecipeCardProps {
  recipe: RecipeSummary;
  /** Abre a página da receita: pelo card, pelo botão "Modo Cozinha" e pelo botão "…". */
  onOpen: (id: string) => void;
  /** Ações de outras features (ex.: botão de favorito), recebidas prontas. O card não as conhece. */
  actions?: ReactNode;
}

const IMAGE_HEIGHT = 176;

/** Card de receita do Figma (Início, node 1:742). */
export function RecipeCard({ recipe, onOpen, actions }: RecipeCardProps) {
  const { colors, spacing, radius, shadows } = useTheme();

  return (
    <View style={[styles.card, shadows.card, { backgroundColor: colors.surface, borderRadius: radius.xl }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir receita ${recipe.name}`}
        onPress={() => onOpen(recipe.id)}
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >
        <Image
          source={{ uri: `${recipe.thumbnail}/medium` }}
          style={[styles.image, { backgroundColor: colors.surfaceVariant }]}
          contentFit="cover"
          transition={200}
          accessible={false}
        />
        <View style={{ padding: spacing.md, paddingBottom: 0, gap: spacing.sm }}>
          <View style={[styles.metaRow, { gap: spacing.sm }]}>
            {recipe.area ? <Tag label={translateOrigin(recipe.area)} tone="primary" /> : null}
            {recipe.category ? <Tag label={translateCategory(recipe.category)} /> : null}
            {recipe.ingredientCount ? (
              <AppText variant="caption" tone="muted" style={styles.count}>
                {recipe.ingredientCount} ingredientes
              </AppText>
            ) : null}
          </View>
          <AppText variant="headline" numberOfLines={2}>
            {recipe.name}
          </AppText>
        </View>
      </Pressable>

      {/* O "Modo Cozinha" do card leva à receita: lá a pessoa escolhe as porções antes de cozinhar. */}
      <View style={[styles.buttons, { padding: spacing.md, gap: spacing.sm }]}>
        <Button
          label="Modo Cozinha"
          icon="skillet"
          onPress={() => onOpen(recipe.id)}
          accessibilityLabel={`Modo Cozinha: abrir a receita ${recipe.name}`}
          style={styles.cook}
        />
        <IconButton
          icon="moreHoriz"
          variant="neutral"
          size="lg"
          accessibilityLabel="Ver detalhes da receita"
          onPress={() => onOpen(recipe.id)}
        />
      </View>

      {actions ? <View style={[styles.actions, { top: 12, right: 12 }]}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    flex: 1,
    textAlign: 'right',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cook: {
    flex: 1,
  },
  actions: {
    position: 'absolute',
  },
});
