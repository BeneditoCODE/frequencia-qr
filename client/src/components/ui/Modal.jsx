import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import Button from './Button';
import Field from './Field';

const DialogContext = createContext(null);
export const useDialog = () => useContext(DialogContext);

/**
 * Provedor de diálogos imperativos:
 *   form({ titulo, desc, campos, submit })  → valores/resultado do submit, ou null se cancelado
 *   confirm({ titulo, desc, perigo })       → boolean
 *   info({ titulo, corpo })                 → exibe conteúdo e aguarda fechar
 * `submit` pode lançar Error: a mensagem aparece dentro do modal.
 */
export function DialogProvider({ children }) {
  const [atual, setAtual] = useState(null);
  const abrir = useCallback(cfg => new Promise(resolve => setAtual({ cfg, resolve })), []);
  const fechar = valor => { atual.resolve(valor); setAtual(null); };

  const api = useMemo(() => ({
    form: abrir,
    confirm: cfg => abrir({ ...cfg, campos: [] }).then(Boolean),
    info: cfg => abrir({ ...cfg, semCancelar: true, ok: cfg.ok || 'Fechar' }),
  }), [abrir]);

  return (
    <DialogContext.Provider value={api}>
      {children}
      {atual && <Dialog cfg={atual.cfg} onClose={fechar} />}
    </DialogContext.Provider>
  );
}

function Dialog({ cfg, onClose }) {
  const { titulo, desc, campos = [], ok = 'Confirmar', perigo, semCancelar, corpo, submit, icone: Icone = Info } = cfg;
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose(null);
    document.addEventListener('keydown', onKey);
    ref.current?.querySelector('input')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSubmit(e) {
    e.preventDefault();
    const valores = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true); setErro('');
    try { onClose((submit ? await submit(valores) : valores) ?? valores); }
    catch (err) { setErro(err.message); setBusy(false); }
  }

  return (
    <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose(null)}>
      <form ref={ref} className="dialog" role="dialog" aria-modal="true" aria-label={titulo} onSubmit={onSubmit}>
        <div className="dialog-head">
          <span className="dialog-icon"><Icone size={24} /></span>
          <h3>{titulo}</h3>
          {desc && <p>{desc}</p>}
        </div>
        <div className="dialog-body">
          {corpo}
          {campos.map(({ label, ...c }) => <Field key={c.name} label={label} {...c} autoComplete="off" />)}
          {erro && <div className="form-error" role="alert">{erro}</div>}
          <div className="dialog-actions">
            {!semCancelar && <Button variant="secondary" size="sm" onClick={() => onClose(null)}>Cancelar</Button>}
            <Button type="submit" size="sm" variant={perigo ? 'danger' : 'primary'} disabled={busy}>{ok}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
