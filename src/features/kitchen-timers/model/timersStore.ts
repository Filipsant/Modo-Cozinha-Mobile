import { create } from 'zustand';

export type TimerStatus = 'running' | 'paused' | 'done';

export interface KitchenTimer {
  id: string;
  /** "Passo 3 · 10 min", para saber de qual passo é cada timer. */
  label: string;
  durationMs: number;
  /** Horário de término (Date.now() + restante). Só existe enquanto o timer está rodando. */
  endAt: number | null;
  /** Tempo que faltava quando foi pausado. */
  remainingMs: number;
  status: TimerStatus;
}

interface TimersState {
  timers: KitchenTimer[];
  start: (label: string, seconds: number, now?: number) => string;
  pause: (id: string, now?: number) => void;
  resume: (id: string, now?: number) => void;
  complete: (id: string) => void;
  remove: (id: string) => void;
  clearAll: () => void;
}

/**
 * Tempo restante calculado pelo horário de término, e não decrementando a cada segundo:
 * assim o timer não atrasa quando o app vai para segundo plano e os intervalos ficam lentos (ADR 007).
 */
export function remainingMs(timer: KitchenTimer, now: number): number {
  // O "agora" da tela pode estar até meio segundo atrasado: o restante nunca passa do que havia ao iniciar.
  if (timer.status === 'running' && timer.endAt !== null) {
    return Math.min(timer.remainingMs, Math.max(0, timer.endAt - now));
  }
  if (timer.status === 'done') return 0;
  return timer.remainingMs;
}

let nextId = 1;

const update = (timers: KitchenTimer[], id: string, change: (timer: KitchenTimer) => KitchenTimer) =>
  timers.map((timer) => (timer.id === id ? change(timer) : timer));

/** Timers em andamento: só na memória (sem persist), vários ao mesmo tempo (RF16). */
export const useTimersStore = create<TimersState>()((set) => ({
  timers: [],

  start: (label, seconds, now = Date.now()) => {
    const id = `timer-${nextId++}`;
    const durationMs = seconds * 1000;
    set((state) => ({
      timers: [
        ...state.timers,
        { id, label, durationMs, endAt: now + durationMs, remainingMs: durationMs, status: 'running' },
      ],
    }));
    return id;
  },

  pause: (id, now = Date.now()) =>
    set((state) => ({
      timers: update(state.timers, id, (timer) =>
        timer.status === 'running'
          ? { ...timer, status: 'paused', remainingMs: remainingMs(timer, now), endAt: null }
          : timer,
      ),
    })),

  resume: (id, now = Date.now()) =>
    set((state) => ({
      timers: update(state.timers, id, (timer) =>
        timer.status === 'paused' ? { ...timer, status: 'running', endAt: now + timer.remainingMs } : timer,
      ),
    })),

  complete: (id) =>
    set((state) => ({
      timers: update(state.timers, id, (timer) => ({
        ...timer,
        status: 'done',
        endAt: null,
        remainingMs: 0,
      })),
    })),

  remove: (id) => set((state) => ({ timers: state.timers.filter((timer) => timer.id !== id) })),

  clearAll: () => set({ timers: [] }),
}));
