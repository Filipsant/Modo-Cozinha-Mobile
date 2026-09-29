import type { StyleProp, ViewStyle } from 'react-native';

import type { Recipe } from '@/entities/recipe';
import { Button, showToast } from '@/shared/ui';

import { useShoppingListStore } from '../model/shoppingListStore';

export interface AddToListButtonProps {
  recipe: Recipe;
  /** Fator das porções escolhidas: os ingredientes entram já nessa quantidade (RF19). */
  factor: number;
  servings: number;
  /** A feature não conhece as rotas: quem usa decide para onde "Ver lista" leva. */
  onViewList: () => void;
  style?: StyleProp<ViewStyle>;
}

export function AddToListButton({ recipe, factor, servings, onViewList, style }: AddToListButtonProps) {
  const addRecipe = useShoppingListStore((state) => state.addRecipe);

  const handlePress = () => {
    addRecipe(recipe, factor);
    showToast({
      message: `${recipe.ingredientCount} ingredientes adicionados (${servings} porções)`,
      variant: 'success',
      actionLabel: 'Ver lista',
      onAction: onViewList,
    });
  };

  return (
    <Button
      label="Adicionar à lista"
      icon="listAlt"
      variant="tonal"
      onPress={handlePress}
      accessibilityHint={`Adiciona os ingredientes para ${servings} porções à lista de compras`}
      style={style}
    />
  );
}
