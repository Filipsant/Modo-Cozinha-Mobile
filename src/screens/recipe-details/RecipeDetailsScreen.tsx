import { Link, useLocalSearchParams } from 'expo-router';

import { BASE_SERVINGS } from '@/shared/config';
import { useTheme } from '@/shared/theme';
import { Paragraph, Screen, Title } from '@/shared/ui';

/**
 * Rota: /receita/:id?porcoes=6
 * As porções ficam nos parâmetros da rota (o equivalente mobile da URL): acompanham o usuário
 * até o modo cozinha sem estado global e podem ser compartilhadas por link.
 */
export function RecipeDetailsScreen() {
  const { id, porcoes } = useLocalSearchParams<{ id: string; porcoes?: string }>();
  const servings = porcoes ?? String(BASE_SERVINGS);
  const { colors } = useTheme();

  return (
    <Screen>
      <Title>Receita {id}</Title>
      <Paragraph>{servings} porções. Detalhes chegam na Etapa 2 e porções na Etapa 4.</Paragraph>

      {/* Provisório: vira o botão "Cozinhar" na Etapa 5. */}
      <Link
        href={{ pathname: '/receita/[id]/cozinhar', params: { id, porcoes: servings } }}
        style={{ color: colors.primary }}
      >
        Começar a cozinhar
      </Link>
    </Screen>
  );
}
