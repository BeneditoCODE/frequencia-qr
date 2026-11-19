const db = require('../../db');
const { fail } = require('../../utils/errors');
const codigos = require('../../utils/codigos');
const { calcular } = require('../../utils/frequencia');

/** Localiza a aula aberta a partir do QR Code ou do código de 6 dígitos. */
function localizarAula(aluno, codigoBruto) {
  const codigo = String(codigoBruto || '').replace(/\s/g, '');
  let aula;
  if (/^\d{6}$/.test(codigo)) {
    aula = db.prepare(
      'SELECT a.* FROM aulas a JOIN matriculas m ON m.disciplina_id=a.disciplina_id WHERE a.aberta=1 AND m.aluno_id=?'
    ).all(aluno.id).find(a => codigos.manualValido(a, codigo));
  } else {
    const [id, janela, assinatura] = codigo.split('.');
    aula = db.prepare('SELECT * FROM aulas WHERE id=?').get(id);
    if (aula && !codigos.qrValido(aula, janela, assinatura)) aula = null;
  }
  if (!aula || !aula.aberta) fail('Código inválido ou expirado. Use o código atual exibido pelo professor.');
  if (!db.prepare('SELECT 1 FROM matriculas WHERE disciplina_id=? AND aluno_id=?').get(aula.disciplina_id, aluno.id))
    fail('Você não está matriculado nesta disciplina.', 403);
  return aula;
}

function detalhes(aula, aluno) {
  const d = db.prepare(
    'SELECT d.nome disciplina,d.sala,d.horario,p.nome professor FROM disciplinas d JOIN users p ON p.id=d.professor_id WHERE d.id=?'
  ).get(aula.disciplina_id);
  return {
    ...d, numero: aula.numero, tema: aula.tema, inicio: aula.inicio,
    aluno: { nome: aluno.nome, matricula: aluno.matricula, curso: aluno.curso },
    ja: !!db.prepare('SELECT 1 FROM presencas WHERE aula_id=? AND aluno_id=?').get(aula.id, aluno.id),
  };
}

exports.previa = (aluno, codigo) => detalhes(localizarAula(aluno, codigo), aluno);

exports.registrar = (aluno, codigo) => {
  const aula = localizarAula(aluno, codigo);
  const { changes } = db.prepare('INSERT OR IGNORE INTO presencas(aula_id,aluno_id) VALUES(?,?)').run(aula.id, aluno.id);
  if (!changes) fail('Sua presença nesta aula já foi registrada.', 409);
  return { ...detalhes(aula, aluno), registrado_em: new Date().toISOString() };
};

exports.chamadasAbertas = aluno =>
  db.prepare('SELECT a.* FROM aulas a JOIN matriculas m ON m.disciplina_id=a.disciplina_id WHERE a.aberta=1 AND m.aluno_id=?')
    .all(aluno.id).map(a => detalhes(a, aluno));

exports.frequencia = aluno =>
  db.prepare(
    `SELECT d.id,d.nome,d.sala,d.horario,u.nome professor FROM disciplinas d
     JOIN matriculas m ON m.disciplina_id=d.id JOIN users u ON u.id=d.professor_id WHERE m.aluno_id=?`
  ).all(aluno.id).map(d => ({
    ...d, ...calcular(d.id, aluno.id),
    historico: db.prepare(
      `SELECT a.inicio,a.numero,a.tema,p.registrado_em IS NOT NULL presente FROM aulas a
       LEFT JOIN presencas p ON p.aula_id=a.id AND p.aluno_id=? WHERE a.disciplina_id=? ORDER BY a.id DESC`
    ).all(aluno.id, d.id).map(h => ({ ...h, presente: !!h.presente })),
  }));
