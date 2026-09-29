import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { RecipeCard } from '@/entities/recipe';
import {
  sortFavorites,
  useFavoritesHydrated,
  useFavoritesStore,
  type FavoriteRecipe,
  type FavoritesSort,
} from '@/features/favorite-recipe';
import { useTheme } from '@/shared/theme';
import { EmptyState, IconButton, Paragraph, Screen, SegmentedControl, Title, showToast } from '@/shared/ui';

const SORT_OPTIONS: { value: FavoritesSort; label: string }[] = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'alphabetical', label: 'A a Z' },
];

function Separator() {
  const { spacing } = useTheme();
  return <View style={{ height: spacing.md }} />;
}

/** Rota: /favoritos (RF10 e RF11). Os favoritos ficam salvos no celular, sem login. */
export function FavoritesScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const hydrated = useFavoritesHydrated();
  const items = useFavoritesStore((state) => state.items);
  const remove = useFavoritesStore((state) => state.remove);
  const restore = useFavoritesStore((state) => state.restore);
  const [sort, setSort] = useState<FavoritesSort>('recent');

  const removeWithUndo = (favorite: FavoriteRecipe) => {
    remove(favorite.id);
    showToast({
      message: `${favorite.name} removida dos favoritos`,
      actionLabel: 'Desfazer',
      onAction: () => restore(favorite),
    });
  };

  if (!hydrated) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} accessibilityLabel="Carregando favoritos" />
      </Screen>
    );
  }

  const count = items.length;

  return (
    <Screen padded={false}>
      <FlatList
        data={sortFavorites(items, sort)}
        keyExtractor={(favorite) => favorite.id}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 }}
        ListHeaderComponent={
          <View style={{ gap: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
            <View>
              <Title>Favoritos</Title>
              <Paragraph>
                {count === 0
                  ? 'Suas receitas preferidas ficam guardadas aqui.'
                  : `${count} ${count === 1 ? 'receita salva' : 'receitas salvas'} no celular.`}
              </Paragraph>
            </View>
            {count > 1 ? (
              <SegmentedControl
                accessibilityLabel="Ordenar favoritos"
                options={SORT_OPTIONS}
                value={sort}
                onChange={setSort}
              />
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="favorite"
            title="Nenhum favorito ainda"
            description="Toque no coração de uma receita para guardá-la aqui."
            actionLabel="Buscar receitas"
            onAction={() => router.navigate('/')}
          />
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onOpen={(id) => router.push({ pathname: '/receita/[id]', params: { id } })}
            actions={
              <IconButton
                icon="favoriteFilled"
                iconColor={colors.error}
                variant="overlay"
                selected
                accessibilityLabel={`Remover ${item.name} dos favoritos`}
                onPress={() => removeWithUndo(item)}
              />
            }
          />
        )}
      />
    </Screen>
  );
}
