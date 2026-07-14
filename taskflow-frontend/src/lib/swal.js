export const swalTheme = () => {
  const root = document.documentElement
  const get = (name) => getComputedStyle(root).getPropertyValue(name).trim()

  return {
    background: get('--card') || '#fff',
    color: get('--card-foreground') || '#111',
    confirmButtonColor: get('--primary') || '#3b82f6',
    cancelButtonColor: get('--muted-foreground') || '#6b7280',
    reverseButtons: true,
  }
}

export const swalDanger = () => {
  const root = document.documentElement
  const get = (name) => getComputedStyle(root).getPropertyValue(name).trim()

  return { confirmButtonColor: get('--destructive') || '#ef4444' }
}
