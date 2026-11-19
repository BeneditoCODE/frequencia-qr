import { Outlet } from 'react-router-dom';
import { BarChart3, QrCode, ShieldCheck } from 'lucide-react';
import Brand from '../components/shared/Brand';

const DESTAQUES = [
  [QrCode, 'QR Code que muda a cada 15 segundos'],
  [BarChart3, 'Painel de presença em tempo real'],
  [ShieldCheck, 'Alerta automático de risco por faltas'],
];

export default function AuthLayout() {
  return (
    <div className="auth">
      <aside className="auth-aside">
        <Brand />
        <div>
          <h2>Chamada digital, rápida e segura.</h2>
          <p>O professor exibe o código, o aluno escaneia pelo celular e a presença é registrada na hora.</p>
          <div className="auth-points">
            {DESTAQUES.map(([Icon, texto]) => <div key={texto}><Icon />{texto}</div>)}
          </div>
        </div>
        <small style={{ color: '#9FB3D1' }}>Registro de frequência acadêmica</small>
      </aside>
      <main className="auth-main"><div className="auth-card fade"><Outlet /></div></main>
    </div>
  );
}
