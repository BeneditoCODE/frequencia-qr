const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../../db');
const { fail } = require('../../utils/errors');

const publico = u => ({ id: u.id, nome: u.nome, email: u.email, papel: u.papel, matricula: u.matricula, curso: u.curso, foto: u.foto });
const abrirSessao = userId => {
  const token = crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO sessoes(token,user_id) VALUES(?,?)').run(token, userId);
  return token;
};

exports.publico = publico;

exports.registrar = ({ nome, email, senha, papel, matricula = '', curso = '' }) => {
  if (!nome?.trim() || !email?.trim() || !senha || senha.length < 6) fail('Preencha todos os campos (senha com 6+ caracteres).');
  if (!['professor', 'aluno'].includes(papel)) fail('Perfil inválido.');
  let id;
  try {
    id = db.prepare('INSERT INTO users(nome,email,senha,papel,matricula,curso) VALUES(?,?,?,?,?,?)')
      .run(nome.trim(), email.trim().toLowerCase(), bcrypt.hashSync(senha, 10), papel, matricula.trim(), curso.trim()).lastInsertRowid;
  } catch {
    fail('Este e-mail já está cadastrado.', 409);
  }
  return { token: abrirSessao(id), usuario: publico(db.prepare('SELECT * FROM users WHERE id=?').get(id)) };
};

exports.entrar = ({ email = '', senha = '' }) => {
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(email.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(senha, user.senha)) fail('E-mail ou senha incorretos.', 401);
  return { token: abrirSessao(user.id), usuario: publico(user) };
};

const FOTO_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const FOTO_MAX = 400_000; // caracteres (~300 KB)

exports.atualizarPerfil = (user, dados) => {
  const nome = String(dados.nome ?? user.nome).trim();
  const email = String(dados.email ?? user.email).trim().toLowerCase();
  if (!nome) fail('Informe seu nome.');
  if (!/^\S+@\S+\.\S+$/.test(email)) fail('Informe um e-mail válido.');

  let foto = user.foto;
  if ('foto' in dados) {
    if (dados.foto === null) foto = null;
    else if (typeof dados.foto === 'string' && dados.foto.length <= FOTO_MAX && FOTO_RE.test(dados.foto)) foto = dados.foto;
    else fail('Imagem inválida ou muito grande.');
  }
  const aluno = user.papel === 'aluno';
  const matricula = aluno ? String(dados.matricula ?? user.matricula ?? '').trim() : user.matricula;
  const curso = aluno ? String(dados.curso ?? user.curso ?? '').trim() : user.curso;

  try {
    db.prepare('UPDATE users SET nome=?,email=?,matricula=?,curso=?,foto=? WHERE id=?').run(nome, email, matricula, curso, foto, user.id);
  } catch {
    fail('Este e-mail já está em uso por outra conta.', 409);
  }
  return publico(db.prepare('SELECT * FROM users WHERE id=?').get(user.id));
};

exports.alterarSenha = (user, tokenAtual, { senha_atual = '', nova_senha = '' }) => {
  if (!bcrypt.compareSync(senha_atual, user.senha)) fail('A senha atual está incorreta.');
  if (nova_senha.length < 6) fail('A nova senha deve ter pelo menos 6 caracteres.');
  if (nova_senha === senha_atual) fail('A nova senha deve ser diferente da atual.');
  db.prepare('UPDATE users SET senha=? WHERE id=?').run(bcrypt.hashSync(nova_senha, 10), user.id);
  // encerra as outras sessões abertas (outros aparelhos)
  db.prepare('DELETE FROM sessoes WHERE user_id=? AND token<>?').run(user.id, tokenAtual);
  return { ok: true };
};
