import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';

import { Icon } from './Icon';

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  /** Nome do campo para o leitor de tela (o placeholder some ao digitar). */
  accessibilityLabel: string;
  onSubmit?: () => void;
}

/** Campo de busca do Figma: cartão branco de 48 px, lupa à esquerda e botão de limpar à direita. */
export function SearchInput({ value, onChangeText, placeholder, accessibilityLabel, onSubmit }: SearchInputProps) {
  const { colors, radius, shadows, typography } = useTheme();

  return (
    <View style={[styles.container, shadows.card, { backgroundColor: colors.surface, borderRadius: radius.lg }]}>
      <Icon name="search" color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={accessibilityLabel}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCorrect={false}
        autoCapitalize="none"
        style={[
          styles.input,
          { color: colors.text, fontFamily: typography.body.fontFamily, fontSize: typography.body.fontSize },
        ]}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          onPress={() => onChangeText('')}
          style={styles.clear}
        >
          <Icon name="cancel" color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingLeft: 12,
    paddingRight: 48,
    paddingVertical: 0,
  },
  clear: {
    position: 'absolute',
    right: 4,
    top: 2,
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
