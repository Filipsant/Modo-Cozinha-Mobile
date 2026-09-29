import { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

import { useNow } from '@/shared/lib';

import { playAlarm } from './alarm';
import { remainingMs, useTimersStore } from './timersStore';

/**
 * Relógio dos timers: atualiza a cada meio segundo enquanto algum timer roda e dispara o alarme
 * dos que chegaram a zero. Como o restante vem do horário de término, voltar ao app depois de
 * alguns minutos mostra o tempo certo na hora (o useNow atualiza ao voltar ao primeiro plano).
 */
export function useTimerAlarms(): number {
  const timers = useTimersStore((state) => state.timers);
  const complete = useTimersStore((state) => state.complete);
  const hasRunning = timers.some((timer) => timer.status === 'running');
  const now = useNow(500, hasRunning);

  useEffect(() => {
    for (const timer of timers) {
      if (timer.status === 'running' && remainingMs(timer, now) === 0) {
        complete(timer.id);
        playAlarm();
        AccessibilityInfo.announceForAccessibility(`Timer terminou: ${timer.label}`);
      }
    }
  }, [timers, now, complete]);

  return now;
}
