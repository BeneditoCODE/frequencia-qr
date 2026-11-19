import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, Flashlight, ScanLine, SwitchCamera } from 'lucide-react';
import Button from '../../../../components/ui/Button';

/** Leitura do QR Code pela câmera. `onCode(texto)` deve rejeitar quando o código for inválido. */
export default function ScanStep({ onCode }) {
  const video = useRef();
  const stream = useRef();
  const ocupado = useRef(false);
  const [ativa, setAtiva] = useState(false);
  const [facing, setFacing] = useState('environment');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!ativa) return undefined;
    let cancelado = false, timer;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } });
        if (cancelado) { s.getTracks().forEach(t => t.stop()); return; }
        stream.current = s; video.current.srcObject = s; await video.current.play(); setErro('');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        timer = setInterval(async () => {
          const v = video.current;
          if (ocupado.current || !v?.videoWidth) return;
          canvas.width = v.videoWidth; canvas.height = v.videoHeight; ctx.drawImage(v, 0, 0);
          const lido = jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
          if (!lido) return;
          ocupado.current = true;
          try { await onCode(lido.data); } catch (e) { setErro(e.message); setTimeout(() => { ocupado.current = false; }, 2500); }
        }, 300);
      } catch {
        setErro('Não foi possível acessar a câmera. Permita o acesso (é preciso HTTPS) ou use "Digitar código".'); setAtiva(false);
      }
    })();
    return () => { cancelado = true; clearInterval(timer); stream.current?.getTracks().forEach(t => t.stop()); };
  }, [ativa, facing]); // eslint-disable-line react-hooks/exhaustive-deps

  const lanterna = () => stream.current?.getVideoTracks()[0].applyConstraints({ advanced: [{ torch: true }] }).catch(() => setErro('Lanterna indisponível neste aparelho.'));

  return (
    <>
      <div className="scanner">
        {ativa ? (
          <>
            <video ref={video} playsInline muted />
            <span className="scan-badge"><Camera size={14} />CÂMERA ATIVA</span>
            <div className="scan-frame"><i /><i /><i /><i /><u /></div>
            <div className="scan-actions">
              <button onClick={lanterna}><Flashlight size={18} />Lanterna</button>
              <button onClick={() => setFacing(f => (f === 'environment' ? 'user' : 'environment'))}><SwitchCamera size={18} />Trocar câmera</button>
            </div>
          </>
        ) : <div className="scan-idle"><span><ScanLine size={40} /></span>Enquadre o QR Code do professor</div>}
      </div>
      {erro && <div className="form-error" role="alert">{erro}</div>}
      {!ativa && (
        <>
          <div className="callout"><Camera size={20} /><span>Permita o acesso à câmera para fazer a leitura. Nenhuma foto será salva no seu celular.</span></div>
          <Button block icon={Camera} onClick={() => setAtiva(true)}>Permitir e abrir câmera</Button>
        </>
      )}
    </>
  );
}
