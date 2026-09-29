import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useReduceMotion } from '@/shared/lib';
import { useTheme } from '@/shared/theme';
import { AppText, Icon, IconButton } from '@/shared/ui';

import { describeRemaining, formatCountdown } from '../lib/formatDuration';
import { remainingMs, useTimersStore, type KitchenTimer } from '../model/timersStore';

export interface TimerCardProps {
  timer: KitchenTimer;
  now: number;
}

/** Pisca o cartão do timer que terminou, para chamar a atenção de longe. Parado com "reduzir movimento". */
function usePulse(active: boolean): Animated.Value {
  const reduceMotion = useReduceMotion();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!active || reduceMotion) {
      opacity.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.55, duration: 450, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [active, reduceMotion, opacity]);

  return opacity;
}

/**
 * O timer em destaque no modo cozinha: contagem grande para ler de longe, barra de progresso e botões
 * de pausar e cancelar. Roxo rodando, branco pausado, vermelho piscando quando termina.
 */
export function TimerCard({ timer, now }: TimerCardProps) {
  const { colors, spacing, radius, shadows, typography } = useTheme();
  const pause = useTimersStore((state) => state.pause);
  const resume = useTimersStore((state) => state.resume);
  const remove = useTimersStore((state) => state.remove);
  const remaining = remainingMs(timer, now);
  const isDone = timer.status === 'done';
  const isRunning = timer.status === 'running';
  const opacity = usePulse(isDone);

  const palette = isDone
    ? { background: colors.errorContainer, text: colors.onErrorContainer, border: colors.error }
    : isRunning
      ? { background: colors.primary, text: colors.onPrimary, border: colors.primary }
      : { background: colors.surface, text: colors.text, border: colors.primary };
  const progress = timer.durationMs > 0 ? remaining / timer.durationMs : 0;
  const caption = isDone || isRunning ? timer.label : `${timer.label} · pausado`;

  return (
    <Animated.View
      accessible
      accessibilityLabel={`${timer.label}: ${isDone ? 'terminou' : describeRemaining(remaining)}${
        !isDone && !isRunning ? ', pausado' : ''
      }`}
      accessibilityLiveRegion={isDone ? 'assertive' : 'none'}
      style={[
        styles.card,
        shadows.floating,
        {
          opacity,
          backgroundColor: palette.background,
          borderColor: palette.border,
          borderRadius: radius.xl,
          padding: spacing.md,
          gap: spacing.sm,
        },
      ]}
    >
      <View style={[styles.row, { gap: spacing.sm }]}>
        <Icon name={isDone ? 'warning' : 'timer'} color={palette.text} scale={1.2} />
        <View style={styles.texts}>
          <AppText variant="caption" style={{ color: palette.text }} numberOfLines={1}>
            {caption}
          </AppText>
          <AppText style={[typography.display, styles.clock, { color: palette.text }]}>
            {isDone ? 'Terminou!' : formatCountdown(remaining)}
          </AppText>
        </View>
        {isDone ? null : (
          <IconButton
            icon={isRunning ? 'pause' : 'play'}
            variant={isRunning ? 'overlay' : 'primary'}
            iconColor={isRunning ? colors.primary : undefined}
            size="lg"
            accessibilityLabel={isRunning ? `Pausar ${timer.label}` : `Retomar ${timer.label}`}
            onPress={() => (isRunning ? pause(timer.id) : resume(timer.id))}
          />
        )}
        <IconButton
          icon="close"
          iconColor={palette.text}
          size="lg"
          accessibilityLabel={isDone ? `Fechar ${timer.label}` : `Cancelar ${timer.label}`}
          onPress={() => remove(timer.id)}
        />
      </View>

      {isDone ? null : (
        <View
          style={[
            styles.track,
            {
              borderRadius: radius.full,
              backgroundColor: isRunning ? 'rgba(255, 255, 255, 0.3)' : colors.surfaceVariant,
            },
          ]}
        >
          <View
            style={[
              styles.fill,
              {
                width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                borderRadius: radius.full,
                backgroundColor: isRunning ? colors.onPrimary : colors.primary,
              },
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texts: {
    flex: 1,
  },
  clock: {
    fontVariant: ['tabular-nums'],
    fontSize: 40,
    lineHeight: 48,
  },
  track: {
    height: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
