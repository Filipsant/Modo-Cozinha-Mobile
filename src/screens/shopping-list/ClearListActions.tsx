import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { Button, ConfirmDialog } from '@/shared/ui';

export interface ClearListActionsProps {
  totalCount: number;
  checkedCount: number;
  onClearChecked: () => void;
  onClearAll: () => void;
}

type PendingConfirmation = 'clear-checked' | 'clear-all' | null;

const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

/** "Limpar comprados" e "Limpar tudo", sempre com o diálogo de confirmação do design system (RF21). */
export function ClearListActions({
  totalCount,
  checkedCount,
  onClearChecked,
  onClearAll,
}: ClearListActionsProps) {
  const { spacing } = useTheme();
  const [confirmation, setConfirmation] = useState<PendingConfirmation>(null);
  const isClearAll = confirmation === 'clear-all';

  const confirm = () => {
    if (isClearAll) onClearAll();
    else onClearChecked();
    setConfirmation(null);
  };

  return (
    <>
      <View style={[styles.row, { paddingTop: spacing.lg, gap: spacing.sm }]}>
        <Button
          label="Limpar comprados"
          variant="neutral"
          size="sm"
          disabled={checkedCount === 0}
          onPress={() => setConfirmation('clear-checked')}
        />
        <Button label="Limpar tudo" variant="ghost" size="sm" onPress={() => setConfirmation('clear-all')} />
      </View>

      <ConfirmDialog
        visible={confirmation !== null}
        title={isClearAll ? 'Limpar lista de compras?' : 'Limpar itens comprados?'}
        message={`Esta ação removerá ${
          isClearAll
            ? plural(totalCount, 'ingrediente', 'ingredientes')
            : plural(checkedCount, 'item comprado', 'itens comprados')
        } e não poderá ser desfeita.`}
        confirmLabel={isClearAll ? 'Limpar tudo' : 'Limpar comprados'}
        onConfirm={confirm}
        onCancel={() => setConfirmation(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
