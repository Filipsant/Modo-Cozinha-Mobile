import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppBar, EmptyState, Screen } from '@/shared/ui';

/** Qualquer endereço inexistente (RF07): mensagem e caminho de volta para o início. */
export function NotFoundScreen() {
  const router = useRouter();
  const { spacing } = useTheme();

  return (
    <Screen padded={false}>
      <AppBar title="Modo Cozinha" />
      <View style={{ padding: spacing.md }}>
        <EmptyState
          icon="searchOff"
          title="Página não encontrada"
          description="O endereço que você abriu não existe no Modo Cozinha."
          actionLabel="Voltar para o início"
          onAction={() => router.replace('/')}
        />
      </View>
    </Screen>
  );
}
