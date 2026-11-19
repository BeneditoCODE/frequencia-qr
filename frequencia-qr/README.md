# Frequência QR

Registro de frequência acadêmica por QR Code rotativo.

## Como rodar
Requer Node.js 22.13 ou superior.
```
npm run setup   # instala dependências (raiz, server e client)
npm run dev     # API em :3000 e interface em http://localhost:5173
```
Produção: `npm run build && npm start` (a API serve o frontend compilado em http://localhost:3000).
A câmera do celular exige HTTPS (ex.: `ngrok http 5173`).

## Estrutura
```
server/src
  config.js              constantes (janelas do QR, limite de faltas)
  db/                    conexão SQLite e schema
  middleware/            autenticação e tratamento de erros
  utils/                 códigos (QR/6 dígitos), cálculo de frequência, erros
  modules/<domínio>/     *.routes.js (HTTP) + *.service.js (regras e SQL)
    auth · disciplinas · aulas · presenca · dashboard
client/src
  App.jsx                rotas (React Router)
  context/               AuthContext
  services/              api.js (HTTP) e endpoints.js (chamadas por domínio)
  hooks/                 useAsync, usePolling, useProfessorActions
  components/ui/         Button, Modal, Toast, Kpi, Ring, BarChart...
  components/shared/     cards reutilizáveis (AulaHero, FrequenciaCard...)
  layouts/               Auth, Professor (sidebar), Student (tab bar)
  pages/auth|professor|student/<Tela>/   uma pasta por tela
  styles/                tokens, base, components, layouts
```
Rotas: `/login`, `/cadastro`, `/professor` (dashboard, `disciplinas`, `disciplinas/:id`, `aulas/:id`), `/aluno` (início, `disciplinas`, `registrar`, `historico`).

## Deploy
- **Frontend (Vercel):** Root Directory `client`, framework Vite. Edite `client/vercel.json` e troque `SEU-BACKEND.onrender.com` pela URL da API.
- **API (Render/Railway/Fly):** Root Directory `server`, build `npm install`, start `npm start`, Node 22+.
  Variáveis: `NODE_VERSION=22` e `DB_FILE=/var/data/frequencia.db` (caminho de um disco persistente).
- O Vercel faz proxy de `/api/*` para a API, então não há CORS nem variáveis de ambiente no frontend.
