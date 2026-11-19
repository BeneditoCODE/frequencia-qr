import { BookOpen, Plus, ScanLine, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '../../../hooks/useAsync';
import { useProfessorActions } from '../../../hooks/useProfessorActions';
import { professorApi } from '../../../services/endpoints';
import { pct } from '../../../utils/format';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Loading from '../../../components/ui/Loading';
import PageHeader from '../../../components/ui/PageHeader';
import Tag from '../../../components/ui/Tag';

export default function Disciplinas() {
  const navigate = useNavigate();
  const { novaDisciplina, adicionarAluno, iniciarAula } = useProfessorActions();
  const { data, loading, reload } = useAsync(professorApi.dashboard);

  if (loading && !data) return <Loading />;
  const lista = data?.disciplinas ?? [];

  return (
    <>
      <PageHeader eyebrow="Semestre atual" title="Disciplinas">
        <Button icon={Plus} onClick={async () => { if (await novaDisciplina()) reload(); }}>Nova disciplina</Button>
      </PageHeader>

      {lista.length ? (
        <div className="grid cols-cards">
          {lista.map(d => (
            <div className="card" key={d.id}>
              <div className="row" style={{ marginBottom: 18 }}>
                <Avatar nome={d.nome} size={48} />
                <div className="grow"><h3 style={{ fontSize: 17 }}>{d.nome}</h3><span className="muted sm">{d.sala || 'Sem sala'}{d.horario && ` · ${d.horario}`}</span></div>
                {d.risco > 0 && <Tag tone="warn">{d.risco} em risco</Tag>}
              </div>
              <div className="grid cols-3" style={{ gap: 10, marginBottom: 18 }}>
                {[[d.alunos, 'Alunos'], [d.aulas, 'Aulas'], [pct(d.media), 'Presença']].map(([v, l]) => (
                  <div key={l} className="center" style={{ background: 'var(--bg)', borderRadius: 16, padding: '14px 8px' }}>
                    <strong style={{ fontFamily: 'var(--font-d)', fontSize: 20, color: 'var(--blue)' }}>{v}</strong><div className="muted sm">{l}</div>
                  </div>
                ))}
              </div>
              <div className="row wrap" style={{ gap: 8 }}>
                <Button size="sm" icon={ScanLine} onClick={() => (d.aberta ? navigate(`/professor/aulas/${d.aberta}`) : iniciarAula(d.id))}>{d.aberta ? 'Retomar chamada' : 'Iniciar aula'}</Button>
                <Button size="sm" variant="secondary" onClick={() => navigate(`/professor/disciplinas/${d.id}`)}>Detalhes</Button>
                <Button size="sm" variant="secondary" icon={UserPlus} onClick={async () => { if (await adicionarAluno(d.id)) reload(); }}>Aluno</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card"><EmptyState icon={BookOpen} title="Você ainda não tem disciplinas">Crie a primeira para vincular alunos e iniciar chamadas.</EmptyState></div>
      )}
    </>
  );
}
