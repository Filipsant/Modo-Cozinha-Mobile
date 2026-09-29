import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { AppText } from '@/shared/ui';

import { describeRemaining, formatCountdown } from '../lib/formatDuration';
import { remainingMs, useTimersStore, type KitchenTimer } from '../model/timersStore';
import { TimerCard } from './TimerCard';

export interface TimerBarProps {
  /** Horário atual, vindo do useTimerAlarms (um relógio só para todos os timers). */
  now: number;
}

/** O mais urgente primeiro: os que terminaram, depois os que rodam (menos tempo antes), depois os pausados. */
function byUrgency(now: number) {
  const rank = (timer: KitchenTimer) => (timer.status === 'done' ? 0 : timer.status === 'running' ? 1 : 2);
  return (a: KitchenTimer, b: KitchenTimer) => rank(a) - rank(b) || remainingMs(a, now) - remainingMs(b, now);
}

/**
 * Timers do modo cozinha (RF16). Um fica em destaque, em tamanho grande; os outros aparecem como pílulas
 * embaixo, e tocar numa pílula traz aquele timer para o destaque. A tela coloca este bloco flutuando
 * acima dos botões, então ele acompanha a rolagem do passo e nunca sai de vista.
 */
export function TimerBar({ now }: TimerBarProps) {
  const { colors, spacing, radius, shadows } = useTheme();
  const timers = useTimersStore((state) => state.timers);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const sorted = [...timers].sort(byUrgency(now));
  // Um timer que terminou sempre ganha o destaque; senão, vale o escolhido (ou o mais urgente).
  const focused =
    sorted.find((timer) => timer.status === 'done') ??
    sorted.find((timer) => timer.id === focusedId) ??
    sorted[0];

  if (!focused) return null;

  const others = sorted.filter((timer) => timer.id !== focused.id);

  return (
    <View accessibilityLabel="Timers" style={{ gap: spacing.sm }}>
      <TimerCard timer={focused} now={now} />
      {others.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm }}
        >
          {others.map((timer) => {
            const remaining = remainingMs(timer, now);
            const isDone = timer.status === 'done';
            return (
              <Pressable
                key={timer.id}
                accessibilityRole="button"
                accessibilityLabel={`${timer.label}: ${isDone ? 'terminou' : describeRemaining(remaining)}`}
                accessibilityHint="Mostra este timer em destaque"
                onPress={() => setFocusedId(timer.id)}
                style={[
                  styles.pill,
                  shadows.card,
                  { backgroundColor: colors.surface, borderRadius: radius.full, gap: spacing.sm },
                ]}
              >
                <AppText variant="caption" tone="secondary">
                  {timer.label}
                </AppText>
                <AppText variant="label" tone="primary" style={styles.clock}>
                  {isDone ? 'Terminou' : formatCountdown(remaining)}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  clock: {
    fontVariant: ['tabular-nums'],
  },
});
