export default function Progress({ value = 0, tone }) {
  return (
    <div className={`progress${tone ? ` tone-${tone}` : ''}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
