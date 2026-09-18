/**
 * Design tokens. No mobile não existe CSS: os valores viram objetos TypeScript
 * usados pelo StyleSheet. A paleta definitiva é escolhida na Etapa 1.
 */

export interface ColorPalette {
  primary: string;
  onPrimary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
}

export const lightColors: ColorPalette = {
  primary: '#B93C12',
  onPrimary: '#FFFFFF',
  background: '#FFFBF7',
  surface: '#FFFFFF',
  text: '#1F1B18',
  textSecondary: '#5C534D',
  border: '#E7DDD5',
  success: '#1E7A3E',
  error: '#B3261E',
};

export const darkColors: ColorPalette = {
  primary: '#FF9B6B',
  onPrimary: '#2B1206',
  background: '#171311',
  surface: '#221C19',
  text: '#F5EEE9',
  textSecondary: '#C2B6AD',
  border: '#3A302B',
  success: '#6FD08C',
  error: '#FFB4AB',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
} as const;

/** Escala do roadmap: 14, 16, 20, 24 e 32. */
export const fontSize = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

/** RNF08: área de toque mínima e fonte do modo cozinha. */
export const MIN_TOUCH_TARGET = 44;
export const COOKING_MIN_FONT_SIZE = 24;
