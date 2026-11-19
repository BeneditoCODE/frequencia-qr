import { ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../ui/Modal';
import Avatar from '../ui/Avatar';

/** Cabeçalho das telas do aluno: voltar (opcional), sair e acesso ao perfil pela foto. */
export default function StudentHeader({ eyebrow, title, back }) {
  const { user, logout } = useAuth();
  const { confirm } = useDialog();
  const navigate = useNavigate();
  const sair = async () => {
    if (await confirm({ icone: LogOut, titulo: 'Sair da conta?', desc: 'Você precisará entrar novamente para continuar.', ok: 'Sair', perigo: true })) logout();
  };
  return (
    <header className="mobile-head">
      {back && <button className="icon-btn" aria-label="Voltar" onClick={() => navigate(back)}><ArrowLeft size={22} /></button>}
      <div className="grow"><small>{eyebrow}</small><h1>{title}</h1></div>
      <button className="icon-btn" aria-label="Sair" onClick={sair}><LogOut size={20} /></button>
      <Link to="/aluno/perfil" aria-label="Meu perfil"><Avatar nome={user.nome} foto={user.foto} size={44} /></Link>
    </header>
  );
}
