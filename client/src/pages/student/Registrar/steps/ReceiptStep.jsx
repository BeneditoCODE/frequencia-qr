import { BadgeCheck, Clock, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fmtData, fmtHora, primeiroNome } from '../../../../utils/format';
import Button from '../../../../components/ui/Button';
import AlunoCard from '../../../../components/shared/AlunoCard';
import AulaHero from '../../../../components/shared/AulaHero';

export default function ReceiptStep({ recibo }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="badge-big"><BadgeCheck size={44} /></div>
      <h2 className="center" style={{ fontSize: 28 }}>Presença registrada!</h2>
      <p className="muted center" style={{ marginTop: 8 }}>Tudo certo, {primeiroNome(recibo.aluno.nome)}. Sua presença nesta aula está confirmada.</p>
      <AulaHero aula={recibo} selo="✓ PRESENÇA REGISTRADA" />
      <AlunoCard aluno={recibo.aluno} />
      <div className="card row" style={{ marginTop: 12, padding: 18 }}>
        <span className="avatar" style={{ background: 'var(--soft)', color: 'var(--blue)' }}><Clock size={21} /></span>
        <div><div className="muted sm">Data e hora do registro</div><b>{fmtData(recibo.registrado_em)} • {fmtHora(recibo.registrado_em)}</b></div>
      </div>
      <Button block icon={History} onClick={() => navigate('/aluno/historico')} style={{ marginTop: 18 }}>Ver histórico de presenças</Button>
      <Button block variant="secondary" onClick={() => navigate('/aluno')} style={{ marginTop: 10 }}>Concluir</Button>
      <p className="muted center sm" style={{ marginTop: 16 }}>Este comprovante fica disponível no seu histórico. Não é necessário registrar novamente.</p>
    </>
  );
}
