import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { recipeQueries, splitSteps } from '@/entities/recipe';
import { useMeasureFormatter, useServings } from '@/features/adjust-measures';
import { IngredientDrawer, useStepNavigation } from '@/features/cooking-steps';
import { prepareAlarm, useTimerAlarms, useTimersStore } from '@/features/kitchen-timers';
import { useWakeLock } from '@/features/screen-wake-lock';
import { useTheme } from '@/shared/theme';
import { AppText, EmptyState, ErrorMessage, IconButton, Screen, SkeletonBlock, showToast } from '@/shared/ui';

import { CookingSession } from './CookingSession';

/**
 * Rota: /receita/:id/cozinhar?porcoes=6, em tela cheia (RF15 a RF18).
 * Junta quatro features que não se conhecem: passos, timers, tela ligada e porções.
 */
export function CookingModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { spacing } = useTheme();
  const { data: recipe, isPending, isError, refetch } = useQuery(recipeQueries.detail(id));
  const servings = useServings();
  const formatMeasure = useMeasureFormatter(servings.factor);
  const wakeLock = useWakeLock();
  const now = useTimerAlarms();
  const clearTimers = useTimersStore((state) => state.clearAll);
  const [showIngredients, setShowIngredients] = useState(false);

  const steps = splitSteps(recipe?.instructions ?? '');
  const navigation = useStepNavigation(steps.length);

  // Prepara o som ao entrar; ao sair, os timers são descartados junto com a tela.
  useEffect(() => {
    prepareAlarm().catch(() => undefined);
    return clearTimers;
  }, [clearTimers]);

  // "Concluir" no último passo: avisa com o toast e volta para a tela inicial, fechando o modo cozinha
  // e a receita que estava embaixo dele.
  useEffect(() => {
    if (!navigation.finished) return;
    showToast({ message: 'Receita concluída! Bom apetite.', variant: 'success' });
    router.dismissTo('/');
  }, [navigation.finished, router]);

  const exit = () =>
    router.canGoBack()
      ? router.back()
      : router.replace({ pathname: '/receita/[id]', params: { id, porcoes: String(servings.servings) } });

  const renderBody = () => {
    if (isPending) {
      return (
        <View accessibilityLabel="Carregando receita" style={{ padding: spacing.md, gap: spacing.md }}>
          <SkeletonBlock height={24} width="40%" />
          <SkeletonBlock height={160} />
        </View>
      );
    }
    if (isError) {
      return (
        <View style={{ padding: spacing.md }}>
          <ErrorMessage
            title="Não foi possível carregar a receita"
            description="Verifique sua conexão com a internet e tente de novo."
            onRetry={() => void refetch()}
          />
        </View>
      );
    }
    if (!recipe || steps.length === 0) {
      return (
        <View style={{ padding: spacing.md }}>
          <EmptyState
            title={recipe ? 'Esta receita não tem instruções' : 'Receita não encontrada'}
            description="Volte e escolha outra receita para cozinhar."
            actionLabel="Sair do modo cozinha"
            onAction={exit}
          />
        </View>
      );
    }
    return (
      <CookingSession
        navigation={navigation}
        step={steps[navigation.index] ?? ''}
        wakeLock={wakeLock}
        now={now}
      />
    );
  };

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']} padded={false}>
      <View style={[styles.header, { paddingHorizontal: spacing.sm, gap: spacing.sm }]}>
        <IconButton
          icon="close"
          variant="neutral"
          size="lg"
          accessibilityLabel="Sair do modo cozinha"
          onPress={exit}
        />
        <AppText accessibilityRole="header" variant="headline" numberOfLines={1} style={styles.title}>
          {recipe?.name ?? 'Modo cozinha'}
        </AppText>
        {recipe ? (
          <IconButton
            icon="listAlt"
            variant="tonal"
            size="lg"
            accessibilityLabel="Ver ingredientes"
            onPress={() => setShowIngredients(true)}
          />
        ) : null}
      </View>

      {renderBody()}

      {recipe ? (
        <IngredientDrawer
          visible={showIngredients}
          onClose={() => setShowIngredients(false)}
          servings={servings.servings}
          ingredients={recipe.ingredients.map((ingredient) => ({
            name: ingredient.name,
            measure: formatMeasure(ingredient.measure),
          }))}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
});
