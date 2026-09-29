import { Button } from '@/shared/ui';

import type { DetectedTimer } from '../lib/detectTimers';
import { formatDuration } from '../lib/formatDuration';
import { useTimersStore } from '../model/timersStore';

export interface StartTimerButtonProps {
  timer: DetectedTimer;
  /** Número do passo, para o nome do timer ("Passo 3 · 10 min"). */
  stepNumber: number;
}

/** Tempo encontrado no texto do passo que vira botão de timer (RF16). */
export function StartTimerButton({ timer, stepNumber }: StartTimerButtonProps) {
  const start = useTimersStore((state) => state.start);
  const duration = formatDuration(timer.seconds);
  const label = `Passo ${stepNumber} · ${duration}`;

  return (
    <Button
      label={`Timer ${duration}`}
      icon="timer"
      variant="tonal"
      size="sm"
      accessibilityLabel={`Iniciar timer de ${duration}`}
      onPress={() => start(label, timer.seconds)}
    />
  );
}
