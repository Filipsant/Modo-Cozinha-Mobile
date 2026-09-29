import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';

import { APP_BAR_HEIGHT } from './AppBar';
import { AppText } from './AppText';
import { Icon } from './Icon';
import type { IconName } from './icons/registry';
import { useToastStore, type ToastVariant } from './toastStore';

const DEFAULT_DURATION_MS = 4000;
const ACTION_DURATION_MS = 5000;
/** Largura máxima: em telas largas o toast fica compacto no canto, sem ocupar a linha toda. */
const MAX_WIDTH = 360;

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  info: 'info',
  success: 'taskAlt',
  error: 'error',
};

/**
 * Mostra o toast atual (ícone, mensagem e ação) à direita, logo abaixo do cabeçalho, claro no tema claro e
 * escuro no tema escuro. Fica no _layout raiz.
 */
export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const hide = useToastStore((state) => state.hide);
  const { colors, spacing, radius, shadows } = useTheme();
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    if (!toast) return;

    AccessibilityInfo.announceForAccessibility(toast.message);
    const duration = toast.durationMs ?? (toast.actionLabel ? ACTION_DURATION_MS : DEFAULT_DURATION_MS);
    const timeout = setTimeout(() => hide(toast.id), duration);
    return () => clearTimeout(timeout);
  }, [toast, hide]);

  if (!toast) return null;

  const variant = toast.variant ?? 'info';
  const iconColor =
    variant === 'error' ? colors.error : variant === 'success' ? colors.success : colors.toastAction;

  const handleAction = () => {
    toast.onAction?.();
    hide(toast.id);
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { top: top + APP_BAR_HEIGHT + spacing.sm, paddingHorizontal: spacing.md }]}
    >
      <View
        accessibilityLiveRegion="polite"
        style={[
          styles.toast,
          shadows.floating,
          {
            backgroundColor: colors.toastSurface,
            borderColor: colors.border,
            borderRadius: radius.lg,
            gap: 12,
            paddingLeft: spacing.md,
            // Com botão de ação, o próprio botão dá o respiro da direita.
            paddingRight: toast.actionLabel ? 6 : spacing.md,
          },
        ]}
      >
        <Icon name={VARIANT_ICON[variant]} color={iconColor} />
        <AppText variant="small" tone="onToast" style={styles.message}>
          {toast.message}
        </AppText>
        {toast.actionLabel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={toast.actionLabel}
            onPress={handleAction}
            style={({ pressed }) => [styles.action, { opacity: pressed ? 0.7 : 1 }]}
          >
            <AppText variant="label" style={[styles.actionLabel, { color: colors.toastAction }]}>
              {toast.actionLabel}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    // Encosta o toast na direita; a largura dele segue o tamanho da mensagem.
    alignItems: 'flex-end',
  },
  toast: {
    maxWidth: MAX_WIDTH,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  message: {
    // Quebra a linha só quando a mensagem passa da largura disponível.
    flexShrink: 1,
    paddingVertical: 8,
  },
  action: {
    minHeight: MIN_TOUCH_TARGET,
    minWidth: MIN_TOUCH_TARGET,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
