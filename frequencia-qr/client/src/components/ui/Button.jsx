export default function Button({ variant = 'primary', size, block, icon: Icon, children, ...props }) {
  const cls = `btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''}${block ? ' btn-block' : ''}`;
  return (
    <button type="button" className={cls} {...props}>
      {Icon && <Icon size={size === 'sm' ? 16 : 19} />}
      {children}
    </button>
  );
}
