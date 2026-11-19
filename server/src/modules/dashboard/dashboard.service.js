const db = require('../../db');
const { calcular } = require('../../utils/frequencia');

exports.professor = professorId => {
  const disciplinas = [], risco = [], aulas = [], alunosUnicos = new Set();
  let presencas = 0, possiveis = 0, totalAulas = 0;

  for (const d of db.prepare('SELECT * FROM disciplinas WHERE professor_id=?').all(professorId)) {
    const alunos = db.prepare('SELECT u.id,u.nome FROM matriculas m JOIN users u ON u.id=m.aluno_id WHERE m.disciplina_id=?').all(d.id);
    const doAluno = alunos.map(a => ({ ...a, ...calcular(d.id, a.id) }));
    const aulasDisc = db.prepare(
      `SELECT a.id,a.numero,a.tema,a.inicio,a.aberta,(SELECT COUNT(*) FROM presencas p WHERE p.aula_id=a.id) pres
       FROM aulas a WHERE a.disciplina_id=? ORDER BY a.id DESC`
    ).all(d.id);
    const pres = aulasDisc.reduce((n, a) => n + a.pres, 0), pos = aulasDisc.length * alunos.length;

    alunos.forEach(a => alunosUnicos.add(a.id));
    doAluno.filter(a => a.risco !== 'ok').forEach(a =>
      risco.push({ aluno: a.nome, disciplina: d.nome, faltas: a.faltas, percentual: a.percentual, risco: a.risco }));
    presencas += pres; possiveis += pos; totalAulas += aulasDisc.length;
    disciplinas.push({
      id: d.id, nome: d.nome, sala: d.sala, horario: d.horario, alunos: alunos.length, aulas: aulasDisc.length,
      media: pos ? Math.round((100 * pres) / pos) : null, risco: doAluno.filter(a => a.risco !== 'ok').length,
      aberta: aulasDisc.find(a => a.aberta)?.id ?? null,
    });
    aulasDisc.slice(0, 10).forEach(a => aulas.push({ ...a, disciplina: d.nome, total: alunos.length }));
  }
  return {
    totais: { disciplinas: disciplinas.length, alunos: alunosUnicos.size, aulas: totalAulas, media: possiveis ? Math.round((100 * presencas) / possiveis) : null },
    disciplinas, risco, aulas: aulas.sort((a, b) => b.id - a.id).slice(0, 10),
  };
};
