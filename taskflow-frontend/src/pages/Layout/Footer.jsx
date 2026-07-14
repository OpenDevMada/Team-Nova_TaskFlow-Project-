const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/50 px-6 py-3">
      <p className="text-center text-sm text-muted-foreground">
        &copy; {currentYear} TaskFlow — openDev Mada
      </p>
    </footer>
  )
}

export default Footer
