import type { ReactElement } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { RecipeCard, type RecipeSummary } from '@/entities/recipe';
import { FavoriteButton } from '@/features/favorite-recipe';
import { useTheme } from '@/shared/theme';
import { EmptyState, ErrorMessage, SkeletonCard, type EmptyStateProps } from '@/shared/ui';

export interface RecipeResultsProps {
  recipes: RecipeSummary[] | undefined;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenRecipe: (id: string) => void;
  onCookRecipe?: (id: string) => void;
  /** Conteúdo acima da lista (busca, filtros, título), que rola junto com os cards. */
  header?: ReactElement;
  /** Textos do estado vazio, que mudam conforme a tela. */
  empty: EmptyStateProps;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Espaço extra no fim, para o último card não ficar embaixo de algo flutuante. */
  bottomInset?: number;
}

const SKELETON_COUNT = 3;

function Separator() {
  const { spacing } = useTheme();
  return <View style={{ height: spacing.md }} />;
}

/** Junta uma entity (RecipeCard) e uma feature (FavoriteButton) e trata os estados da lista (RF02, RF03). */
export function RecipeResults({
  recipes,
  isPending,
  isError,
  onRetry,
  onOpenRecipe,
  onCookRecipe,
  header,
  empty,
  refreshing = false,
  onRefresh,
  bottomInset = 0,
}: RecipeResultsProps) {
  const { colors, spacing } = useTheme();

  const renderState = () => {
    if (isPending) {
      return (
        <View accessibilityLabel="Carregando receitas" style={{ gap: spacing.md, paddingHorizontal: spacing.md }}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View style={{ paddingHorizontal: spacing.md }}>
          <ErrorMessage
            title="Não foi possível carregar as receitas"
            description="Verifique sua conexão com a internet e tente de novo."
            onRetry={onRetry}
          />
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: spacing.md }}>
        <EmptyState {...empty} />
      </View>
    );
  };

  return (
    <FlatList
      data={isPending || isError ? [] : recipes}
      keyExtractor={(recipe) => recipe.id}
      ListHeaderComponent={header}
      ListEmptyComponent={renderState()}
      ItemSeparatorComponent={Separator}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: spacing.md }}>
          <RecipeCard
            recipe={item}
            onOpen={onOpenRecipe}
            onCook={onCookRecipe}
            actions={<FavoriteButton recipe={item} />}
          />
        </View>
      )}
      contentContainerStyle={[styles.content, { paddingBottom: spacing.lg + bottomInset }]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
