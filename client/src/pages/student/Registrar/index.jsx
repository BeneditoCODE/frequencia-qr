import { useState } from 'react';
import { Keyboard, ScanLine } from 'lucide-react';
import { alunoApi } from '../../../services/endpoints';
import StudentHeader from '../../../components/shared/StudentHeader';
import CodeStep from './steps/CodeStep';
import ConfirmStep from './steps/ConfirmStep';
import ReceiptStep from './steps/ReceiptStep';
import ScanStep from './steps/ScanStep';
import './styles.css';

const MODOS = [
  { id: 'qr', icon: ScanLine, titulo: 'Ler QR Code', desc: 'Use a câmera do celular para ler o código do professor.' },
  { id: 'codigo', icon: Keyboard, titulo: 'Digitar código', desc: 'Use os 6 dígitos informados pelo professor.' },
];

/** Fluxo de registro: identificar (QR ou código) → confirmar → comprovante. */
export default function Registrar() {
  const [etapa, setEtapa] = useState('identificar');
  const [modo, setModo] = useState('qr');
  const [codigo, setCodigo] = useState('');
  const [previa, setPrevia] = useState(null);
  const [recibo, setRecibo] = useState(null);

  async function reconhecer(texto) {
    const p = await alunoApi.previa(texto);
    if (p.ja) throw new Error('Sua presença nesta aula já foi registrada.');
    setCodigo(texto); setPrevia(p); setEtapa('confirmar');
  }
  async function confirmar() { setRecibo(await alunoApi.registrar(codigo)); setEtapa('recibo'); }

  return (
    <>
      <StudentHeader eyebrow="Chamada da aula" title={etapa === 'recibo' ? 'Comprovante' : 'Registrar presença'} />
      <div className="steps">
        <b>{etapa === 'identificar' ? '1 · IDENTIFICAR' : '✓ IDENTIFICADO'}</b><i />
        {etapa === 'recibo' ? <b>2 · COMPROVANTE</b> : <span>2 · Comprovante</span>}
      </div>

      {etapa === 'identificar' && (
        <>
          <div className="modes">
            {MODOS.map(({ id, icon: Icon, titulo, desc }) => (
              <button key={id} className={`mode${modo === id ? ' on' : ''}`} onClick={() => setModo(id)}><Icon size={24} /><b>{titulo}</b><span>{desc}</span></button>
            ))}
          </div>
          {modo === 'qr' ? <ScanStep onCode={reconhecer} /> : <CodeStep onCode={reconhecer} />}
        </>
      )}
      {etapa === 'confirmar' && <ConfirmStep previa={previa} onConfirm={confirmar} onBack={() => setEtapa('identificar')} />}
      {etapa === 'recibo' && <ReceiptStep recibo={recibo} />}
    </>
  );
}
