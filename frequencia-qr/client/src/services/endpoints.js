import { request as http } from './api';

const post = (path, body) => http(path, { method: 'POST', body });

export const authApi = {
  login: dados => post('/auth/login', dados),
  register: dados => post('/auth/register', dados),
  me: () => http('/auth/me'),
  updateProfile: dados => http('/auth/me', { method: 'PATCH', body: dados }),
  changePassword: dados => http('/auth/password', { method: 'PUT', body: dados }),
};

export const professorApi = {
  dashboard: () => http('/dashboard/professor'),
  criarDisciplina: dados => post('/disciplinas', dados),
  relatorio: id => http(`/disciplinas/${id}/relatorio`),
  matricular: (id, email) => post(`/disciplinas/${id}/alunos`, { email }),
  desmatricular: (id, alunoId) => http(`/disciplinas/${id}/alunos/${alunoId}`, { method: 'DELETE' }),
  iniciarAula: (id, tema) => post(`/disciplinas/${id}/aulas`, { tema }),
  qr: id => http(`/aulas/${id}/qr`),
  painel: id => http(`/aulas/${id}/painel`),
  encerrar: id => post(`/aulas/${id}/encerrar`),
};

export const alunoApi = {
  frequencia: () => http('/presenca/frequencia'),
  abertas: () => http('/presenca/abertas'),
  previa: codigo => post('/presenca/previa', { codigo }),
  registrar: codigo => post('/presenca', { codigo }),
};
