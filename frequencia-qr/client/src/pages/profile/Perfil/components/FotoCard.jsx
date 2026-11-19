import { useRef, useState } from 'react';
import { Camera, ImagePlus, Trash2 } from 'lucide-react';
import { prepararFoto } from '../../../../utils/imagem';
import Avatar from '../../../../components/ui/Avatar';
import Button from '../../../../components/ui/Button';
import { useDialog } from '../../../../components/ui/Modal';
import Tag from '../../../../components/ui/Tag';

/** Foto de perfil: escolher, trocar e remover. `onSave(foto|null)` persiste a alteração. */
export default function FotoCard({ user, onSave }) {
  const input = useRef();
  const { confirm } = useDialog();
  const [erro, setErro] = useState('');
  const [busy, setBusy] = useState(false);

  async function executar(tarefa) {
    setBusy(true); setErro('');
    try { await tarefa(); } catch (e) { setErro(e.message); } finally { setBusy(false); }
  }
  const escolher = e => {
    const arquivo = e.target.files[0];
    e.target.value = '';
    if (arquivo) executar(async () => onSave(await prepararFoto(arquivo), 'Foto atualizada'));
  };
  const remover = async () => {
    const ok = await confirm({ icone: Trash2, titulo: 'Remover foto?', desc: 'Suas iniciais voltarão a ser exibidas no lugar da foto.', ok: 'Remover', perigo: true });
    if (ok) executar(() => onSave(null, 'Foto removida'));
  };

  return (
    <div className="card foto-card">
      <div className="foto-cover" />
      <div className="foto-body">
        <div className="foto-wrap">
          <Avatar nome={user.nome} foto={user.foto} size={132} />
          <button className="foto-edit" aria-label="Alterar foto" disabled={busy} onClick={() => input.current.click()}><Camera size={19} /></button>
        </div>
        <h2>{user.nome}</h2>
        <p className="muted sm">{user.email}</p>
        <Tag>{user.papel === 'professor' ? 'Professor' : 'Aluno'}</Tag>
        <div className="foto-actions">
          <Button size="sm" icon={ImagePlus} disabled={busy} onClick={() => input.current.click()}>{user.foto ? 'Trocar foto' : 'Enviar foto'}</Button>
          {user.foto && <Button size="sm" variant="secondary" icon={Trash2} disabled={busy} onClick={remover}>Remover</Button>}
        </div>
        {erro && <div className="form-error" role="alert" style={{ marginTop: 14 }}>{erro}</div>}
        <p className="foto-hint">JPG, PNG ou WebP. A imagem é recortada em formato quadrado.</p>
        <input ref={input} type="file" accept="image/*" hidden onChange={escolher} />
      </div>
    </div>
  );
}
