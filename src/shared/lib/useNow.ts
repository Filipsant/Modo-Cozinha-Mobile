import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/**
 * Horário atual, atualizado a cada `intervalMs` e sempre que o app volta ao primeiro plano.
 * Os timers calculam o tempo restante a partir do horário de término, então um intervalo
 * atrasado (app em segundo plano) não acumula erro.
 */
export function useNow(intervalMs = 1000, enabled = true): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => setNow(Date.now()), intervalMs);
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'active') setNow(Date.now());
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [intervalMs, enabled]);

  return now;
}
