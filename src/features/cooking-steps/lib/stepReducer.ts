export interface StepState {
  index: number;
  /** true depois de avançar no último passo: a tela mostra "Receita concluída" e volta para o início. */
  finished: boolean;
}

export type StepAction = { type: 'next'; total: number } | { type: 'previous' };

export const INITIAL_STEP_STATE: StepState = { index: 0, finished: false };

/** Regras da navegação entre passos, sem React: avançar e voltar. */
export function stepReducer(state: StepState, action: StepAction): StepState {
  switch (action.type) {
    case 'next':
      if (action.total === 0) return state;
      return state.index >= action.total - 1
        ? { ...state, finished: true }
        : { index: state.index + 1, finished: false };
    case 'previous':
      return { ...state, index: Math.max(0, state.index - 1) };
  }
}
