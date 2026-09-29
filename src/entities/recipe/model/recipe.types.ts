export interface Ingredient {
  name: string;
  /**
   * Texto livre da API, ex.: "1/2 cup". A entity measure transforma em número e unidade.
   * Na receita traduzida, número e unidade continuam como a API manda e só o resto muda ("2 dentes").
   */
  measure: string;
}

/**
 * O que os filtros da API devolvem: id, nome, foto e, às vezes, a origem.
 * Categoria, origem e quantidade de ingredientes são opcionais.
 */
export interface RecipeSummary {
  id: string;
  name: string;
  thumbnail: string;
  /** Categoria em inglês, como a API devolve ("Seafood"). A tradução é feita na hora de mostrar. */
  category?: string;
  /** País de origem em inglês ("Italy"). */
  area?: string;
  ingredientCount?: number;
}

export interface Recipe extends RecipeSummary {
  category: string;
  area: string;
  instructions: string;
  ingredients: Ingredient[];
  ingredientCount: number;
  youtubeUrl: string | null;
  /** false quando a tradução falhou e a receita aparece em inglês, como veio da API. */
  isTranslated?: boolean;
}

/** Uma origem culinária do filtro: o país que a API entende, o nome em português e a bandeira. */
export interface Origin {
  country: string;
  label: string;
  flag: string;
}
