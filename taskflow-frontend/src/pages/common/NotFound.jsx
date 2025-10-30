import { Link } from "react-router-dom"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page non trouvée</h2>
        <p className="text-muted-foreground max-w-md">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Home className="h-5 w-5" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
