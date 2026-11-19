import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Lock, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { homeDe } from '../../../routes/ProtectedRoute';
import Button from '../../../components/ui/Button';
import Field from '../../../components/ui/Field';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={homeDe(user)} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setErro('');
    try {
      const usuario = await login(Object.fromEntries(new FormData(e.currentTarget)));
      navigate(homeDe(usuario), { replace: true });
    } catch (err) { setErro(err.message); setBusy(false); }
  }

  return (
    <>
      <h1>Bem-vindo de volta</h1>
      <p className="muted">Entre com sua conta para continuar.</p>
      <form onSubmit={onSubmit}>
        <Field label="E-mail" icon={Mail} name="email" type="email" placeholder="seu@email.com" required />
        <Field label="Senha" icon={Lock} name="senha" type="password" placeholder="Sua senha" required />
        {erro && <div className="form-error" role="alert">{erro}</div>}
        <Button type="submit" block icon={LogIn} disabled={busy}>Entrar</Button>
      </form>
      <p className="auth-switch">Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </>
  );
}
