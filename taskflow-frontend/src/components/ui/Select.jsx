import React, { useState, useRef, useEffect, useMemo } from "react"

function collectLabels(children) {
  const map = {}
  React.Children.forEach(children, (child) => {
    if (child?.type === SelectContent) {
      React.Children.forEach(child.props?.children, (item) => {
        if (item?.type === SelectItem) {
          const label = typeof item.props.children === 'string'
            ? item.props.children
            : item.props.value
          map[item.props.value] = label
        }
      })
    }
  })
  return map
}

export function Select({ value, onValueChange, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)
  const labelMap = useMemo(() => collectLabels(children), [children])

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
            setIsOpen,
            labelMap,
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

export function SelectTrigger({ className = "", value, isOpen, setIsOpen, labelMap = {} }) {
  const displayValue = value ? (labelMap[value] || value) : "Sélectionner..."

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className={value ? "text-card-foreground" : "text-muted-foreground"}>
        {displayValue}
      </span>
      <svg
        className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export function SelectValue() {
  return null
}

export function SelectContent({ children, value, onValueChange, isOpen, setIsOpen }) {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-border bg-card shadow-lg z-50">
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
      className={`cursor-pointer px-3 py-2 text-sm text-card-foreground hover:bg-muted ${
        isSelected ? "bg-primary/10 text-primary" : ""
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