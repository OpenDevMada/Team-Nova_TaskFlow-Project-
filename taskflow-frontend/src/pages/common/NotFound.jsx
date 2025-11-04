import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page non trouvée</h1>
        <p className="text-gray-600 mb-8">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default NotFound
