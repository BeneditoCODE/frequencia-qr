const fs = require('fs');
const path = require('path');
const express = require('express');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(express.json({ limit: '1mb' })); // foto de perfil chega como data URL
app.use('/api', require('./routes'), notFound);

// Em produção, serve o frontend compilado (client/dist)
const dist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use(errorHandler);
module.exports = app;
