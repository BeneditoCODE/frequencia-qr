import { useState } from 'react';
import { Lock } from 'lucide-react';
import Button from '../../../../components/ui/Button';

/** Digitação do código de 6 dígitos exibido no projetor. */
export default function CodeStep({ onCode }) {
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setBusy(true); setErro('');
    try { await onCode(codigo); } catch (err) { setErro(err.message); setBusy(false); }
  }

  return (
    <form onSubmit={enviar}>
      <h3 style={{ marginBottom: 6 }}>Digite o código da chamada</h3>
      <p className="muted sm" style={{ marginBottom: 16 }}>Use os 6 dígitos exibidos no projetor.</p>
      <input className="code-input" inputMode="numeric" maxLength={6} placeholder="······" autoComplete="one-time-code"
        value={codigo} onChange={e => setCodigo(e.target.value.replace(/\D/g, ''))} aria-label="Código de 6 dígitos" />
      {erro && <div className="form-error" role="alert">{erro}</div>}
      <div className="callout"><Lock size={20} /><span>Você só pode registrar sua presença enquanto a chamada estiver aberta pelo professor.</span></div>
      <Button type="submit" block disabled={busy || codigo.length < 6}>Continuar</Button>
    </form>
  );
}
