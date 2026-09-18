import { Link, Stack } from 'expo-router';

import { useTheme } from '@/shared/theme';
import { Paragraph, Screen, Title } from '@/shared/ui';

export function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Não encontrada' }} />
      <Title>Página não encontrada</Title>
      <Paragraph>O endereço que você abriu não existe no Modo Cozinha.</Paragraph>
      <Link href="/" style={{ color: colors.primary }}>
        Voltar para o início
      </Link>
    </Screen>
  );
}
