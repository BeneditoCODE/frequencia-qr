import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GraduationCap, Hash, Lock, Mail, Presentation, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { homeDe } from '../../../routes/ProtectedRoute';
import Button from '../../../components/ui/Button';
import Field from '../../../components/ui/Field';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [papel, setPapel] = useState('aluno');
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={homeDe(user)} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setErro('');
    try {
      const usuario = await register({ ...Object.fromEntries(new FormData(e.currentTarget)), papel });
      navigate(homeDe(usuario), { replace: true });
    } catch (err) { setErro(err.message); setBusy(false); }
  }

  return (
    <>
      <h1>Criar conta</h1>
      <p className="muted">Escolha seu perfil e preencha seus dados.</p>
      <div className="seg" role="tablist">
        <button type="button" className={papel === 'aluno' ? 'on' : ''} onClick={() => setPapel('aluno')}><GraduationCap size={18} />Aluno</button>
        <button type="button" className={papel === 'professor' ? 'on' : ''} onClick={() => setPapel('professor')}><Presentation size={18} />Professor</button>
      </div>
      <form onSubmit={onSubmit}>
        <Field label="Nome completo" icon={User} name="nome" placeholder="Seu nome" required />
        {papel === 'aluno' && (
          <div className="grid cols-2" style={{ gap: 12 }}>
            <Field label="Matrícula" icon={Hash} name="matricula" placeholder="2024102087" />
            <Field label="Curso" icon={GraduationCap} name="curso" placeholder="Seu curso" />
          </div>
        )}
        <Field label="E-mail" icon={Mail} name="email" type="email" placeholder="seu@email.com" required />
        <Field label="Senha" icon={Lock} name="senha" type="password" placeholder="Mínimo de 6 caracteres" minLength={6} required />
        {erro && <div className="form-error" role="alert">{erro}</div>}
        <Button type="submit" block icon={UserPlus} disabled={busy}>Criar conta</Button>
      </form>
      <p className="auth-switch">Já tem conta? <Link to="/login">Entrar</Link></p>
    </>
  );
}
