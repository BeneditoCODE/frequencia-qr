import { useState } from 'react';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { authApi } from '../../../../services/endpoints';
import Button from '../../../../components/ui/Button';
import Field from '../../../../components/ui/Field';
import { useToast } from '../../../../components/ui/Toast';

/** Troca de senha. Ao concluir, as demais sessões (outros aparelhos) são encerradas. */
export default function SenhaForm() {
  const toast = useToast();
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const { senha_atual, nova_senha, confirmar } = Object.fromEntries(new FormData(form));
    if (nova_senha !== confirmar) { setErro('A confirmação não confere com a nova senha.'); return; }
    setBusy(true); setErro('');
    try { await authApi.changePassword({ senha_atual, nova_senha }); form.reset(); toast('Senha alterada com sucesso'); }
    catch (err) { setErro(err.message); } finally { setBusy(false); }
  }

  return (
    <form className="card" onSubmit={enviar}>
      <div className="card-head"><h3>Segurança</h3></div>
      <Field label="Senha atual" icon={Lock} name="senha_atual" type="password" autoComplete="current-password" required />
      <div className="form-grid">
        <Field label="Nova senha" icon={KeyRound} name="nova_senha" type="password" autoComplete="new-password" minLength={6} placeholder="Mínimo de 6 caracteres" required />
        <Field label="Confirmar nova senha" icon={ShieldCheck} name="confirmar" type="password" autoComplete="new-password" minLength={6} required />
      </div>
      {erro && <div className="form-error" role="alert">{erro}</div>}
      <div className="form-foot"><Button type="submit" icon={ShieldCheck} disabled={busy}>Alterar senha</Button></div>
    </form>
  );
}
