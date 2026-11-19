import { useCallback, useState } from 'react';
import { Power } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDialog } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { usePolling } from '../../../hooks/usePolling';
import { professorApi } from '../../../services/endpoints';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import PageHeader from '../../../components/ui/PageHeader';
import PresencaLista from './components/PresencaLista';
import QrPanel from './components/QrPanel';
import ResumoChamada from './components/ResumoChamada';
import './styles.css';

export default function Chamada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { confirm } = useDialog();
  const toast = useToast();
  const [qr, setQr] = useState(null);
  const [painel, setPainel] = useState(null);
  const aberta = painel ? painel.aberta : true;

  const carregarQr = useCallback(() => professorApi.qr(id).then(setQr).catch(() => {}), [id]);
  const carregarPainel = useCallback(
    () => professorApi.painel(id).then(setPainel).catch(() => navigate('/professor/disciplinas', { replace: true })),
    [id, navigate]
  );
  usePolling(carregarQr, 4000, aberta);
  usePolling(carregarPainel, 3000, aberta);

  async function encerrar() {
    const ok = await confirm({ icone: Power, titulo: 'Encerrar chamada?', desc: 'Os alunos não poderão mais registrar presença nesta aula.', ok: 'Encerrar chamada', perigo: true });
    if (!ok) return;
    await professorApi.encerrar(id);
    await carregarPainel();
    toast('Chamada encerrada');
  }

  if (!painel) return <Loading />;
  if (!painel.aberta) return <ResumoChamada painel={painel} />;

  return (
    <>
      <PageHeader back={`/professor/disciplinas/${painel.disciplina_id}`} eyebrow={`Aula ${painel.numero || ''}${painel.tema ? ` · ${painel.tema}` : ''}`} title={painel.disciplina}>
        <Button variant="danger" icon={Power} onClick={encerrar}>Encerrar chamada</Button>
      </PageHeader>
      <div className="chamada">
        <QrPanel qr={qr} />
        <PresencaLista alunos={painel.alunos} />
      </div>
    </>
  );
}
