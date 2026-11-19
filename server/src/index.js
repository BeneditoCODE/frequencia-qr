const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
