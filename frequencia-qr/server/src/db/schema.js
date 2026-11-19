module.exports = `
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY, nome TEXT NOT NULL, email TEXT UNIQUE NOT NULL, senha TEXT NOT NULL,
  papel TEXT NOT NULL CHECK(papel IN('professor','aluno')), matricula TEXT, curso TEXT, foto TEXT);
CREATE TABLE IF NOT EXISTS disciplinas(
  id INTEGER PRIMARY KEY, nome TEXT NOT NULL, sala TEXT, horario TEXT,
  professor_id INTEGER NOT NULL REFERENCES users(id));
CREATE TABLE IF NOT EXISTS matriculas(
  disciplina_id INTEGER REFERENCES disciplinas(id), aluno_id INTEGER REFERENCES users(id),
  PRIMARY KEY(disciplina_id, aluno_id));
CREATE TABLE IF NOT EXISTS aulas(
  id INTEGER PRIMARY KEY, disciplina_id INTEGER NOT NULL REFERENCES disciplinas(id), numero INTEGER, tema TEXT,
  segredo TEXT NOT NULL, aberta INTEGER DEFAULT 1, inicio TEXT DEFAULT CURRENT_TIMESTAMP, fim TEXT);
CREATE TABLE IF NOT EXISTS presencas(
  aula_id INTEGER REFERENCES aulas(id), aluno_id INTEGER REFERENCES users(id),
  registrado_em TEXT DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(aula_id, aluno_id));
CREATE TABLE IF NOT EXISTS sessoes(
  token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), criado_em TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_aulas_disc ON aulas(disciplina_id);
CREATE INDEX IF NOT EXISTS idx_mat_aluno ON matriculas(aluno_id);
`;
