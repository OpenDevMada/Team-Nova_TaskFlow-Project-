import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Plus,
    ChevronLeft,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navigation = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/" },
        { name: "Projets", icon: FolderKanban, href: "/projects" },
        { name: "Mes tâches", icon: CheckSquare, href: "/tasks" },
        { name: "Équipe", icon: Users, href: "/team" },
    ];

    const isActive = (href) => {
        if (href === "/") return location.pathname === "/";
        return location.pathname.startsWith(href);
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

    // Fonction pour le rôle
    const getUserRole = () => {
        if (!user) return 'Membre';
        return user.roleGlobal === 'admin' ? 'Admin' :
            user.roleGlobal === 'member' ? 'Membre' : 'Viewer';
    };

    // Fonction de déconnexion
    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setActiveTooltip(null);

        try {
            console.log('🚪 Déconnexion depuis la sidebar...');
            await logout();
            console.log('Déconnexion réussie');

            // Redirection après déconnexion
            window.location.replace(ROUTES.LOGIN);

        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            // En cas d'erreur, forcer la déconnexion locale
            localStorage.removeItem('authToken');
            navigate(ROUTES.LOGIN, { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <aside
            className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm">
                            TF
                        </div>
                        <span className="font-semibold text-lg text-gray-900">TaskFlow</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <div key={item.name} className="relative">
                            <Link
                                to={item.href}
                                onMouseEnter={() => collapsed && setActiveTooltip(item.name)}
                                onMouseLeave={() => collapsed && setActiveTooltip(null)}
                            >
                                <button
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${collapsed ? "justify-center px-2" : "justify-start"
                                        } ${active
                                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {!collapsed && <span className="font-medium">{item.name}</span>}
                                </button>
                            </Link>

                            {/* Tooltip pour la sidebar réduite */}
                            {collapsed && activeTooltip === item.name && (
                                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                                    {item.name}
                                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Bouton Nouveau Projet */}
                <div className="relative">
                    <button
                        onMouseEnter={() => collapsed && setActiveTooltip('Nouveau projet')}
                        onMouseLeave={() => collapsed && setActiveTooltip(null)}
                        className={`w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg ${collapsed ? "justify-center px-2" : "justify-start"
                            }`}
                    >
                        <Plus className="h-4 w-4" />
                        {!collapsed && <span className="font-medium">Nouveau projet</span>}
                    </button>

                    {/* Tooltip pour le bouton nouveau projet */}
                    {collapsed && activeTooltip === 'Nouveau projet' && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                            Nouveau projet
                            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                        </div>
                    )}
                </div>
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-200 p-3">
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                    <div className="h-9 w-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getUserInitials()}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {getFullName()}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {getUserRole()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Bouton de déconnexion avec tooltip */}
                <div className="relative mt-3">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        onMouseEnter={() => collapsed && setActiveTooltip('Déconnexion')}
                        onMouseLeave={() => collapsed && setActiveTooltip(null)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${collapsed ? "justify-center px-2" : "justify-start"
                            }`}
                    >
                        {isLoggingOut ? (
                            <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4" />
                        )}
                        {!collapsed && (
                            <span>
                                {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                            </span>
                        )}
                    </button>

                    {/* Tooltip pour la déconnexion */}
                    {collapsed && activeTooltip === 'Déconnexion' && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                            {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}