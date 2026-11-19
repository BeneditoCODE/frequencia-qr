const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  DB_FILE: process.env.DB_FILE || path.join(__dirname, '..', 'data', 'frequencia.db'),
  QR_WINDOW_MS: 15_000,     // o QR Code muda a cada 15s
  CODE_WINDOW_MS: 60_000,   // o código de 6 dígitos muda a cada 60s
  LIMITE_FALTAS: 0.25,      // reprova acima de 25% de faltas
  ALERTA_FALTAS: 0.2,       // alerta a partir de 20%
  SESSION_DAYS: 7,
};
