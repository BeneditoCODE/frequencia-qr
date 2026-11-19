import { Check, TriangleAlert, X } from 'lucide-react';
import { fmtData } from '../../utils/format';
import EmptyState from '../ui/EmptyState';

/** Conteúdo do modal de detalhes de uma disciplina (visão do aluno). */
export default function DisciplinaResumo({ f }) {
  const taxa = f.total ? Math.round((100 * f.faltas) / f.total) : 0;
  const msg = f.risco === 'reprovado' ? 'Você ultrapassou o limite de 25% de faltas.' : `Você está com ${taxa}% de faltas. O limite é 25%.`;
  return (
    <div style={{ marginTop: -8 }}>
      <p className="muted sm">Prof. {f.professor}{f.sala && ` · ${f.sala}`}{f.horario && ` · ${f.horario}`}</p>
      <div className="grid cols-3" style={{ gap: 10, margin: '18px 0' }}>
        {[[`${f.percentual}%`, 'Presença'], [f.presencas, 'Presenças'], [f.faltas, 'Faltas']].map(([v, l]) => (
          <div key={l} className="center" style={{ background: 'var(--bg)', borderRadius: 16, padding: 14 }}>
            <strong style={{ fontFamily: 'var(--font-d)', fontSize: 22, color: 'var(--blue)' }}>{v}</strong><div className="muted sm">{l}</div>
          </div>
        ))}
      </div>
      <div className="tag tone-warn" style={{ borderRadius: 14, padding: '10px 14px', marginBottom: 18, whiteSpace: 'normal' }}><TriangleAlert size={16} />{msg}</div>
      <h4 style={{ fontSize: 14, marginBottom: 12 }}>Aulas</h4>
      {f.historico.length ? f.historico.map((h, i) => (
        <div className="item" key={i}>
          <span className="avatar" style={{ width: 36, height: 36, background: h.presente ? 'var(--ok-bg)' : 'var(--bad-bg)', color: h.presente ? 'var(--ok)' : 'var(--bad)' }}>{h.presente ? <Check size={17} /> : <X size={17} />}</span>
          <div className="item-main"><b>Aula {h.numero || '-'}{h.tema && ` · ${h.tema}`}</b><span>{fmtData(h.inicio)}</span></div>
          <span className={`tag tone-${h.presente ? 'ok' : 'bad'}`}>{h.presente ? 'Presente' : 'Falta'}</span>
        </div>
      )) : <EmptyState title="Nenhuma aula registrada" />}
    </div>
  );
}
