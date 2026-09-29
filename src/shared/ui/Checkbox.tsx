import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { Icon } from './Icon';

export interface CheckboxProps {
  checked: boolean;
}

/**
 * Só o desenho da caixa (24 px, roxa quando marcada). Quem recebe o toque e anuncia
 * "caixa de seleção, marcada" é a linha inteira em volta dela, que é uma área maior.
 */
export function Checkbox({ checked }: CheckboxProps) {
  const { colors, radius } = useTheme();

  return (
    <View
      style={[
        styles.box,
        {
          borderRadius: radius.sm,
          borderColor: checked ? colors.primary : colors.textMuted,
          backgroundColor: checked ? colors.primary : 'transparent',
        },
      ]}
    >
      {checked ? <Icon name="check" color={colors.onPrimary} scale={0.9} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
