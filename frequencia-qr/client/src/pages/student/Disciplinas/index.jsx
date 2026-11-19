import { BookOpen } from 'lucide-react';
import { useAsync } from '../../../hooks/useAsync';
import { alunoApi } from '../../../services/endpoints';
import EmptyState from '../../../components/ui/EmptyState';
import Loading from '../../../components/ui/Loading';
import FrequenciaCard from '../../../components/shared/FrequenciaCard';
import StudentHeader from '../../../components/shared/StudentHeader';

export default function Disciplinas() {
  const { data, loading } = useAsync(alunoApi.frequencia);
  if (loading && !data) return <Loading />;
  return (
    <>
      <StudentHeader eyebrow="Semestre atual" title="Disciplinas" />
      {data?.length
        ? <div className="stack">{data.map(f => <FrequenciaCard key={f.id} f={f} detalhes />)}</div>
        : <div className="card"><EmptyState icon={BookOpen} title="Nenhuma disciplina vinculada">Quando o professor adicionar você, ela aparece aqui.</EmptyState></div>}
    </>
  );
}
