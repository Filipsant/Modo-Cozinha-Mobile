import { SearchInput } from '@/shared/ui';

export interface SearchBarProps {
  term: string;
  onChangeTerm: (term: string) => void;
}

/** Busca pelo nome da receita, em português ou inglês (o termo é traduzido antes de ir para a API). */
export function SearchBar({ term, onChangeTerm }: SearchBarProps) {
  return (
    <SearchInput
      value={term}
      onChangeText={onChangeTerm}
      placeholder="Buscar receitas, ex.: frango"
      accessibilityLabel="Buscar receitas pelo nome"
    />
  );
}
