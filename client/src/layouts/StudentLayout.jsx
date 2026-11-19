import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, History, Home, ScanLine } from 'lucide-react';

const TABS = [
  { to: '/aluno', label: 'Início', icon: Home, end: true },
  { to: '/aluno/disciplinas', label: 'Disciplinas', icon: BookOpen },
  { to: '/aluno/registrar', label: 'Registrar', icon: ScanLine, fab: true },
  { to: '/aluno/historico', label: 'Histórico', icon: History },
];

export default function StudentLayout() {
  return (
    <div className="mobile">
      <main className="fade"><Outlet /></main>
      <nav className="tabbar" aria-label="Navegação principal">
        {TABS.map(({ to, label, icon: Icon, end, fab }) => (
          <NavLink key={to} to={to} end={end} className={fab ? 'fab' : ''}>
            {fab ? <span><Icon size={26} /></span> : <Icon size={22} />}
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
