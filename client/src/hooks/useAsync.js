import { useCallback, useEffect, useState } from 'react';

/** Executa uma chamada assíncrona ao montar (e quando `deps` mudam). Expõe `reload`. */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => {
    setState(s => ({ ...s, loading: true }));
    return fn()
      .then(data => setState({ data, loading: false, error: '' }))
      .catch(e => setState({ data: null, loading: false, error: e.message }));
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { ...state, reload: run };
}
