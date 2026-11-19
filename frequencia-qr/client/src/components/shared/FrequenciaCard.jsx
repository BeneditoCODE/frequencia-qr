import { useDialog } from '../ui/Modal';
import Progress from '../ui/Progress';
import { RiscoTag } from '../ui/Tag';
import DisciplinaResumo from './DisciplinaResumo';

/** Card de frequência de uma disciplina; ao clicar abre o detalhamento. */
export default function FrequenciaCard({ f, detalhes = false }) {
  const { info } = useDialog();
  const abrir = () => info({ titulo: f.nome, corpo: <DisciplinaResumo f={f} /> });
  const tone = f.risco === 'reprovado' ? 'bad' : f.risco === 'risco' ? 'warn' : undefined;
  return (
    <div className="card hover" role="button" tabIndex={0} onClick={abrir} onKeyDown={e => e.key === 'Enter' && abrir()}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div className="grow">
          <h3 style={{ fontSize: 17 }}>{f.nome}</h3>
          {detalhes && <p className="muted sm" style={{ marginTop: 4 }}>Prof. {f.professor}{f.sala && ` · ${f.sala}`}{f.horario && ` · ${f.horario}`}</p>}
        </div>
        <strong style={{ fontFamily: 'var(--font-d)', fontSize: 28, color: 'var(--blue)' }}>{f.percentual}%</strong>
      </div>
      <div style={{ margin: '14px 0 12px' }}><Progress value={f.percentual} tone={tone} /></div>
      <div className="row between wrap">
        <span className="muted sm">{f.presencas} presença(s) · {f.faltas} falta(s) em {f.total} aula(s)</span>
        <RiscoTag risco={f.risco} />
      </div>
    </div>
  );
}
