class AppError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const fail = (message, status) => { throw new AppError(message, status); };
/** Encapsula um handler para encaminhar erros (sync ou async) ao middleware central. */
const handle = fn => (req, res, next) => Promise.resolve().then(() => fn(req, res)).catch(next);

module.exports = { AppError, fail, handle };
