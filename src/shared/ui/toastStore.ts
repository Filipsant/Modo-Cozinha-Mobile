import { create } from 'zustand';

export type ToastVariant = 'info' | 'success' | 'error';

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  /** Texto do botão do toast, como "Desfazer" ou "Ver lista". */
  actionLabel?: string;
  onAction?: () => void;
  /** Padrão: 4 s; com ação, 5 s (tempo do "Desfazer" do roadmap). */
  durationMs?: number;
}

export interface ActiveToast extends ToastOptions {
  id: number;
}

interface ToastState {
  toast: ActiveToast | null;
  show: (options: ToastOptions) => void;
  /** Esconde o toast; com id, só se ainda for o mesmo (um toast novo não é apagado pelo antigo). */
  hide: (id?: number) => void;
}

let nextId = 1;

/** Estado em memória (sem persist): só existe um toast por vez, o mais recente. */
export const useToastStore = create<ToastState>()((set) => ({
  toast: null,
  show: (options) => set({ toast: { ...options, id: nextId++ } }),
  hide: (id) => set((state) => (id === undefined || state.toast?.id === id ? { toast: null } : state)),
}));

/** Mostra um toast de qualquer lugar do app, inclusive fora de componentes. */
export function showToast(options: ToastOptions): void {
  useToastStore.getState().show(options);
}
