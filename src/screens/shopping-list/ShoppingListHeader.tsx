import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { Button, Paragraph, SegmentedControl, Title } from '@/shared/ui';

export type ListView = 'single' | 'by-recipe';

const VIEW_OPTIONS: { value: ListView; label: string }[] = [
  { value: 'single', label: 'Lista única' },
  { value: 'by-recipe', label: 'Por receita' },
];

export interface ShoppingListHeaderProps {
  pendingCount: number;
  totalCount: number;
  view: ListView;
  onChangeView: (view: ListView) => void;
  onShare: () => void;
  onCopy: () => void;
}

export function ShoppingListHeader({
  pendingCount,
  totalCount,
  view,
  onChangeView,
  onShare,
  onCopy,
}: ShoppingListHeaderProps) {
  const { spacing } = useTheme();
  const summary =
    totalCount === 0
      ? 'Some os ingredientes de várias receitas numa lista só.'
      : pendingCount === 0
        ? 'Tudo comprado!'
        : `${pendingCount} ${pendingCount === 1 ? 'item para comprar' : 'itens para comprar'}`;

  return (
    <View style={{ gap: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md }}>
      <View>
        <Title>Lista de compras</Title>
        <Paragraph>{summary}</Paragraph>
      </View>
      {totalCount > 0 ? (
        <>
          <View style={[styles.row, { gap: spacing.sm }]}>
            <Button label="Compartilhar" icon="share" variant="tonal" size="sm" onPress={onShare} />
            <Button label="Copiar texto" variant="ghost" size="sm" onPress={onCopy} />
          </View>
          <SegmentedControl
            accessibilityLabel="Organizar a lista"
            options={VIEW_OPTIONS}
            value={view}
            onChange={onChangeView}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
