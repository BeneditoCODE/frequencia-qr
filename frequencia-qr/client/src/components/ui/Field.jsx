/** Campo de formulário com rótulo e ícone opcional. */
export default function Field({ label, icon: Icon, children, ...input }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-box">
        {Icon && <Icon size={19} />}
        {children || <input {...input} />}
      </div>
    </label>
  );
}
