import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { Button } from './Button';
import { Icon } from './Icon';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  cancelLabel?: string;
}

/**
 * Diálogo de confirmação do design system, para ações que não dá para desfazer.
 * O botão "voltar" do Android e o toque fora do cartão cancelam (onRequestClose).
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  cancelLabel = 'Cancelar',
}: ConfirmDialogProps) {
  const { colors, spacing, radius, shadows } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={[styles.backdrop, { backgroundColor: colors.scrim, padding: spacing.lg }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={onCancel}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.card,
            shadows.floating,
            { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
          ]}
        >
          <View style={[styles.titleRow, { gap: spacing.sm }]}>
            <Icon name="warning" color={colors.error} />
            <AppText accessibilityRole="header" variant="bodyStrong" tone="error" style={styles.title}>
              {title}
            </AppText>
          </View>
          <AppText variant="small" tone="secondary">
            {message}
          </AppText>
          <View style={[styles.actions, { gap: spacing.sm }]}>
            <Button label={cancelLabel} onPress={onCancel} variant="ghost" size="sm" />
            <Button label={confirmLabel} onPress={onConfirm} variant="danger" size="sm" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
