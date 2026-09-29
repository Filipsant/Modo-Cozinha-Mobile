import { StyleSheet, View } from 'react-native';

import { CategoryFilter, OriginFilter, SearchBar, type BrowseParamsState } from '@/features/browse-recipes';
import { ThemeToggle } from '@/features/theme-switcher';
import { useTheme } from '@/shared/theme';
import { Button, Paragraph, SectionHeader, Title } from '@/shared/ui';

export interface HomeHeaderProps {
  browse: BrowseParamsState;
  sectionTitle: string;
  sectionMeta?: string;
  onSurprise: () => void;
  isSurprising: boolean;
}

/** Tudo o que fica acima dos cards no Figma (Início, node 1:643), rolando junto com a lista. */
export function HomeHeader({ browse, sectionTitle, sectionMeta, onSurprise, isSurprising }: HomeHeaderProps) {
  const { spacing } = useTheme();

  return (
    <View style={{ paddingTop: spacing.sm, paddingBottom: spacing.md, gap: spacing.md }}>
      <View style={{ paddingHorizontal: spacing.md, gap: spacing.xs }}>
        <View style={styles.row}>
          <Button
            label="Surpreenda-me"
            icon="shuffle"
            variant="tonal"
            size="sm"
            loading={isSurprising}
            onPress={onSurprise}
            accessibilityHint="Abre uma receita sorteada"
          />
          <ThemeToggle />
        </View>
        <View style={{ paddingTop: spacing.sm }}>
          <Title>O que vamos preparar hoje?</Title>
          <Paragraph>Toques ampliados para mãos ocupadas na bancada.</Paragraph>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.md }}>
        <SearchBar term={browse.term} onChangeTerm={browse.setTerm} />
      </View>

      <CategoryFilter selected={browse.category} onChange={browse.setCategory} />

      <View style={{ paddingBottom: spacing.sm }}>
        <OriginFilter selected={browse.country} onChange={browse.setCountry} />
      </View>

      <View style={{ paddingHorizontal: spacing.md }}>
        <SectionHeader title={sectionTitle} meta={sectionMeta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
