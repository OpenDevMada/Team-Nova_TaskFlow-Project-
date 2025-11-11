import { useState, useRef, useEffect } from 'react';
import { Search, Settings, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Fermer le dropdown en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            setIsDropdownOpen(false);
            await logout();
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // En cas d'erreur, forcer la déconnexion locale
            localStorage.removeItem('authToken');
            navigate(ROUTES.LOGIN);
        }
    };

    // Fonction pour les initiales de l'utilisateur
    const getUserInitials = () => {
        if (!user) return 'UK';
        const { firstName, lastName } = user;
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        }
        if (firstName) return firstName.charAt(0).toUpperCase();
        if (lastName) return lastName.charAt(0).toUpperCase();
        return user.email?.charAt(0).toUpperCase() || 'UK';
    };

    // Fonction pour le nom complet
    const getFullName = () => {
        if (!user) return 'Utilisateur';
        const { firstName, lastName } = user;
        if (firstName && lastName) return `${firstName} ${lastName}`;
        return firstName || lastName || user.email || 'Utilisateur';
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
            {/* Search */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Rechercher des projets, tâches..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        3
                    </span>
                </button>

                {/* Settings */}
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="h-5 w-5" />
                </button>

                {/* User Menu */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {getUserInitials()}
                        </div>
                        <span className="text-sm font-medium hidden sm:block">
                            {getFullName()}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
                            {/* En-tête avec infos utilisateur */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="text-sm font-medium text-gray-900">
                                    {getFullName()}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {user?.email}
                                </div>
                                <div className="text-xs text-blue-600 font-medium mt-1">
                                    {user?.roleGlobal || 'Membre'}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate('/profile');
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <User className="h-4 w-4" />
                                Mon profil
                            </button>

                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate('/settings');
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                Paramètres
                            </button>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;