import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute, { RootRedirect } from './routes/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import ProfessorLayout from './layouts/ProfessorLayout';
import StudentLayout from './layouts/StudentLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProfDashboard from './pages/professor/Dashboard';
import ProfDisciplinas from './pages/professor/Disciplinas';
import DisciplinaDetalhe from './pages/professor/DisciplinaDetalhe';
import Chamada from './pages/professor/Chamada';
import AlunoInicio from './pages/student/Inicio';
import AlunoDisciplinas from './pages/student/Disciplinas';
import Registrar from './pages/student/Registrar';
import Historico from './pages/student/Historico';
import Perfil from './pages/profile/Perfil';

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute papel="professor" />}>
        <Route path="/professor" element={<ProfessorLayout />}>
          <Route index element={<ProfDashboard />} />
          <Route path="disciplinas" element={<ProfDisciplinas />} />
          <Route path="disciplinas/:id" element={<DisciplinaDetalhe />} />
          <Route path="aulas/:id" element={<Chamada />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute papel="aluno" />}>
        <Route path="/aluno" element={<StudentLayout />}>
          <Route index element={<AlunoInicio />} />
          <Route path="disciplinas" element={<AlunoDisciplinas />} />
          <Route path="registrar" element={<Registrar />} />
          <Route path="historico" element={<Historico />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
