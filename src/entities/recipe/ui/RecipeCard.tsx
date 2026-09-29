import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText, Button, IconButton, Tag } from '@/shared/ui';

import { translateCategory, translateOrigin } from '../lib/labels';
import type { RecipeSummary } from '../model/recipe.types';

export interface RecipeCardProps {
  recipe: RecipeSummary;
  onOpen: (id: string) => void;
  /** Sem onCook, o botão "Modo Cozinha" não aparece. */
  onCook?: (id: string) => void;
  /** Ações de outras features (ex.: botão de favorito), recebidas prontas. O card não as conhece. */
  actions?: ReactNode;
}

const IMAGE_HEIGHT = 176;

/** Card de receita do Figma (Início, node 1:742). */
export function RecipeCard({ recipe, onOpen, onCook, actions }: RecipeCardProps) {
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
        <View style={{ padding: spacing.md, paddingBottom: onCook ? 0 : spacing.md, gap: spacing.sm }}>
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

      {onCook ? (
        <View style={[styles.buttons, { padding: spacing.md, paddingTop: spacing.md, gap: spacing.sm }]}>
          <Button
            label="Modo Cozinha"
            icon="skillet"
            onPress={() => onCook(recipe.id)}
            accessibilityLabel={`Cozinhar ${recipe.name} no modo cozinha`}
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
      ) : null}

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
