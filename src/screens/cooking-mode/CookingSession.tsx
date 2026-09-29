import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProgressBar, StepView, type StepNavigation } from '@/features/cooking-steps';
import { StartTimerButton, TimerBar, detectTimers } from '@/features/kitchen-timers';
import { WakeLockBadge, type WakeLockStatus } from '@/features/screen-wake-lock';
import { useTheme } from '@/shared/theme';
import { Button } from '@/shared/ui';

export interface CookingSessionProps {
  navigation: StepNavigation;
  step: string;
  wakeLock: WakeLockStatus;
  /** Relógio dos timers, vindo do useTimerAlarms da tela. */
  now: number;
}

/**
 * O passo atual com os timers do texto e os botões de 64 px para mãos molhadas. Os timers em andamento
 * flutuam acima dos botões: o texto do passo rola por baixo deles, e eles nunca saem de vista.
 */
export function CookingSession({ navigation, step, wakeLock, now }: CookingSessionProps) {
  const { colors, spacing } = useTheme();
  const stepNumber = navigation.index + 1;
  // Altura dos timers flutuantes, para o fim do texto do passo não ficar escondido embaixo deles.
  const [timersHeight, setTimersHeight] = useState(0);

  return (
    <>
      <View style={{ paddingHorizontal: spacing.md, gap: spacing.md }}>
        <WakeLockBadge status={wakeLock} />
        <ProgressBar current={stepNumber} total={navigation.total} />
      </View>

      <View style={styles.step}>
        <ScrollView
          {...navigation.swipeHandlers}
          contentContainerStyle={{
            padding: spacing.md,
            paddingTop: spacing.lg,
            paddingBottom: spacing.md + timersHeight,
          }}
        >
          <StepView step={step} number={stepNumber}>
            {detectTimers(step).map((timer) => (
              <StartTimerButton key={timer.text} timer={timer} stepNumber={stepNumber} />
            ))}
          </StepView>
        </ScrollView>

        <View
          pointerEvents="box-none"
          onLayout={(event) => setTimersHeight(event.nativeEvent.layout.height)}
          style={[styles.timers, { left: spacing.md, right: spacing.md, bottom: spacing.sm }]}
        >
          <TimerBar now={now} />
        </View>
      </View>

      <View style={[styles.footer, { padding: spacing.md, gap: 12, borderTopColor: colors.border }]}>
        <Button
          label="Anterior"
          icon="chevronLeft"
          variant="neutral"
          size="lg"
          disabled={navigation.isFirst}
          onPress={navigation.previous}
          accessibilityLabel="Passo anterior"
          style={styles.previous}
        />
        <Button
          label={navigation.isLast ? 'Concluir' : 'Próximo passo'}
          icon={navigation.isLast ? 'check' : 'chevronRight'}
          size="lg"
          onPress={navigation.next}
          style={styles.next}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  step: {
    flex: 1,
  },
  timers: {
    position: 'absolute',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  previous: {
    flex: 1,
  },
  next: {
    flex: 2,
  },
});
