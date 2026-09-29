import { useEffect, useState } from 'react';

/** Devolve o valor só depois de `delayMs` sem mudanças. Usado na busca (RF01: 400 ms). */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
