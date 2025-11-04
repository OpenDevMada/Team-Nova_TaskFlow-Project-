import React, { useState, useRef, useEffect } from "react"

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={selectRef} className="relative w-full">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { 
            value, 
            onValueChange, 
            isOpen, 
            setIsOpen 
          })
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, { 
            value,
            onValueChange, 
            isOpen, 
            setIsOpen 
          })
        }
        return child
      })}
    </div>
  )
}

export function SelectTrigger({ className = "", children, value, isOpen, setIsOpen }) {
  // Trouver la valeur affichée en cherchant dans les enfants SelectValue ou utiliser la valeur directement
  const displayValue = value || "Sélectionner..."

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className={value ? "text-gray-900" : "text-gray-400"}>
        {displayValue}
      </span>
      <svg
        className={`h-4 w-4 opacity-50 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export function SelectValue({ placeholder = "Sélectionner..." }) {
  // Ce composant est utilisé comme placeholder dans SelectTrigger
  // Il n'a pas besoin de render quelque chose directement
  return null
}

export function SelectContent({ children, value, onValueChange, isOpen, setIsOpen }) {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg z-50">
      <div className="max-h-48 overflow-auto rounded-md py-1">
        {React.Children.map(children, (child) => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, { 
              onValueChange, 
              setIsOpen,
              isSelected: child.props.value === value
            })
          }
          return child
        })}
      </div>
    </div>
  )
}

export function SelectItem({ value, children, onValueChange, setIsOpen, isSelected }) {
  return (
    <div
      className={`cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
        isSelected ? "bg-blue-50 text-blue-600" : ""
      }`}
      onClick={() => {
        if (onValueChange) {
          onValueChange(value)
        }
        if (setIsOpen) {
          setIsOpen(false)
        }
      }}
    >
      {children}
    </div>
  )
}