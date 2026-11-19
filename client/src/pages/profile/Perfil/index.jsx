import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import PageHeader from '../../../components/ui/PageHeader';
import StudentHeader from '../../../components/shared/StudentHeader';
import DadosForm from './components/DadosForm';
import FotoCard from './components/FotoCard';
import SenhaForm from './components/SenhaForm';
import './styles.css';

/** Perfil compartilhado por professor e aluno (muda apenas o cabeçalho e os campos). */
export default function Perfil() {
  const { user, atualizarPerfil } = useAuth();
  const toast = useToast();
  const salvar = async (dados, mensagem) => { await atualizarPerfil(dados); toast(mensagem); };

  return (
    <>
      {user.papel === 'professor'
        ? <PageHeader eyebrow="Conta" title="Meu perfil" />
        : <StudentHeader eyebrow="Conta" title="Meu perfil" back="/aluno" />}
      <div className="perfil-grid">
        <FotoCard user={user} onSave={(foto, msg) => salvar({ foto }, msg)} />
        <div className="stack">
          <DadosForm user={user} onSave={salvar} />
          <SenhaForm />
        </div>
      </div>
    </>
  );
}
