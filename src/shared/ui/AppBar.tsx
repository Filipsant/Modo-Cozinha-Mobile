import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

export interface AppBarProps {
  title: string;
  /** Com onBack, a seta de voltar substitui o logo. */
  onBack?: () => void;
  /** Botões à direita (favoritar, compartilhar...). */
  actions?: ReactNode;
}

/** Cabeçalho de 64 px do Figma: logo + "Modo Cozinha", ou seta de voltar + título. */
export function AppBar({ title, onBack, actions }: AppBarProps) {
  const { colors, spacing } = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: top, backgroundColor: colors.background }]}>
      <View style={[styles.row, { paddingHorizontal: onBack ? spacing.xs : spacing.md }]}>
        <View style={[styles.leading, { gap: spacing.sm }]}>
          {onBack ? (
            <IconButton icon="arrowBack" accessibilityLabel="Voltar" onPress={onBack} />
          ) : (
            <Icon name="logo" color={colors.primary} />
          )}
          <AppText accessibilityRole="header" variant="headline" numberOfLines={1} style={styles.title}>
            {title}
          </AppText>
        </View>
        {actions ? <View style={[styles.actions, { gap: spacing.xs }]}>{actions}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1,
  },
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
