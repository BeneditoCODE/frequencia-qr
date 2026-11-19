import { BadgeCheck } from 'lucide-react';

/** Cartão de identificação do aluno. */
export default function AlunoCard({ aluno }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="row" style={{ fontWeight: 800 }}><BadgeCheck size={22} color="var(--blue)" />{aluno.nome}</div>
      {aluno.matricula && <div className="row between sm" style={{ marginTop: 14 }}><span className="muted">Matrícula</span><b>{aluno.matricula}</b></div>}
      {aluno.curso && <div className="row between sm" style={{ marginTop: 10 }}><span className="muted">Curso</span><b>{aluno.curso}</b></div>}
    </div>
  );
}
