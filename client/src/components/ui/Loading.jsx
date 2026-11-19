export default function Loading({ full }) {
  return <div className={`loading${full ? ' full' : ''}`} role="status" aria-label="Carregando"><div className="spinner" /></div>;
}
