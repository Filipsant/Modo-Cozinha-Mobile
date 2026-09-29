import { remainingMs, useTimersStore } from './timersStore';

const store = () => useTimersStore.getState();
const timer = (id: string) => store().timers.find((item) => item.id === id)!;

beforeEach(() => {
  useTimersStore.setState(useTimersStore.getInitialState());
});

describe('timersStore', () => {
  it('calcula o restante pelo horário de término, mesmo que o app "durma"', () => {
    const id = store().start('Passo 1 · 10 min', 600, 1_000);

    // 4 minutos depois, sem nenhum "tique" no meio.
    expect(remainingMs(timer(id), 241_000)).toBe(360_000);
    expect(remainingMs(timer(id), 999_999)).toBe(0);
  });

  it('nunca mostra mais tempo do que o timer tinha, mesmo com o relógio da tela atrasado', () => {
    const id = store().start('Passo 1 · 1 min', 60, 10_000);

    expect(remainingMs(timer(id), 9_500)).toBe(60_000);
  });

  it('pausa guardando o restante e retoma com um novo horário de término', () => {
    const id = store().start('Passo 2 · 5 min', 300, 0);

    store().pause(id, 60_000);
    expect(timer(id)).toMatchObject({ status: 'paused', remainingMs: 240_000, endAt: null });
    expect(remainingMs(timer(id), 500_000)).toBe(240_000);

    store().resume(id, 500_000);
    expect(timer(id)).toMatchObject({ status: 'running', endAt: 740_000 });
  });

  it('roda vários timers ao mesmo tempo e remove um só', () => {
    const first = store().start('Passo 1', 60, 0);
    const second = store().start('Passo 3', 120, 0);

    store().remove(first);

    expect(store().timers.map((item) => item.id)).toEqual([second]);
  });

  it('marca como terminado e limpa tudo', () => {
    const id = store().start('Passo 1', 60, 0);

    store().complete(id);
    expect(timer(id).status).toBe('done');
    expect(remainingMs(timer(id), 0)).toBe(0);

    store().clearAll();
    expect(store().timers).toEqual([]);
  });
});
