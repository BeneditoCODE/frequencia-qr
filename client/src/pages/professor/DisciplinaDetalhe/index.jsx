import { CalendarDays, ScanLine, Trash2, TrendingUp, TriangleAlert, UserPlus, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDialog } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { useAsync } from '../../../hooks/useAsync';
import { useProfessorActions } from '../../../hooks/useProfessorActions';
import { professorApi } from '../../../services/endpoints';
import { fmtData, pct } from '../../../utils/format';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import Kpi from '../../../components/ui/Kpi';
import Loading from '../../../components/ui/Loading';
import PageHeader from '../../../components/ui/PageHeader';
import Tag, { RiscoTag } from '../../../components/ui/Tag';

export default function DisciplinaDetalhe() {
  const { id } = useParams();
  const { confirm } = useDialog();
  const toast = useToast();
  const { adicionarAluno, iniciarAula } = useProfessorActions();
  const { data, loading, reload } = useAsync(() => professorApi.relatorio(id), [id]);

  if (loading && !data) return <Loading />;
  if (!data) return <EmptyState icon={TriangleAlert} title="Disciplina não encontrada" />;

  const { disciplina: d, alunos, aulas } = data;
  const presencas = aulas.reduce((n, a) => n + a.pres, 0);
  const possiveis = aulas.length * alunos.length;

  async function remover(a) {
    const ok = await confirm({ icone: Trash2, titulo: 'Remover aluno?', desc: `${a.nome} deixará de aparecer nesta disciplina. O histórico de presenças é mantido.`, ok: 'Remover', perigo: true });
    if (!ok) return;
    await professorApi.desmatricular(id, a.id);
    toast('Aluno removido'); reload();
  }

  return (
    <>
      <PageHeader back="/professor/disciplinas" eyebrow={`${d.sala || 'Disciplina'}${d.horario ? ` · ${d.horario}` : ''}`} title={d.nome}>
        <Button variant="secondary" icon={UserPlus} onClick={async () => { if (await adicionarAluno(id)) reload(); }}>Adicionar aluno</Button>
        <Button icon={ScanLine} onClick={() => iniciarAula(id)}>Iniciar aula</Button>
      </PageHeader>

      <div className="grid cols-4" style={{ marginBottom: 18 }}>
        <Kpi icon={Users} label="Alunos" value={alunos.length} />
        <Kpi icon={CalendarDays} label="Aulas" value={aulas.length} />
        <Kpi icon={TrendingUp} label="Presença média" value={pct(possiveis ? Math.round((100 * presencas) / possiveis) : null)} />
        <Kpi icon={TriangleAlert} label="Em risco" value={alunos.filter(a => a.risco !== 'ok').length} tone="warn" />
      </div>

      <div className="grid cols-main">
        <div className="card">
          <div className="card-head"><h3>Alunos</h3></div>
          {alunos.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Aluno</th><th>Matrícula</th><th>Presenças</th><th>Faltas</th><th>%</th><th>Situação</th><th /></tr></thead>
                <tbody>
                  {alunos.map(a => (
                    <tr key={a.id}>
                      <td><div className="row"><Avatar nome={a.nome} size={38} /><div><b>{a.nome}</b><div className="muted sm">{a.email}</div></div></div></td>
                      <td>{a.matricula || '—'}</td><td>{a.presencas}</td><td>{a.faltas}</td><td><b>{a.percentual}%</b></td>
                      <td>{a.risco === 'ok' ? <Tag tone="ok">Regular</Tag> : <RiscoTag risco={a.risco} />}</td>
                      <td><button className="icon-btn" aria-label={`Remover ${a.nome}`} onClick={() => remover(a)}><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState icon={Users} title="Nenhum aluno matriculado">Adicione alunos pelo e-mail cadastrado.</EmptyState>}
        </div>
        <div className="card">
          <div className="card-head"><h3>Aulas</h3></div>
          {aulas.length ? aulas.map(a => (
            <div className="item" key={a.id}>
              <span className="avatar" style={{ background: 'var(--soft)', color: 'var(--blue)' }}>{a.numero || '-'}</span>
              <div className="item-main"><b>{a.tema || `Aula ${a.numero || ''}`}</b><span>{fmtData(a.inicio)}{a.aberta ? ' · em andamento' : ''}</span></div>
              <b>{a.pres}/{alunos.length}</b>
            </div>
          )) : <EmptyState icon={CalendarDays} title="Nenhuma aula">Inicie a primeira aula desta disciplina.</EmptyState>}
        </div>
      </div>
    </>
  );
}
