import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

const Unauthorized = () => {
    const { logout } = useAuth()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full text-center">
                <div className="text-6xl font-bold text-red-500 mb-4">403</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
                <p className="text-gray-600 mb-8">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
                <div className="space-y-4">
                    <Link
                        to="/"
                        className="block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                    >
                        Retour à l'accueil
                    </Link>
                    <button
                        onClick={logout}
                        className="block w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Unauthorized
