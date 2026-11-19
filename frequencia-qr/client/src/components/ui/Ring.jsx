/** Gráfico circular de porcentagem. */
export default function Ring({ value = 0, size = 112, light = false, children }) {
  const track = light ? '#ffffff2e' : 'var(--line)';
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={track} strokeWidth="3.4" />
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={light ? '#fff' : 'var(--blue)'} strokeWidth="3.4" strokeLinecap="round" strokeDasharray={`${value} 100`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-d)', fontWeight: 800, fontSize: size * 0.22 }}>{children}</div>
    </div>
  );
}
