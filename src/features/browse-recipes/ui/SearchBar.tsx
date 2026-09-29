import { SearchInput } from '@/shared/ui';

export interface SearchBarProps {
  term: string;
  onChangeTerm: (term: string) => void;
}

/** As receitas da TheMealDB estão em inglês, então o exemplo do placeholder também está. */
export function SearchBar({ term, onChangeTerm }: SearchBarProps) {
  return (
    <SearchInput
      value={term}
      onChangeText={onChangeTerm}
      placeholder="Buscar receitas, ex.: chicken"
      accessibilityLabel="Buscar receitas pelo nome"
    />
  );
}
