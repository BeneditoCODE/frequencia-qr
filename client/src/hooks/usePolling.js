import { useEffect } from 'react';

/** Chama `fn` imediatamente e a cada `ms` milissegundos enquanto `ativo`. `fn` deve ser estável (useCallback). */
export function usePolling(fn, ms, ativo = true) {
  useEffect(() => {
    if (!ativo) return undefined;
    fn();
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  }, [fn, ms, ativo]);
}
