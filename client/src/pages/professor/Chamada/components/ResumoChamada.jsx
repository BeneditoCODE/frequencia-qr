import { Check, TrendingUp, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pct } from '../../../../utils/format';
import Avatar from '../../../../components/ui/Avatar';
import Button from '../../../../components/ui/Button';
import EmptyState from '../../../../components/ui/EmptyState';
import Kpi from '../../../../components/ui/Kpi';
import PageHeader from '../../../../components/ui/PageHeader';

/** Resumo exibido após encerrar a chamada. */
export default function ResumoChamada({ painel }) {
  const navigate = useNavigate();
  const presentes = painel.alunos.filter(a => a.presente);
  const ausentes = painel.alunos.filter(a => !a.presente);
  const Lista = ({ itens, vazio }) => (itens.length ? itens.map(a => (
    <div className="item" key={a.id}><Avatar nome={a.nome} /><div className="item-main"><b>{a.nome}</b><span>{a.matricula || a.email}</span></div></div>
  )) : <EmptyState title={vazio} />);

  return (
    <>
      <PageHeader eyebrow="Chamada encerrada" title={painel.disciplina}>
        <Button onClick={() => navigate(`/professor/disciplinas/${painel.disciplina_id}`)}>Ver disciplina</Button>
      </PageHeader>
      <div className="grid cols-3" style={{ marginBottom: 18 }}>
        <Kpi icon={Check} label="Presentes" value={presentes.length} tone="ok" />
        <Kpi icon={X} label="Ausentes" value={ausentes.length} />
        <Kpi icon={TrendingUp} label="Presença" value={pct(painel.alunos.length ? Math.round((100 * presentes.length) / painel.alunos.length) : null)} />
      </div>
      <div className="grid cols-2">
        <div className="card"><div className="card-head"><h3>Presentes</h3></div><Lista itens={presentes} vazio="Ninguém registrou presença" /></div>
        <div className="card"><div className="card-head"><h3>Ausentes</h3></div><Lista itens={ausentes} vazio="Todos presentes" /></div>
      </div>
    </>
  );
}
