export function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`btn ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
