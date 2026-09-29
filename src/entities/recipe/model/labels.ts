import type { Origin } from './recipe.types';

/**
 * Categorias da TheMealDB traduzidas para a interface. Só os rótulos são traduzidos:
 * nomes e instruções das receitas continuam em inglês (fora do escopo do roadmap).
 * A ordem é a do Figma: Massas, Sobremesas, Frango, Vegetarianas, Frutos do Mar e o resto.
 */
export const CATEGORY_LABELS: Record<string, string> = {
  Pasta: 'Massas',
  Dessert: 'Sobremesas',
  Chicken: 'Frango',
  Vegetarian: 'Vegetarianas',
  Seafood: 'Frutos do Mar',
  Beef: 'Carne bovina',
  Pork: 'Porco',
  Breakfast: 'Café da manhã',
  Lamb: 'Cordeiro',
  Vegan: 'Veganas',
  Side: 'Acompanhamentos',
  Starter: 'Entradas',
  Goat: 'Cabrito',
  Miscellaneous: 'Diversas',
};

/**
 * Origens do filtro, por país. A lista de origens da API (list.php?a=list) devolve adjetivos
 * ("Brazilian") que o filter.php não entende mais; ele filtra pelo país ("Brazil").
 * Por isso a lista é curada: as 5 do Figma primeiro e depois as com mais receitas. Veja o ADR 006.
 */
export const ORIGINS: Origin[] = [
  { country: 'Italy', label: 'Italiana', flag: '🇮🇹' },
  { country: 'Brazil', label: 'Brasileira', flag: '🇧🇷' },
  { country: 'France', label: 'Francesa', flag: '🇫🇷' },
  { country: 'Japan', label: 'Japonesa', flag: '🇯🇵' },
  { country: 'Mexico', label: 'Mexicana', flag: '🇲🇽' },
  { country: 'India', label: 'Indiana', flag: '🇮🇳' },
  { country: 'China', label: 'Chinesa', flag: '🇨🇳' },
  { country: 'Thailand', label: 'Tailandesa', flag: '🇹🇭' },
  { country: 'United States', label: 'Americana', flag: '🇺🇸' },
  { country: 'United Kingdom', label: 'Britânica', flag: '🇬🇧' },
  { country: 'Spain', label: 'Espanhola', flag: '🇪🇸' },
  { country: 'Portugal', label: 'Portuguesa', flag: '🇵🇹' },
];

/** Países que aparecem nas receitas mas não estão no filtro: só o nome em português. */
export const EXTRA_COUNTRY_LABELS: Record<string, string> = {
  Algeria: 'Argelina',
  Argentina: 'Argentina',
  Cambodia: 'Cambojana',
  Canada: 'Canadense',
  Croatia: 'Croata',
  Egypt: 'Egípcia',
  Greece: 'Grega',
  Ireland: 'Irlandesa',
  Jamaica: 'Jamaicana',
  Kenya: 'Queniana',
  Malaysia: 'Malaia',
  Morocco: 'Marroquina',
  Netherlands: 'Holandesa',
  Philippines: 'Filipina',
  Poland: 'Polonesa',
  Russia: 'Russa',
  Tunisia: 'Tunisiana',
  Turkey: 'Turca',
  Ukraine: 'Ucraniana',
  Uruguay: 'Uruguaia',
  Vietnam: 'Vietnamita',
};
