import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../components/ui/Modal';
import Avatar from '../components/ui/Avatar';
import Brand from '../components/shared/Brand';
import { fmtHoje } from '../utils/format';

const MENU = [
  { to: '/professor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/professor/disciplinas', label: 'Disciplinas', icon: BookOpen },
  { to: '/professor/perfil', label: 'Meu perfil', icon: User },
];

export default function ProfessorLayout() {
  const { user, logout } = useAuth();
  const { confirm } = useDialog();
  const sair = async () => {
    if (await confirm({ icone: LogOut, titulo: 'Sair da conta?', desc: 'Você precisará entrar novamente para continuar.', ok: 'Sair', perigo: true })) logout();
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <Brand />
        <div className="nav-title">Menu</div>
        <nav>{MENU.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={20} />{label}</NavLink>)}</nav>
        <div className="usercard">
          <Avatar nome={user.nome} foto={user.foto} />
          <div className="grow"><b>{user.nome}</b><span>Professor</span></div>
          <button className="icon-btn" aria-label="Sair" onClick={sair}><LogOut size={19} /></button>
        </div>
      </aside>
      <div className="shell-main">
        <div className="topbar"><span className="date">{fmtHoje()}</span><Link to="/professor/perfil" aria-label="Meu perfil"><Avatar nome={user.nome} foto={user.foto} size={40} /></Link></div>
        <main className="content fade"><Outlet /></main>
      </div>
    </div>
  );
}
