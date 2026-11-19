const crypto = require('crypto');
const { QR_WINDOW_MS, CODE_WINDOW_MS } = require('../config');

const hmac = (segredo, msg) => crypto.createHmac('sha256', segredo).update(msg).digest('hex');
const janela = (ms, atras = 0) => Math.floor(Date.now() / ms) - atras;
const assinatura = (aula, w) => hmac(aula.segredo, `${aula.id}:${w}`).slice(0, 16);

/** Código do QR: `aulaId.janela.assinatura`. Muda a cada janela. */
exports.gerarQr = aula => {
  const w = janela(QR_WINDOW_MS);
  return { codigo: `${aula.id}.${w}.${assinatura(aula, w)}`, expira_em: (w + 1) * QR_WINDOW_MS - Date.now() };
};
/** Aceita a janela atual e a anterior (tolerância de leitura). */
exports.qrValido = (aula, w, sig) => [0, 1].some(a => Number(w) === janela(QR_WINDOW_MS, a)) && assinatura(aula, Number(w)) === sig;

exports.gerarManual = (aula, atras = 0) =>
  String(parseInt(hmac(aula.segredo, `n${janela(CODE_WINDOW_MS, atras)}`).slice(0, 8), 16) % 1e6).padStart(6, '0');
exports.manualValido = (aula, codigo) => [0, 1].some(a => exports.gerarManual(aula, a) === codigo);
