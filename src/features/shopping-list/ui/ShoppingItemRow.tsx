import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText, Checkbox, IconButton } from '@/shared/ui';

import type { ShoppingItem } from '../lib/addRecipeToList';
import { formatItemAmount } from '../lib/formatShoppingList';

export interface ShoppingItemRowProps {
  item: ShoppingItem;
  onToggle: (key: string) => void;
  onRemove: (item: ShoppingItem) => void;
}

/**
 * Item da lista (padrão "Independência de Cor" do design system): o estado comprado é mostrado por
 * cor, pela caixa marcada, pelo texto riscado e pela palavra "Pronto", não só pela cor.
 */
export function ShoppingItemRow({ item, onToggle, onRemove }: ShoppingItemRowProps) {
  const { colors, spacing, radius } = useTheme();
  const amount = formatItemAmount(item);

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: item.checked ? colors.surfaceMuted : colors.surface, borderRadius: radius.lg },
      ]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.checked }}
        accessibilityLabel={`${item.name}, ${amount}`}
        onPress={() => onToggle(item.key)}
        style={[styles.toggle, { gap: 12, paddingLeft: spacing.md }]}
      >
        <Checkbox checked={item.checked} />
        <View style={styles.texts}>
          <AppText
            variant="bodyStrong"
            tone={item.checked ? 'muted' : 'default'}
            style={item.checked && styles.done}
            numberOfLines={2}
          >
            {item.name}
          </AppText>
          <AppText variant="small" tone={item.checked ? 'muted' : 'secondary'} style={item.checked && styles.done}>
            {amount}
          </AppText>
        </View>
        {item.checked ? (
          <AppText variant="caption" tone="muted">
            Pronto
          </AppText>
        ) : null}
      </Pressable>
      <IconButton icon="close" accessibilityLabel={`Remover ${item.name}`} onPress={() => onRemove(item)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  toggle: {
    flex: 1,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  texts: {
    flex: 1,
  },
  done: {
    textDecorationLine: 'line-through',
  },
});
