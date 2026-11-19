import { gradienteDe, iniciais } from '../../utils/format';

/** Avatar com foto (quando existir) ou iniciais sobre gradiente. */
export default function Avatar({ nome, foto, size = 42 }) {
  const medidas = { width: size, height: size, fontSize: size * 0.34 };
  if (foto) return <img className="avatar" src={foto} alt={nome} style={{ ...medidas, objectFit: 'cover' }} />;
  return <span className="avatar" style={{ ...medidas, background: gradienteDe(nome) }}>{iniciais(nome)}</span>;
}
