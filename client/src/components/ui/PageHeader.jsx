import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ eyebrow, title, back, children }) {
  const navigate = useNavigate();
  return (
    <header className="page-head">
      <div className="row">
        {back && <button className="icon-btn" aria-label="Voltar" onClick={() => navigate(back)}><ArrowLeft size={22} /></button>}
        <div>{eyebrow && <small>{eyebrow}</small>}<h1>{title}</h1></div>
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}
