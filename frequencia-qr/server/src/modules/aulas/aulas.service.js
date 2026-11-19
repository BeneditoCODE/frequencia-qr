const crypto = require('crypto');
const db = require('../../db');
const { fail } = require('../../utils/errors');
const codigos = require('../../utils/codigos');
const { calcular } = require('../../utils/frequencia');
const { doProfessor: disciplinaDoProfessor } = require('../disciplinas/disciplinas.service');

const doProfessor = (id, professorId) =>
  db.prepare('SELECT a.* FROM aulas a JOIN disciplinas d ON d.id=a.disciplina_id WHERE a.id=? AND d.professor_id=?')
    .get(id, professorId) || fail('Aula não encontrada.', 404);

exports.iniciar = (disciplinaId, professorId, tema = '') => {
  const disciplina = disciplinaDoProfessor(disciplinaId, professorId);
  db.prepare('UPDATE aulas SET aberta=0, fim=CURRENT_TIMESTAMP WHERE disciplina_id=? AND aberta=1').run(disciplina.id);
  const numero = db.prepare('SELECT COUNT(*)+1 n FROM aulas WHERE disciplina_id=?').get(disciplina.id).n;
  const id = db.prepare('INSERT INTO aulas(disciplina_id,segredo,numero,tema) VALUES(?,?,?,?)')
    .run(disciplina.id, crypto.randomBytes(16).toString('hex'), numero, tema.trim()).lastInsertRowid;
  return { id: Number(id), disciplina: disciplina.nome };
};

exports.qr = (id, professorId) => {
  const aula = doProfessor(id, professorId);
  if (!aula.aberta) fail('Chamada encerrada.');
  return { ...codigos.gerarQr(aula), manual: codigos.gerarManual(aula) };
};

exports.painel = (id, professorId) => {
  const aula = doProfessor(id, professorId);
  const alunos = db.prepare(
    `SELECT u.id,u.nome,u.email,u.matricula,p.registrado_em FROM matriculas m JOIN users u ON u.id=m.aluno_id
     LEFT JOIN presencas p ON p.aula_id=? AND p.aluno_id=u.id WHERE m.disciplina_id=? ORDER BY u.nome`
  ).all(aula.id, aula.disciplina_id).map(a => ({ ...a, presente: !!a.registrado_em, ...calcular(aula.disciplina_id, a.id) }));
  const { nome } = db.prepare('SELECT nome FROM disciplinas WHERE id=?').get(aula.disciplina_id);
  return { aberta: !!aula.aberta, numero: aula.numero, tema: aula.tema, disciplina: nome, disciplina_id: aula.disciplina_id, alunos };
};

exports.encerrar = (id, professorId) => {
  doProfessor(id, professorId);
  db.prepare('UPDATE aulas SET aberta=0, fim=CURRENT_TIMESTAMP WHERE id=?').run(id);
  return { ok: true };
};
