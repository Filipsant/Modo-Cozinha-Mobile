import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';
import { AppText, Checkbox, IconButton } from '@/shared/ui';

export interface DrawerIngredient {
  name: string;
  /** Medida já formatada nas porções escolhidas (a tela formata com a feature adjust-measures). */
  measure: string;
}

export interface IngredientDrawerProps {
  visible: boolean;
  onClose: () => void;
  ingredients: DrawerIngredient[];
  servings: number;
}

/** Gaveta que abre por baixo com os ingredientes nas porções escolhidas; dá para marcar o que já separou. */
export function IngredientDrawer({ visible, onClose, ingredients, servings }: IngredientDrawerProps) {
  const { colors, spacing, radius } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [checked, setChecked] = useState<ReadonlySet<number>>(new Set());

  const toggle = (index: number) =>
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.backdrop, { backgroundColor: colors.scrim }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar ingredientes"
          onPress={onClose}
          style={styles.dismiss}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.xl * 1.5,
              borderTopRightRadius: radius.xl * 1.5,
              paddingBottom: bottom + spacing.md,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border, borderRadius: radius.full }]} />
          <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
            <AppText accessibilityRole="header" variant="headline">
              Ingredientes · {servings} porções
            </AppText>
            <IconButton icon="close" accessibilityLabel="Fechar ingredientes" onPress={onClose} />
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.xs }}>
            {ingredients.map((ingredient, index) => {
              const isChecked = checked.has(index);
              return (
                <Pressable
                  key={`${ingredient.name}-${index}`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isChecked }}
                  accessibilityLabel={
                    ingredient.measure ? `${ingredient.name}: ${ingredient.measure}` : ingredient.name
                  }
                  onPress={() => toggle(index)}
                  style={[styles.row, { gap: 12 }]}
                >
                  <Checkbox checked={isChecked} />
                  <AppText
                    variant="body"
                    tone={isChecked ? 'muted' : 'default'}
                    style={[styles.text, isChecked && styles.done]}
                  >
                    {ingredient.name}
                  </AppText>
                  {ingredient.measure ? (
                    <AppText
                      variant="label"
                      tone={isChecked ? 'muted' : 'primary'}
                      style={[styles.measure, isChecked && styles.done]}
                    >
                      {ingredient.measure}
                    </AppText>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dismiss: {
    flex: 1,
  },
  sheet: {
    maxHeight: '75%',
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
  measure: {
    maxWidth: '45%',
    textAlign: 'right',
  },
  done: {
    textDecorationLine: 'line-through',
  },
});
