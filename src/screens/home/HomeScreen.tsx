import { Link } from 'expo-router';

import { useTheme } from '@/shared/theme';
import { Paragraph, Screen, Title } from '@/shared/ui';
import { View } from 'react-native';

export function HomeScreen() {
  const { colors } = useTheme();

  return (
   <View>
    <Screen edges={['top']}>
      <Title>Modo Cozinha</Title>
     
      {/* Provisório: só para navegar entre as telas vazias. Sai na Etapa 2. */}
      <Link href="/receita/52772?porcoes=4" style={{ color: colors.primary }}>
        Abrir receita de exemplo
      </Link>
    </Screen>
    </View>
  );
  
}
