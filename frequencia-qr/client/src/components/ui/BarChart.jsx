/** Gráfico de barras (valores de 0 a 100). `data`: [{ label, hint, value }] */
export default function BarChart({ data }) {
  return (
    <div className="bars">
      {data.map((d, i) => (
        <div className="bar" key={i} title={d.hint}>
          <em>{d.value}%</em>
          <div className="bar-fill" style={{ height: `${Math.max(d.value * 0.78, 2)}%` }} />
          <small>{d.label}</small>
        </div>
      ))}
    </div>
  );
}
