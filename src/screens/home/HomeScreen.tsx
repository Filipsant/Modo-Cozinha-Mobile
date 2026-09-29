import { useRouter } from 'expo-router';
import { useState } from 'react';

import { mealdbClient } from '@/entities/recipe';
import { useBrowseParams, useRecipeResults, type BrowseStrategy } from '@/features/browse-recipes';
import { BASE_SERVINGS } from '@/shared/config';
import { Screen, showToast } from '@/shared/ui';
import { RecipeResults } from '@/widgets/recipe-results';

import { HomeHeader } from './HomeHeader';
import { KitchenTip } from './KitchenTip';

function sectionTitleFor(strategy: BrowseStrategy): string {
  if (strategy.kind === 'featured') return 'Receitas em Destaque';
  if (strategy.kind === 'search') return `Resultados para "${strategy.term}"`;
  return 'Receitas filtradas';
}

/** Rota: /?q=chicken&categoria=Seafood&origem=Italy (RF01 a RF04, RF06, RF08 e RF09). */
export function HomeScreen() {
  const router = useRouter();
  const browse = useBrowseParams();
  const results = useRecipeResults(browse);
  const [showTip, setShowTip] = useState(true);
  const [isSurprising, setIsSurprising] = useState(false);

  const count = results.recipes?.length;
  const noun = results.strategy.kind === 'featured' ? ['sugestão', 'sugestões'] : ['receita', 'receitas'];
  const sectionMeta = count === undefined ? undefined : `${count} ${count === 1 ? noun[0] : noun[1]}`;

  const openRecipe = (id: string) => router.push({ pathname: '/receita/[id]', params: { id } });
  const cookRecipe = (id: string) =>
    router.push({ pathname: '/receita/[id]/cozinhar', params: { id, porcoes: String(BASE_SERVINGS) } });

  // A receita aleatória não usa cache: cada toque deve trazer uma diferente.
  const surprise = async () => {
    setIsSurprising(true);
    try {
      const recipe = await mealdbClient.getRandom();
      openRecipe(recipe.id);
    } catch {
      showToast({ message: 'Não foi possível sortear uma receita. Tente de novo.', variant: 'error' });
    } finally {
      setIsSurprising(false);
    }
  };

  return (
    <Screen padded={false}>
      <RecipeResults
        header={
          <HomeHeader
            browse={browse}
            sectionTitle={sectionTitleFor(results.strategy)}
            sectionMeta={sectionMeta}
            onSurprise={surprise}
            isSurprising={isSurprising}
          />
        }
        recipes={results.recipes}
        isPending={results.isPending}
        isError={results.isError}
        onRetry={results.refetch}
        onOpenRecipe={openRecipe}
        onCookRecipe={cookRecipe}
        refreshing={results.isRefetching}
        onRefresh={results.refetch}
        bottomInset={showTip ? 96 : 0}
        empty={
          results.strategy.kind === 'search'
            ? {
                title: 'Nenhuma receita encontrada',
                description: 'As receitas estão em inglês: tente termos como chicken, pasta ou cake.',
                actionLabel: 'Limpar busca e filtros',
                onAction: browse.clearAll,
              }
            : {
                title: 'Nenhuma receita com esses filtros',
                description: 'Tente outra categoria ou outra origem culinária.',
                actionLabel: 'Ver todas as receitas',
                onAction: browse.clearAll,
              }
        }
      />
      {showTip ? <KitchenTip onClose={() => setShowTip(false)} /> : null}
    </Screen>
  );
}
