import { CalendarDays, User } from 'lucide-react';
import { fmtData, fmtHora } from '../../utils/format';

/** Cartão azul com os dados da aula (confirmação e comprovante). */
export default function AulaHero({ aula, selo }) {
  return (
    <div className="aula-hero">
      <span className="aula-selo">{selo}</span>
      <h2>{aula.disciplina}</h2>
      <p>Aula {aula.numero || '-'}{aula.tema && ` · ${aula.tema}`}</p>
      <div><User size={17} />Prof. {aula.professor}{aula.sala && ` • ${aula.sala}`}</div>
      <div className="strong"><CalendarDays size={17} />{fmtData(aula.inicio)} • {fmtHora(aula.inicio)}{aula.horario && ` • ${aula.horario}`}</div>
    </div>
  );
}
