import { Link } from 'expo-router';

import { useTheme } from '@/shared/theme';
import { Paragraph, Screen, Title } from '@/shared/ui';

export function HomeScreen() {
  const { colors } = useTheme();

  return (
    <Screen edges={['top']}>
      <Title>Modo Cozinha</Title>
      <Paragraph>Busca e filtros chegam nas Etapas 2 e 3.</Paragraph>

      {/* Provisório: só para navegar entre as telas vazias. Sai na Etapa 2. */}
      <Link href="/receita/52772?porcoes=4" style={{ color: colors.primary }}>
        Abrir receita de exemplo
      </Link>
    </Screen>
  );
}
