import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MIN_TOUCH_TARGET, useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';
import type { IconName } from './icons/registry';
import { useToastStore, type ToastVariant } from './toastStore';

const DEFAULT_DURATION_MS = 4000;
const ACTION_DURATION_MS = 5000;
/** Altura da barra de abas: o toast aparece logo acima dela. */
const TAB_BAR_HEIGHT = 64;

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  info: 'info',
  success: 'taskAlt',
  error: 'error',
};

/** Mostra o toast atual (ícone, mensagem e ação), claro no tema claro e escuro no tema escuro. Fica no _layout raiz. */
export function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  const hide = useToastStore((state) => state.hide);
  const { colors, spacing, radius, shadows } = useTheme();
  const { bottom } = useSafeAreaInsets();

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
      style={[
        styles.wrapper,
        { bottom: bottom + TAB_BAR_HEIGHT + spacing.sm, paddingHorizontal: spacing.md },
      ]}
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
  },
  toast: {
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 6,
  },
  message: {
    flex: 1,
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
