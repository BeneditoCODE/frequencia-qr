const db = require('../../db');
const { fail } = require('../../utils/errors');
const { calcular } = require('../../utils/frequencia');

const doProfessor = (id, professorId) =>
  db.prepare('SELECT * FROM disciplinas WHERE id=? AND professor_id=?').get(id, professorId) || fail('Disciplina não encontrada.', 404);

exports.doProfessor = doProfessor;

exports.criar = (professorId, { nome, sala = '', horario = '' }) => {
  if (!nome?.trim()) fail('Informe o nome da disciplina.');
  const id = db.prepare('INSERT INTO disciplinas(nome,sala,horario,professor_id) VALUES(?,?,?,?)')
    .run(nome.trim(), sala.trim(), horario.trim(), professorId).lastInsertRowid;
  return { id: Number(id) };
};

exports.matricular = (id, professorId, email = '') => {
  const disciplina = doProfessor(id, professorId);
  const aluno = db.prepare("SELECT * FROM users WHERE email=? AND papel='aluno'").get(email.trim().toLowerCase())
    || fail('Nenhum aluno cadastrado com esse e-mail.', 404);
  db.prepare('INSERT OR IGNORE INTO matriculas VALUES(?,?)').run(disciplina.id, aluno.id);
  return { ok: true, nome: aluno.nome };
};

exports.desmatricular = (id, professorId, alunoId) => {
  doProfessor(id, professorId);
  db.prepare('DELETE FROM matriculas WHERE disciplina_id=? AND aluno_id=?').run(id, alunoId);
  return { ok: true };
};

exports.relatorio = (id, professorId) => {
  const disciplina = doProfessor(id, professorId);
  const alunos = db.prepare(
    'SELECT u.id,u.nome,u.email,u.matricula FROM matriculas m JOIN users u ON u.id=m.aluno_id WHERE m.disciplina_id=? ORDER BY u.nome'
  ).all(id).map(a => ({ ...a, ...calcular(id, a.id) }));
  const aulas = db.prepare(
    `SELECT a.id,a.numero,a.tema,a.inicio,a.aberta,(SELECT COUNT(*) FROM presencas p WHERE p.aula_id=a.id) pres
     FROM aulas a WHERE a.disciplina_id=? ORDER BY a.id DESC`
  ).all(id);
  return { disciplina: { ...disciplina }, alunos, aulas };
};
