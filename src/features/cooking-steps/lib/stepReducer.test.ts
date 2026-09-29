import { INITIAL_STEP_STATE, stepReducer, type StepAction, type StepState } from './stepReducer';

const run = (actions: StepAction[], from: StepState = INITIAL_STEP_STATE) =>
  actions.reduce(stepReducer, from);

describe('stepReducer', () => {
  it('avança um passo por vez', () => {
    expect(
      run([
        { type: 'next', total: 3 },
        { type: 'next', total: 3 },
      ]),
    ).toEqual({ index: 2, finished: false });
  });

  it('avançar no último passo conclui a receita', () => {
    expect(run([{ type: 'next', total: 1 }])).toEqual({ index: 0, finished: true });
  });

  it('volta um passo', () => {
    expect(run([{ type: 'previous' }], { index: 2, finished: false })).toEqual({ index: 1, finished: false });
  });

  it('não volta antes do primeiro passo', () => {
    expect(run([{ type: 'previous' }])).toEqual(INITIAL_STEP_STATE);
  });

  it('não faz nada sem passos (receita ainda carregando)', () => {
    expect(run([{ type: 'next', total: 0 }])).toEqual(INITIAL_STEP_STATE);
  });
});
