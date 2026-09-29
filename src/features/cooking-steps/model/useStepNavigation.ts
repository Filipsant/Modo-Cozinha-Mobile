import { useEffect, useMemo, useReducer, useRef } from 'react';
import { AccessibilityInfo, PanResponder, type GestureResponderHandlers } from 'react-native';

import { INITIAL_STEP_STATE, stepReducer } from '../lib/stepReducer';

/** Distância mínima do deslize para trocar de passo, para não disparar sem querer. */
const SWIPE_THRESHOLD = 50;

export interface StepNavigation {
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  /** true depois de avançar no último passo: a tela mostra "Receita concluída" e volta para o início. */
  finished: boolean;
  next: () => void;
  previous: () => void;
  /** Espalhe no container do passo: deslizar para a esquerda avança, para a direita volta. */
  swipeHandlers: GestureResponderHandlers;
}

/** Passo atual (estado local: só o modo cozinha precisa saber) e navegação com as mãos ocupadas. */
export function useStepNavigation(total: number): StepNavigation {
  const [{ index, finished }, dispatch] = useReducer(stepReducer, INITIAL_STEP_STATE);
  const isFirstRender = useRef(true);

  // O gesto é recriado só quando o total muda (a receita terminou de carregar); dispatch nunca muda.
  const swipeHandlers = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 20 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 2,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx <= -SWIPE_THRESHOLD) dispatch({ type: 'next', total });
          else if (gesture.dx >= SWIPE_THRESHOLD) dispatch({ type: 'previous' });
        },
      }).panHandlers,
    [total],
  );

  // RNF06: anuncia o avanço de passos para o TalkBack e o VoiceOver (menos ao abrir a tela).
  // O fim da receita é anunciado pelo toast "Receita concluída".
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    AccessibilityInfo.announceForAccessibility(`Passo ${index + 1} de ${total}`);
  }, [index, total]);

  return {
    index,
    total,
    isFirst: index === 0,
    isLast: index === total - 1,
    finished,
    next: () => dispatch({ type: 'next', total }),
    previous: () => dispatch({ type: 'previous' }),
    swipeHandlers,
  };
}
