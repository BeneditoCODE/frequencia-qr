export default function Kpi({ icon: Icon, label, value, tone }) {
  return (
    <div className="card kpi">
      <span className={`kpi-icon${tone ? ` tone-${tone}` : ''}`}><Icon size={24} /></span>
      <div><strong>{value}</strong><span>{label}</span></div>
    </div>
  );
}
