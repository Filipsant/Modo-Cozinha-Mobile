import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, SectionList, View } from 'react-native';

import {
  ShoppingItemRow,
  copyList,
  groupBySource,
  orderItems,
  shareList,
  useShoppingListHydrated,
  useShoppingListStore,
  type ShoppingItem,
} from '@/features/shopping-list';
import { useTheme } from '@/shared/theme';
import { AppText, EmptyState, Screen, showToast } from '@/shared/ui';

import { ClearListActions } from './ClearListActions';
import { ShoppingListHeader, type ListView } from './ShoppingListHeader';

interface ItemSection {
  key: string;
  /** Nome da receita na lista agrupada; null na lista única. */
  title: string | null;
  data: ShoppingItem[];
}

function Separator() {
  const { spacing } = useTheme();
  return <View style={{ height: spacing.sm }} />;
}

/** Rota: /lista-de-compras (RF20 a RF22). */
export function ShoppingListScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const hydrated = useShoppingListHydrated();
  const items = useShoppingListStore((state) => state.items);
  const toggleChecked = useShoppingListStore((state) => state.toggleChecked);
  const removeItem = useShoppingListStore((state) => state.removeItem);
  const restoreItem = useShoppingListStore((state) => state.restoreItem);
  const clearChecked = useShoppingListStore((state) => state.clearChecked);
  const clearAll = useShoppingListStore((state) => state.clearAll);
  const [view, setView] = useState<ListView>('single');

  if (!hydrated) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} accessibilityLabel="Carregando lista de compras" />
      </Screen>
    );
  }

  const checkedCount = items.filter((item) => item.checked).length;
  const sections: ItemSection[] =
    items.length === 0
      ? []
      : view === 'single'
        ? [{ key: 'all', title: null, data: orderItems(items) }]
        : groupBySource(items).map((group) => ({
            key: group.source.id,
            title: group.source.name,
            data: group.items,
          }));

  const removeWithUndo = (item: ShoppingItem) => {
    const index = items.findIndex((existing) => existing.key === item.key);
    removeItem(item.key);
    showToast({
      message: `${item.name} removido da lista`,
      actionLabel: 'Desfazer',
      onAction: () => restoreItem(item, index),
    });
  };

  return (
    <Screen padded={false}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.key}-${index}`}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl, flexGrow: 1 }}
        ListHeaderComponent={
          <ShoppingListHeader
            pendingCount={items.length - checkedCount}
            totalCount={items.length}
            view={view}
            onChangeView={setView}
            onShare={() => void shareList(items)}
            onCopy={() => void copyList(items)}
          />
        }
        renderSectionHeader={({ section }) =>
          section.title ? (
            <AppText
              accessibilityRole="header"
              variant="overline"
              tone="muted"
              style={{ paddingTop: spacing.md, paddingBottom: spacing.sm }}
            >
              {section.title}
            </AppText>
          ) : null
        }
        renderItem={({ item }) => (
          <ShoppingItemRow item={item} onToggle={toggleChecked} onRemove={removeWithUndo} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="checklist"
            title="Sua lista está vazia"
            description="Abra uma receita, escolha as porções e toque em “Adicionar à lista”."
            actionLabel="Buscar receitas"
            onAction={() => router.navigate('/')}
          />
        }
        ListFooterComponent={
          items.length > 0 ? (
            <ClearListActions
              totalCount={items.length}
              checkedCount={checkedCount}
              onClearChecked={clearChecked}
              onClearAll={clearAll}
            />
          ) : null
        }
      />
    </Screen>
  );
}
