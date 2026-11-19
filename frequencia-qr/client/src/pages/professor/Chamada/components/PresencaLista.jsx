import { Users } from 'lucide-react';
import { fmtHora } from '../../../../utils/format';
import Avatar from '../../../../components/ui/Avatar';
import EmptyState from '../../../../components/ui/EmptyState';
import Progress from '../../../../components/ui/Progress';
import Tag, { RiscoTag } from '../../../../components/ui/Tag';

/** Lista de alunos com status de presença em tempo real. */
export default function PresencaLista({ alunos }) {
  const presentes = alunos.filter(a => a.presente).length;
  const ordenados = [...alunos].sort((a, b) => Number(b.presente) - Number(a.presente));
  return (
    <div className="card">
      <div className="card-head"><h3>Presenças</h3><div className="counter">{presentes}<span> / {alunos.length}</span></div></div>
      <div style={{ marginBottom: 22 }}><Progress value={alunos.length ? (100 * presentes) / alunos.length : 0} /></div>
      {alunos.length ? ordenados.map(a => (
        <div className="item" key={a.id}>
          <Avatar nome={a.nome} />
          <div className="item-main"><b>{a.nome}</b><span>{a.faltas} falta(s)</span></div>
          <RiscoTag risco={a.risco} />
          {a.presente ? <Tag tone="ok">✔ {fmtHora(a.registrado_em)}</Tag> : <span className="muted sm">Aguardando</span>}
        </div>
      )) : <EmptyState icon={Users} title="Nenhum aluno matriculado">Adicione alunos na página da disciplina.</EmptyState>}
    </div>
  );
}
