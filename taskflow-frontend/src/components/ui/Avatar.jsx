export function Avatar({ src, alt = "", fallback = "?", className = "" }) {
    return (
        <div
            className={`relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 overflow-hidden ${className}`}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        e.target.style.display = "none"
                        e.target.parentNode.querySelector(".avatar-fallback").style.display = "flex"
                    }}
                />
            ) : null}
            <span className="avatar-fallback absolute inset-0 flex items-center justify-center text-gray-600 font-medium">
                {fallback}
            </span>
        </div>
    )
}
