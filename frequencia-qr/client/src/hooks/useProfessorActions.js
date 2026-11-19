import { Plus, ScanLine, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { professorApi } from '../services/endpoints';

/** Ações do professor que abrem modais (compartilhadas por várias telas). */
export function useProfessorActions() {
  const { form } = useDialog();
  const toast = useToast();
  const navigate = useNavigate();

  return {
    async novaDisciplina() {
      const r = await form({
        icone: Plus, titulo: 'Nova disciplina', desc: 'Cadastre a disciplina para vincular alunos e iniciar chamadas.', ok: 'Criar disciplina',
        campos: [
          { name: 'nome', label: 'Nome da disciplina', placeholder: 'Ex.: Engenharia de Software', required: true },
          { name: 'sala', label: 'Sala', placeholder: 'Ex.: ES-04' },
          { name: 'horario', label: 'Horário', placeholder: 'Ex.: 18:40–20:20' },
        ],
        submit: professorApi.criarDisciplina,
      });
      if (r) toast('Disciplina criada com sucesso');
      return !!r;
    },
    async adicionarAluno(disciplinaId) {
      const r = await form({
        icone: UserPlus, titulo: 'Adicionar aluno', desc: 'O aluno precisa ter uma conta cadastrada no sistema.', ok: 'Adicionar',
        campos: [{ name: 'email', label: 'E-mail do aluno', type: 'email', placeholder: 'aluno@email.com', required: true }],
        submit: v => professorApi.matricular(disciplinaId, v.email),
      });
      if (r) toast(`${r.nome} foi matriculado(a)`);
      return !!r;
    },
    async iniciarAula(disciplinaId) {
      const r = await form({
        icone: ScanLine, titulo: 'Iniciar aula', desc: 'Um QR Code temporário será gerado para a chamada.', ok: 'Iniciar chamada',
        campos: [{ name: 'tema', label: 'Tema da aula (opcional)', placeholder: 'Ex.: Testes de software' }],
        submit: v => professorApi.iniciarAula(disciplinaId, v.tema),
      });
      if (r) navigate(`/professor/aulas/${r.id}`);
    },
  };
}
