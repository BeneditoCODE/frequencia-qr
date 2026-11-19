import { useState } from 'react';
import { Check } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import AlunoCard from '../../../../components/shared/AlunoCard';
import AulaHero from '../../../../components/shared/AulaHero';

export default function ConfirmStep({ previa, onConfirm, onBack }) {
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);
  async function confirmar() {
    setBusy(true); setErro('');
    try { await onConfirm(); } catch (e) { setErro(e.message); setBusy(false); }
  }
  return (
    <>
      <h2 style={{ fontSize: 24 }}>Confira sua presença</h2>
      <p className="muted" style={{ marginTop: 6 }}>Verifique a aula e seus dados. Sua presença só será registrada após a confirmação.</p>
      <AulaHero aula={previa} selo={<><span className="pulse" />CHAMADA ABERTA</>} />
      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Você está registrando como</h3>
      <AlunoCard aluno={previa.aluno} />
      {erro && <div className="form-error" role="alert" style={{ marginTop: 14 }}>{erro}</div>}
      <Button block icon={Check} disabled={busy} onClick={confirmar} style={{ marginTop: 18 }}>Confirmar minha presença</Button>
      <button className="link-btn" onClick={onBack}>Não é esta aula? Escanear novamente</button>
    </>
  );
}
