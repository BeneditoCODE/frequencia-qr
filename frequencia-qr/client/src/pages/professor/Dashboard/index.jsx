import { BookOpen, CalendarDays, Plus, ScanLine, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAsync } from '../../../hooks/useAsync';
import { useProfessorActions } from '../../../hooks/useProfessorActions';
import { professorApi } from '../../../services/endpoints';
import { fmtData, pct, primeiroNome, saudacao } from '../../../utils/format';
import Avatar from '../../../components/ui/Avatar';
import BarChart from '../../../components/ui/BarChart';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Kpi from '../../../components/ui/Kpi';
import Loading from '../../../components/ui/Loading';
import Progress from '../../../components/ui/Progress';
import { RiscoTag } from '../../../components/ui/Tag';
import './styles.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { novaDisciplina } = useProfessorActions();
  const { data, loading, reload } = useAsync(professorApi.dashboard);

  if (loading && !data) return <Loading />;
  if (!data) return <EmptyState icon={BookOpen} title="Não foi possível carregar o painel" />;

  const { totais, disciplinas, risco, aulas } = data;
  const emAndamento = disciplinas.filter(d => d.aberta);
  const serie = [...aulas].reverse().map(a => ({
    label: `Aula ${a.numero || '-'}`, hint: `${a.disciplina} · ${a.pres}/${a.total}`, value: a.total ? Math.round((100 * a.pres) / a.total) : 0,
  }));
  const criar = async () => { if (await novaDisciplina()) reload(); };

  return (
    <>
      <section className="banner">
        <div><small>{saudacao()}</small><h1>Olá, {primeiroNome(user.nome)}</h1><p>Acompanhe a frequência das suas turmas em tempo real.</p></div>
        <Button variant="light" icon={Plus} onClick={criar}>Nova disciplina</Button>
      </section>

      {emAndamento.map(d => (
        <div className="live-strip" key={d.id}>
          <div className="row"><span className="pulse" /><div><b>Chamada em andamento</b><small>{d.nome}</small></div></div>
          <Button variant="light" size="sm" icon={ScanLine} onClick={() => navigate(`/professor/aulas/${d.aberta}`)}>Retomar chamada</Button>
        </div>
      ))}

      <div className="grid cols-4">
        <Kpi icon={BookOpen} label="Disciplinas" value={totais.disciplinas} />
        <Kpi icon={Users} label="Alunos" value={totais.alunos} />
        <Kpi icon={CalendarDays} label="Aulas realizadas" value={totais.aulas} />
        <Kpi icon={TrendingUp} label="Presença média" value={pct(totais.media)} />
      </div>

      <div className="grid cols-main dash-section">
        <div className="card">
          <div className="card-head"><h3>Presença nas últimas aulas</h3></div>
          {serie.length ? <BarChart data={serie} /> : <EmptyState icon={TrendingUp} title="Sem dados ainda">Inicie uma aula para ver o gráfico de presença.</EmptyState>}
        </div>
        <div className="card">
          <div className="card-head"><h3>Alunos em risco</h3></div>
          {risco.length ? risco.map((a, i) => (
            <div className="item" key={i}>
              <Avatar nome={a.aluno} />
              <div className="item-main"><b>{a.aluno}</b><span>{a.disciplina} · {a.faltas} falta(s)</span></div>
              <RiscoTag risco={a.risco} />
            </div>
          )) : <EmptyState icon={ShieldCheck} title="Tudo em dia">Nenhum aluno próximo do limite de faltas.</EmptyState>}
        </div>
      </div>

      <div className="grid cols-main dash-section">
        <div className="card">
          <div className="card-head"><h3>Presença por disciplina</h3></div>
          {disciplinas.length ? disciplinas.map(d => (
            <div key={d.id} style={{ marginBottom: 20 }}>
              <div className="row between" style={{ marginBottom: 8 }}><b>{d.nome}</b><b style={{ color: 'var(--blue)' }}>{pct(d.media)}</b></div>
              <Progress value={d.media || 0} />
            </div>
          )) : <EmptyState icon={BookOpen} title="Nenhuma disciplina">Cadastre uma disciplina para começar.</EmptyState>}
        </div>
        <div className="card">
          <div className="card-head"><h3>Últimas aulas</h3></div>
          {aulas.length ? aulas.slice(0, 6).map(a => (
            <div className="item" key={a.id}>
              <span className="avatar" style={{ background: 'var(--soft)', color: 'var(--blue)' }}><CalendarDays size={19} /></span>
              <div className="item-main"><b>{a.disciplina}</b><span>Aula {a.numero || '-'} · {fmtData(a.inicio)}</span></div>
              <b>{a.pres}/{a.total}</b>
            </div>
          )) : <EmptyState icon={CalendarDays} title="Nenhuma aula">As aulas realizadas aparecem aqui.</EmptyState>}
        </div>
      </div>
    </>
  );
}
