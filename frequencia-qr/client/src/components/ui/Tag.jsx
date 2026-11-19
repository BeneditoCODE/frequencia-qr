export default function Tag({ tone, icon: Icon, children }) {
  return <span className={`tag${tone ? ` tone-${tone}` : ''}`}>{Icon && <Icon size={13} />}{children}</span>;
}

const RISCO = { risco: ['warn', 'Risco de reprovação'], reprovado: ['bad', 'Limite excedido'] };
/** Selo de risco por faltas; não renderiza nada quando está regular. */
export function RiscoTag({ risco }) {
  return RISCO[risco] ? <Tag tone={RISCO[risco][0]}>{RISCO[risco][1]}</Tag> : null;
}
