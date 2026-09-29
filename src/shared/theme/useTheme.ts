import { useColorScheme } from 'react-native';

import {
  darkColors,
  fontFamily,
  fontSize,
  lightColors,
  radius,
  shadows,
  spacing,
  typography,
  type ColorPalette,
} from './tokens';

export interface Theme {
  scheme: 'light' | 'dark';
  colors: ColorPalette;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontFamily: typeof fontFamily;
  typography: typeof typography;
  shadows: typeof shadows;
}

/**
 * Tema atual, seguindo o sistema. A feature theme-switcher troca o tema
 * chamando Appearance.setColorScheme, então este hook não precisa conhecê-la.
 */
export function useTheme(): Theme {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return {
    scheme,
    colors: scheme === 'dark' ? darkColors : lightColors,
    spacing,
    radius,
    fontSize,
    fontFamily,
    typography,
    shadows,
  };
}
