const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { DB_FILE } = require('../config');

fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;');
db.exec(require('./schema'));
// Migração para bancos criados antes da coluna de foto
try { db.exec('ALTER TABLE users ADD COLUMN foto TEXT'); } catch { /* coluna já existe */ }

module.exports = db;
