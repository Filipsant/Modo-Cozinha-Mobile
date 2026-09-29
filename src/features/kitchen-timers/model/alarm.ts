import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

import beep from '../assets/timer-beep.wav';

/** Tempo para o bipe terminar antes de liberar o player da memória. */
const RELEASE_AFTER_MS = 2000;
const VIBRATION_PATTERN = [0, 400, 200, 400, 200, 400];

/**
 * Prepara o som ao entrar no modo cozinha: toca mesmo com o celular no silencioso e não
 * interrompe a música de quem está ouvindo algo enquanto cozinha.
 */
export async function prepareAlarm(): Promise<void> {
  await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' });
}

/**
 * Alerta quando um timer termina: vibração, resposta tátil e bipe.
 * Fica em model/, e não em lib/, porque usa módulos nativos (expo-audio e expo-haptics).
 */
export function playAlarm(): void {
  Vibration.vibrate(VIBRATION_PATTERN);
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);

  try {
    const player = createAudioPlayer(beep);
    player.play();
    setTimeout(() => player.remove(), RELEASE_AFTER_MS);
  } catch {
    // Sem áudio disponível: a vibração e o aviso na tela continuam funcionando.
  }
}
