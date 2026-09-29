import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { recipeQueries } from '@/entities/recipe';
import { useMeasureFormatter, useServings } from '@/features/adjust-measures';
import { FavoriteButton } from '@/features/favorite-recipe';
import { useTheme } from '@/shared/theme';
import { AppBar, EmptyState, ErrorMessage, Screen, SkeletonBlock } from '@/shared/ui';

import { RecipeDetailsContent } from './RecipeDetailsContent';

/**
 * Rota: /receita/:id?porcoes=6
 * Ler a rota, buscar os dados e escolher o que mostrar: carregando, erro, não encontrada ou a receita.
 */
export function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { spacing } = useTheme();
  const { data: recipe, isPending, isError, refetch } = useQuery(recipeQueries.detail(id));
  const servings = useServings();
  const formatMeasure = useMeasureFormatter(servings.factor);

  // Veio de dentro do app: volta. Abriu por um link direto: vai para o início.
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const header = (
    <AppBar
      title="Receita"
      onBack={goBack}
      actions={recipe ? <FavoriteButton recipe={recipe} variant="plain" /> : null}
    />
  );

  if (isPending) {
    return (
      <Screen padded={false}>
        {header}
        <View accessibilityLabel="Carregando receita" style={{ gap: spacing.md }}>
          <SkeletonBlock height={260} />
          <View style={{ paddingHorizontal: spacing.md, gap: spacing.md }}>
            <SkeletonBlock width="40%" height={22} />
            <SkeletonBlock width="80%" height={32} />
            <SkeletonBlock height={96} />
            <SkeletonBlock height={48} rounded />
          </View>
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen padded={false}>
        {header}
        <View style={{ padding: spacing.md }}>
          <ErrorMessage
            title="Não foi possível carregar a receita"
            description="Verifique sua conexão com a internet e tente de novo."
            onRetry={() => void refetch()}
          />
        </View>
      </Screen>
    );
  }

  if (!recipe) {
    return (
      <Screen padded={false}>
        {header}
        <View style={{ padding: spacing.md }}>
          <EmptyState
            title="Receita não encontrada"
            description="Esta receita não existe ou foi removida da TheMealDB."
            actionLabel="Voltar para o início"
            onAction={() => router.replace('/')}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      {header}
      <RecipeDetailsContent
        recipe={recipe}
        servings={servings}
        formatMeasure={formatMeasure}
        onCook={() =>
          router.push({
            pathname: '/receita/[id]/cozinhar',
            params: { id: recipe.id, porcoes: String(servings.servings) },
          })
        }
        onViewList={() => router.navigate('/lista-de-compras')}
        onRetryTranslation={() => void refetch()}
      />
    </Screen>
  );
}
