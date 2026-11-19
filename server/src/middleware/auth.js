const db = require('../db');
const { AppError } = require('../utils/errors');
const { SESSION_DAYS } = require('../config');

/** Exige sessão válida e, opcionalmente, um dos papéis informados. */
exports.authenticate = (...papeis) => (req, _res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const user = db.prepare(
    `SELECT u.* FROM sessoes s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.criado_em > datetime('now', ?)`
  ).get(token, `-${SESSION_DAYS} days`);
  if (!user) return next(new AppError('Sessão expirada. Entre novamente.', 401));
  if (papeis.length && !papeis.includes(user.papel)) return next(new AppError('Sem permissão.', 403));
  req.user = user;
  req.token = token;
  next();
};
