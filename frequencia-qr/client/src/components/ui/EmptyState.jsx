export default function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="empty">
      {Icon && <Icon />}
      {title && <strong>{title}</strong>}
      {children && <p>{children}</p>}
    </div>
  );
}
