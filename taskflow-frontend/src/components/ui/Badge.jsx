export function Badge({ className = "", variant = "default", children, ...props }) {
  const variants = {
    default: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
