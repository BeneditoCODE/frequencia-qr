import { useState } from 'react';
import { GraduationCap, Hash, Mail, Save, User } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import Field from '../../../../components/ui/Field';

/** Dados pessoais editáveis (matrícula e curso apenas para alunos). */
export default function DadosForm({ user, onSave }) {
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setBusy(true); setErro('');
    try { await onSave(Object.fromEntries(new FormData(e.currentTarget)), 'Dados atualizados'); } catch (err) { setErro(err.message); } finally { setBusy(false); }
  }

  return (
    <form className="card" onSubmit={enviar}>
      <div className="card-head"><h3>Dados pessoais</h3></div>
      <div className="form-grid">
        <div className="full"><Field label="Nome completo" icon={User} name="nome" defaultValue={user.nome} required /></div>
        <div className="full"><Field label="E-mail" icon={Mail} name="email" type="email" defaultValue={user.email} required /></div>
        {user.papel === 'aluno' && (
          <>
            <Field label="Matrícula" icon={Hash} name="matricula" defaultValue={user.matricula || ''} placeholder="Ex.: 2024102087" />
            <Field label="Curso" icon={GraduationCap} name="curso" defaultValue={user.curso || ''} placeholder="Seu curso" />
          </>
        )}
      </div>
      {erro && <div className="form-error" role="alert">{erro}</div>}
      <div className="form-foot"><Button type="submit" icon={Save} disabled={busy}>Salvar alterações</Button></div>
    </form>
  );
}
