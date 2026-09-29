import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText, Icon } from '@/shared/ui';

import type { WakeLockStatus } from '../model/useWakeLock';

export interface WakeLockBadgeProps {
  status: WakeLockStatus;
}

/** Selo "Tela sempre ligada", ou o aviso para ajustar o tempo de tela quando não há suporte. */
export function WakeLockBadge({ status }: WakeLockBadgeProps) {
  const { colors, radius } = useTheme();

  if (status === null) return null;

  const supported = status;
  const background = supported ? colors.successContainer : colors.errorContainer;
  const foreground = supported ? colors.success : colors.onErrorContainer;
  const text = supported ? 'Tela sempre ligada' : 'Ajuste o tempo de tela do celular';

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={
        supported
          ? 'Tela sempre ligada durante o modo cozinha'
          : 'Este aparelho não permite manter a tela ligada. Aumente o tempo de tela nas configurações.'
      }
      style={[styles.badge, { backgroundColor: background, borderRadius: radius.full }]}
    >
      <Icon name={supported ? 'wbSunny' : 'warning'} color={foreground} scale={0.8} />
      <AppText variant="caption" style={{ color: foreground }} numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
