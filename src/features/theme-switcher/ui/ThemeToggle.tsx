import { useTheme } from '@/shared/theme';
import { IconButton } from '@/shared/ui';

import { useThemeStore } from '../model/themeStore';

/** Botão de sol/lua do Início: troca entre claro e escuro e guarda a escolha. */
export function ThemeToggle() {
  const { scheme, colors } = useTheme();
  const setPreference = useThemeStore((state) => state.setPreference);
  const isDark = scheme === 'dark';

  return (
    <IconButton
      icon={isDark ? 'darkMode' : 'lightMode'}
      iconColor={colors.textSecondary}
      accessibilityLabel={isDark ? 'Usar tema claro' : 'Usar tema escuro'}
      onPress={() => setPreference(isDark ? 'light' : 'dark')}
    />
  );
}
