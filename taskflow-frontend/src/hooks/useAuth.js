import { useState, useEffect, useContext, createContext } from 'react';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constant';

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Provider d'authentification
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Vérifier l'authentification au chargement de l'application
    useEffect(() => {
        checkAuth();
    }, []);

    // Vérifier si l'utilisateur est authentifié
    const checkAuth = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('taskflow_access_token');
            const userData = localStorage.getItem('taskflow_user');

            if (token && userData) {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);

                // Optionnel: Valider le token avec le backend
                // await authService.getProfile();
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Connexion
    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.login(credentials);

            if (result.success) {
                setUser(result.data.user);
                setIsAuthenticated(true);
                navigate(ROUTES.HOME || '/');
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Inscription
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.register(userData);

            if (result.success) {
                setUser(result.data.user);
                setIsAuthenticated(true);
                navigate(ROUTES.HOME || '/');
                return { success: true };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Déconnexion
    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer le state local quoi qu'il arrive
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('taskflow_access_token');
            localStorage.removeItem('taskflow_user');
            setLoading(false);
            navigate(ROUTES.LOGIN);
        }
    };

    // Déconnexion de tous les appareils
    const logoutAll = async () => {
        try {
            setLoading(true);
            // Note: Vous devrez ajouter cette méthode dans authService
            // await authService.logoutAll();
            await authService.logout(); // Utiliser logout normal pour l'instant
        } catch (error) {
            console.error('Erreur lors de la déconnexion globale:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('taskflow_access_token');
            localStorage.removeItem('taskflow_user');
            setLoading(false);
            navigate(ROUTES.LOGIN);
        }
    };

    // Mettre à jour le profil
    const updateProfile = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.updateProfile(userData);

            if (result.success) {
                setUser(result.data);
                return { success: true, data: result.data };
            } else {
                setError(result.message || 'Erreur lors de la mise à jour du profil');
                return { success: false, error: result.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Changer le mot de passe
    const changePassword = async (passwordData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.changePassword(passwordData);

            if (result.success) {
                return { success: true, message: result.message };
            } else {
                setError(result.message || 'Erreur lors du changement de mot de passe');
                return { success: false, error: result.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Mot de passe oublié
    const forgotPassword = async (email) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.forgotPassword(email);

            if (result.success) {
                return { success: true, message: result.message };
            } else {
                setError(result.message || 'Erreur lors de la demande de réinitialisation');
                return { success: false, error: result.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de la demande de réinitialisation';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Réinitialiser le mot de passe
    const resetPassword = async (resetData) => {
        try {
            setLoading(true);
            setError(null);

            const result = await authService.resetPassword(resetData);

            if (result.success) {
                return { success: true, message: result.message };
            } else {
                setError(result.message || 'Erreur lors de la réinitialisation du mot de passe');
                return { success: false, error: result.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Rafraîchir le token
    const refreshToken = async () => {
        try {
            await authService.refreshToken();
            await checkAuth(); // Re-vérifier l'authentification
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
            logout(); // Déconnecter si le refresh échoue
        }
    };

    // Effacer les erreurs
    const clearError = () => setError(null);

    // Valeur du contexte
    const value = {
        // State
        user,
        isAuthenticated,
        loading,
        error,

        // Actions
        login,
        register,
        logout,
        logoutAll,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        refreshToken,
        clearError,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé simplifié pour une utilisation rapide
export const useAuthHook = () => {
    return useAuth();
};

export default useAuth;