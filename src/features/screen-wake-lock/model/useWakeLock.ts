import { activateKeepAwakeAsync, deactivateKeepAwake, isAvailableAsync } from 'expo-keep-awake';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const TAG = 'modo-cozinha';

/** null: ainda verificando · true: tela ligada · false: aparelho sem suporte. */
export type WakeLockStatus = boolean | null;

/**
 * Mantém a tela ligada enquanto o componente estiver na tela (RF17). Pede de novo quando o app
 * volta ao primeiro plano, porque o sistema pode soltar o bloqueio em segundo plano.
 */
export function useWakeLock(): WakeLockStatus {
  const [status, setStatus] = useState<WakeLockStatus>(null);

  useEffect(() => {
    let active = true;

    const activate = async () => {
      try {
        const available = Boolean(await isAvailableAsync());
        if (available) await activateKeepAwakeAsync(TAG);
        if (active) setStatus(available);
      } catch {
        if (active) setStatus(false);
      }
    };

    void activate();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void activate();
    });

    return () => {
      active = false;
      subscription.remove();
      deactivateKeepAwake(TAG).catch(() => undefined);
    };
  }, []);

  return status;
}
