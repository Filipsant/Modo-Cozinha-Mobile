import type { RecipeSummary } from '@/entities/recipe';
import { useTheme } from '@/shared/theme';
import { IconButton } from '@/shared/ui';

import { useFavoritesStore, useIsFavorite } from '../model/favoritesStore';

export interface FavoriteButtonProps {
  recipe: RecipeSummary;
  /** overlay: círculo branco sobre a foto do card · plain: sem fundo, no cabeçalho. */
  variant?: 'overlay' | 'plain';
}

/** Coração do Figma: contorno quando não é favorito, vermelho cheio quando é (RF10). */
export function FavoriteButton({ recipe, variant = 'overlay' }: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(recipe.id);
  const add = useFavoritesStore((state) => state.add);
  const remove = useFavoritesStore((state) => state.remove);
  const { colors } = useTheme();

  return (
    <IconButton
      icon={isFavorite ? 'favoriteFilled' : 'favorite'}
      iconColor={isFavorite ? colors.error : colors.textSecondary}
      variant={variant}
      selected={isFavorite}
      accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      onPress={() => (isFavorite ? remove(recipe.id) : add(recipe))}
    />
  );
}
