const db = require('../db');
const { LIMITE_FALTAS, ALERTA_FALTAS } = require('../config');

/** Resumo de frequência de um aluno em uma disciplina. */
exports.calcular = (disciplinaId, alunoId) => {
  const total = db.prepare('SELECT COUNT(*) n FROM aulas WHERE disciplina_id=?').get(disciplinaId).n;
  const presencas = db.prepare(
    'SELECT COUNT(*) n FROM presencas p JOIN aulas a ON a.id=p.aula_id WHERE a.disciplina_id=? AND p.aluno_id=?'
  ).get(disciplinaId, alunoId).n;
  const faltas = total - presencas;
  const taxa = total ? faltas / total : 0;
  return {
    total, presencas, faltas,
    percentual: total ? Math.round((100 * presencas) / total) : 100,
    risco: taxa > LIMITE_FALTAS ? 'reprovado' : taxa >= ALERTA_FALTAS ? 'risco' : 'ok',
  };
};
