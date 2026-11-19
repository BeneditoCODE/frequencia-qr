exports.notFound = (_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, _req, res, _next) => {
  if (!err.status) console.error(err);
  res.status(err.status || 500).json({ erro: err.status ? err.message : 'Erro interno do servidor.' });
};
