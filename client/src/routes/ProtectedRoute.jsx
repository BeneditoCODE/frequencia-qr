import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/ui/Loading';

export const homeDe = user => (user.papel === 'professor' ? '/professor' : '/aluno');

/** Protege um grupo de rotas por sessão e (opcionalmente) por papel. */
export default function ProtectedRoute({ papel }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading full />;
  if (!user) return <Navigate to="/login" replace />;
  if (papel && user.papel !== papel) return <Navigate to={homeDe(user)} replace />;
  return <Outlet />;
}

export function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <Loading full />;
  return <Navigate to={user ? homeDe(user) : '/login'} replace />;
}
