import { useState } from 'react';
import { Check, History, X } from 'lucide-react';
import { useAsync } from '../../../hooks/useAsync';
import { alunoApi } from '../../../services/endpoints';
import { fmtData } from '../../../utils/format';
import EmptyState from '../../../components/ui/EmptyState';
import Loading from '../../../components/ui/Loading';
import Tag from '../../../components/ui/Tag';
import StudentHeader from '../../../components/shared/StudentHeader';

export default function Historico() {
  const { data, loading } = useAsync(alunoApi.frequencia);
  const [filtro, setFiltro] = useState(0);
  if (loading && !data) return <Loading />;

  const lista = data ?? [];
  const registros = lista.filter(f => !filtro || f.id === filtro)
    .flatMap(f => f.historico.map(h => ({ ...h, disciplina: f.nome })))
    .sort((a, b) => b.inicio.localeCompare(a.inicio));

  return (
    <>
      <StudentHeader eyebrow="Presenças e faltas" title="Histórico" />
      <div className="chips">
        <button className={!filtro ? 'on' : ''} onClick={() => setFiltro(0)}>Todas</button>
        {lista.map(f => <button key={f.id} className={filtro === f.id ? 'on' : ''} onClick={() => setFiltro(f.id)}>{f.nome}</button>)}
      </div>
      <div className="card">
        {registros.length ? registros.map((h, i) => (
          <div className="item" key={i}>
            <span className="avatar" style={{ background: h.presente ? 'var(--ok-bg)' : 'var(--bad-bg)', color: h.presente ? 'var(--ok)' : 'var(--bad)' }}>{h.presente ? <Check size={18} /> : <X size={18} />}</span>
            <div className="item-main"><b>{h.disciplina}</b><span>Aula {h.numero || '-'}{h.tema && ` · ${h.tema}`} · {fmtData(h.inicio)}</span></div>
            <Tag tone={h.presente ? 'ok' : 'bad'}>{h.presente ? 'Presente' : 'Falta'}</Tag>
          </div>
        )) : <EmptyState icon={History} title="Sem registros">Seu histórico aparece aqui após a primeira aula.</EmptyState>}
      </div>
    </>
  );
}
