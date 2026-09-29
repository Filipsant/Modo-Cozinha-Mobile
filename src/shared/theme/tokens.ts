/**
 * Design tokens do Figma "Modo Cozinha — Design System & Componentes".
 * No mobile não existe CSS: os valores viram objetos TypeScript usados pelo StyleSheet.
 * Regra 60-30-10: 60% fundo neutro, 30% cartões e superfícies, 10% roxo de ação.
 */

export interface ColorPalette {
  /** Roxo de ação (Chetwode Blue 600): botões principais, chip selecionado. */
  primary: string;
  onPrimary: string;
  /** Roxo mais escuro para textos e links sobre fundo claro (contadores, "Toque para testar"). */
  primaryStrong: string;
  /** Fundo roxo claro de selos e ícones em destaque. */
  primaryContainer: string;
  onPrimaryContainer: string;
  /** Etiqueta roxa dos cards (origem da receita). */
  tag: string;
  onTag: string;
  /** Fundo da tela (60%). */
  background: string;
  /** Cartões e campos (30%). */
  surface: string;
  /** Superfície rebaixada, como o painel de estados. */
  surfaceMuted: string;
  /** Chips inativos, botões secundários e etiquetas neutras. */
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  /** Placeholders, legendas e ícones apagados. */
  textMuted: string;
  border: string;
  success: string;
  successContainer: string;
  error: string;
  errorContainer: string;
  onErrorContainer: string;
  /** Âmbar dos ícones de tempo. */
  warning: string;
  /** Botões flutuantes sobre fotos (favoritar). */
  overlay: string;
  /** Toast: acompanha o tema (claro no tema claro, escuro no tema escuro). */
  toastSurface: string;
  onToast: string;
  toastAction: string;
  /** Véu escuro atrás de diálogos e gavetas. */
  scrim: string;
}

export const lightColors: ColorPalette = {
  primary: '#7752D5',
  onPrimary: '#FFFFFF',
  primaryStrong: '#5E37BB',
  primaryContainer: '#E9DDFF',
  onPrimaryContainer: '#5127AE',
  tag: '#E7DEFF',
  onTag: '#4C3596',
  background: '#F8F9FD',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F3F8',
  surfaceVariant: '#ECEEF2',
  text: '#191C1F',
  textSecondary: '#494453',
  textMuted: '#6E6879',
  border: '#E1E2E6',
  success: '#1E7A3E',
  successContainer: '#D8F3E0',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',
  warning: '#784800',
  overlay: 'rgba(255, 255, 255, 0.92)',
  toastSurface: '#E3E2E9',
  onToast: '#1D1F27',
  toastAction: '#5E37BB',
  scrim: 'rgba(25, 28, 31, 0.45)',
};

/** Tema escuro: mesmas funções, com superfícies escuras e roxo claro para textos. */
export const darkColors: ColorPalette = {
  primary: '#7752D5',
  onPrimary: '#FFFFFF',
  primaryStrong: '#CFBCFF',
  primaryContainer: '#3B2A70',
  onPrimaryContainer: '#E9DDFF',
  tag: '#352A5C',
  onTag: '#E7DEFF',
  background: '#111318',
  surface: '#1C1E24',
  surfaceMuted: '#181A1F',
  surfaceVariant: '#2A2D34',
  text: '#E3E2E9',
  textSecondary: '#C9C4D5',
  textMuted: '#9A95A4',
  border: '#3A3D45',
  success: '#6FD08C',
  successContainer: '#153D22',
  error: '#FFB4AB',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  warning: '#FFB95C',
  overlay: 'rgba(28, 30, 36, 0.92)',
  toastSurface: '#1D1F27',
  onToast: '#F0F0F7',
  toastAction: '#CFBCFF',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

/** Grade de 8 px do design system (com o 4 para ajustes finos). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radius = {
  /** Etiquetas dos cards. */
  sm: 6,
  /** Botões e itens de controle segmentado. */
  md: 8,
  /** Campo de busca, chips de origem, modais. */
  lg: 12,
  /** Cartões de receita. */
  xl: 16,
  full: 9999,
} as const;

/** Escala do roadmap: 14, 16, 20, 24 e 32. */
export const fontSize = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

/**
 * Plus Jakarta Sans, carregada em src/app/_layout.tsx. No Android, fontWeight não escolhe o peso de
 * uma fonte personalizada: cada peso é uma família diferente.
 */
export const fontFamily = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
} as const;

/** Estilos de texto do design system (tamanho / altura da linha / peso). */
export const typography = {
  /** 32/40 bold: passo do modo cozinha. */
  display: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40, letterSpacing: -0.6 },
  /** 24/32 bold: título da tela. */
  title: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 32, letterSpacing: -0.6 },
  /** 20/28 semibold: nomes de receita e títulos de seção. */
  headline: { fontFamily: fontFamily.semibold, fontSize: 20, lineHeight: 28, letterSpacing: -0.5 },
  /** 16/24 regular: instruções e descrições. */
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  /** 16/24 semibold: rótulo dos botões grandes. */
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 24 },
  /** 14/20 regular: textos de apoio. */
  small: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  /** 14/20 semibold: chips e botões pequenos. */
  label: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20 },
  /** 14/18 medium: etiquetas, contadores e metadados. */
  caption: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 18 },
  /** 14/18 medium em maiúsculas: rótulos de seção ("ORIGEM CULINÁRIA"). */
  overline: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  /** 11/11 bold: contador da aba Lista. */
  badge: { fontFamily: fontFamily.bold, fontSize: 11, lineHeight: 13 },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Sombras suaves do Figma (cartões e elementos flutuantes). */
export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

/** RNF08: área de toque mínima e fonte do modo cozinha. */
export const MIN_TOUCH_TARGET = 44;
/** Botões do modo cozinha, para mãos molhadas ("Próximo Passo (64px)"). */
export const COOKING_TOUCH_TARGET = 64;
export const COOKING_MIN_FONT_SIZE = 24;
