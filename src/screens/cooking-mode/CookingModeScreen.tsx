import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';
import { Paragraph, Screen, Title } from '@/shared/ui';

/** Rota: /receita/:id/cozinhar?porcoes=6, em tela cheia, sem cabeçalho nem abas. */
export function CookingModeScreen() {
  const { id, porcoes } = useLocalSearchParams<{ id: string; porcoes?: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <Title>Modo cozinha</Title>
      <Paragraph>
        Receita {id}, {porcoes} porções. Passos, timers e tela ligada chegam na Etapa 5.
      </Paragraph>

      {/* O botão de sair fica sempre visível no modo cozinha. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sair do modo cozinha"
        onPress={() => router.back()}
        style={styles.exit}
      >
        <Text style={{ color: colors.primary }}>Sair</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  exit: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
});
