export function Button({ className = "", variant = "default", size = "default", children, ...props }) {
  const baseClasses =
    "inline-flex items-center justify-center cursor-pointer rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    active: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900",
    outline_gray: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    link: "text-blue-600 underline-offset-4 hover:underline",
    success: "bg-green-600 text-white hover:bg-green-700",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    xl: "h-11 w-48 rounded-md px-4",
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}
