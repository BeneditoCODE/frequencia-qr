import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Maximize } from 'lucide-react';
import Button from '../../../../components/ui/Button';

/** Painel do projetor: QR Code rotativo, código de 6 dígitos e contagem regressiva. */
export default function QrPanel({ qr }) {
  const ref = useRef();
  const [fim, setFim] = useState(0);
  const [restante, setRestante] = useState(100);

  useEffect(() => { if (qr) setFim(Date.now() + qr.expira_em); }, [qr]);
  useEffect(() => {
    const id = setInterval(() => setRestante(Math.max(0, ((fim - Date.now()) / 15000) * 100)), 200);
    return () => clearInterval(id);
  }, [fim]);

  return (
    <div className="qr-panel" ref={ref}>
      <span className="qr-live"><span className="pulse" />CHAMADA ABERTA</span>
      <div><div className="qr-box">{qr ? <QRCodeSVG value={qr.codigo} size={208} fgColor="#142D4D" level="M" /> : null}</div></div>
      <div className="hint">Ou digite o código</div>
      <div className="qr-code">{qr ? qr.manual.replace(/(\d{3})(\d{3})/, '$1 $2') : '--- ---'}</div>
      <div className="qr-timer"><i style={{ width: `${restante}%` }} /></div>
      <small>O QR Code muda a cada 15 segundos</small>
      <div className="qr-fs" style={{ marginTop: 18 }}>
        <Button variant="glass" size="sm" icon={Maximize} onClick={() => ref.current?.requestFullscreen?.()}>Tela cheia para o projetor</Button>
      </div>
    </div>
  );
}
