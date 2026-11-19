import { Check, ScanLine, TriangleAlert, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAsync } from '../../../hooks/useAsync';
import { alunoApi } from '../../../services/endpoints';
import { fmtData, primeiroNome, saudacao } from '../../../utils/format';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Loading from '../../../components/ui/Loading';
import Ring from '../../../components/ui/Ring';
import Tag from '../../../components/ui/Tag';
import FrequenciaCard from '../../../components/shared/FrequenciaCard';
import StudentHeader from '../../../components/shared/StudentHeader';
import './styles.css';

export default function Inicio() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: disciplinas, loading } = useAsync(alunoApi.frequencia);
  const { data: abertas } = useAsync(alunoApi.abertas);

  if (loading && !disciplinas) return <Loading />;
  const lista = disciplinas ?? [];
  const presencas = lista.reduce((n, f) => n + f.presencas, 0);
  const total = lista.reduce((n, f) => n + f.total, 0);
  const geral = total ? Math.round((100 * presencas) / total) : 100;
  const emRisco = lista.filter(f => f.risco !== 'ok');
  const recentes = lista.flatMap(f => f.historico.map(h => ({ ...h, disciplina: f.nome }))).sort((a, b) => b.inicio.localeCompare(a.inicio)).slice(0, 5);

  return (
    <>
      <StudentHeader eyebrow={saudacao()} title={`Olá, ${primeiroNome(user.nome)}`} />

      <section className="hero-card">
        <div className="row" style={{ gap: 20 }}>
          <Ring value={geral} light size={108}>{geral}%</Ring>
          <div><h2>Presença geral</h2><p>{presencas} presença(s) em {total} aula(s)</p></div>
        </div>
        <Button variant="light" block icon={ScanLine} onClick={() => navigate('/aluno/registrar')}>Registrar presença</Button>
      </section>

      {(abertas ?? []).map((a, i) => (
        <div className="card live-card" key={i}>
          <div className="row between">
            <div className="grow">
              <div className="row" style={{ gap: 8 }}><span className="pulse" /><b className="sm" style={{ color: 'var(--blue)' }}>Chamada aberta agora</b></div>
              <h3 style={{ fontSize: 17, margin: '6px 0 2px' }}>{a.disciplina}</h3>
              <p className="muted sm">Aula {a.numero || '-'}{a.tema && ` · ${a.tema}`}</p>
            </div>
            {a.ja ? <Tag tone="ok">✔ Registrada</Tag> : <Button size="sm" onClick={() => navigate('/aluno/registrar')}>Registrar</Button>}
          </div>
        </div>
      ))}

      <div className="mini-stats">
        <div><strong>{lista.length}</strong><span>Disciplinas</span></div>
        <div><strong>{total - presencas}</strong><span>Faltas</span></div>
        <div><strong style={{ color: emRisco.length ? 'var(--bad)' : 'var(--ok)' }}>{emRisco.length}</strong><span>Em risco</span></div>
      </div>

      {emRisco.length > 0 && (
        <div className="tag tone-warn" style={{ borderRadius: 16, padding: '12px 16px', whiteSpace: 'normal', marginBottom: 6, width: '100%' }}>
          <TriangleAlert size={18} />Atenção às faltas em {emRisco.map(f => f.nome).join(', ')}.
        </div>
      )}

      <h3 className="section-title">Frequência por disciplina</h3>
      {lista.length ? <div className="stack">{lista.map(f => <FrequenciaCard key={f.id} f={f} />)}</div>
        : <div className="card"><EmptyState icon={ScanLine} title="Nenhuma disciplina ainda">Peça ao professor para adicionar seu e-mail na turma.</EmptyState></div>}

      {recentes.length > 0 && (
        <>
          <h3 className="section-title">Atividade recente</h3>
          <div className="card">
            {recentes.map((h, i) => (
              <div className="item" key={i}>
                <span className="avatar" style={{ background: h.presente ? 'var(--ok-bg)' : 'var(--bad-bg)', color: h.presente ? 'var(--ok)' : 'var(--bad)' }}>{h.presente ? <Check size={18} /> : <X size={18} />}</span>
                <div className="item-main"><b>{h.disciplina}</b><span>Aula {h.numero || '-'} · {fmtData(h.inicio)}</span></div>
                <Tag tone={h.presente ? 'ok' : 'bad'}>{h.presente ? 'Presente' : 'Falta'}</Tag>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
