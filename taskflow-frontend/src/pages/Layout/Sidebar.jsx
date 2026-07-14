import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Plus,
  ChevronLeft,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { name: 'Projets', icon: FolderKanban, href: ROUTES.PROJECTS },
  { name: 'Mes tâches', icon: CheckSquare, href: ROUTES.TASKS },
  { name: 'Équipe', icon: Users, href: '/team' },
];

export function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (href) => {
    if (href === ROUTES.DASHBOARD) return location.pathname === ROUTES.DASHBOARD;
    return location.pathname.startsWith(href);
  };

  const getUserInitials = () => {
    if (!user) return 'UK';
    const { firstName, lastName } = user;
    if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    return user.email?.charAt(0).toUpperCase() || 'UK';
  };

  const getFullName = () => {
    if (!user) return 'Utilisateur';
    const { firstName, lastName } = user;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return firstName || lastName || user.email || 'Utilisateur';
  };

  const getUserRole = () => {
    if (!user) return 'Membre';
    const role = user.roleGlobal || user.role;
    return role === 'admin' ? 'Admin' : role === 'member' ? 'Membre' : 'Viewer';
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      window.location.replace(ROUTES.LOGIN);
    } catch (error) {
      localStorage.removeItem('authToken');
      navigate(ROUTES.LOGIN, { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sidebarClasses = `
    fixed lg:static inset-y-0 left-0 z-40 flex flex-col
    bg-sidebar border-r border-sidebar-border
    transition-all duration-300 ease-in-out
    ${collapsed ? 'w-16' : 'w-64'}
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Logo + collapse */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
                TF
              </div>
              <span className="font-semibold text-lg text-sidebar-foreground">TaskFlow</span>
            </Link>
          )}
          {collapsed && (
            <Link to={ROUTES.DASHBOARD} className="mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
                TF
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
            title={collapsed ? 'Développer' : 'Réduire'}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <div key={item.name} className="relative">
                <Link
                  to={item.href}
                  onClick={() => onMobileClose?.()}
                  onMouseEnter={() => collapsed && setActiveTooltip(item.name)}
                  onMouseLeave={() => collapsed && setActiveTooltip(null)}
                >
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer
                      ${collapsed ? 'justify-center px-2' : 'justify-start'}
                      ${active
                        ? 'bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20'
                        : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
                  </div>
                </Link>

                {collapsed && activeTooltip === item.name && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                  </div>
                )}
              </div>
            );
          })}

          {/* New Project */}
          <div className="relative pt-2">
            <div
              onMouseEnter={() => collapsed && setActiveTooltip('Nouveau projet')}
              onMouseLeave={() => collapsed && setActiveTooltip(null)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
                bg-primary text-primary-foreground
                hover:opacity-90 transition-all duration-200 shadow-sm
                ${collapsed ? 'justify-center px-2' : 'justify-start'}
              `}
            >
              <Plus className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="font-medium text-sm">Nouveau projet</span>}
            </div>

            {collapsed && activeTooltip === 'Nouveau projet' && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                Nouveau projet
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-3">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-sm font-medium">
              {getUserInitials()}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{getFullName()}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{getUserRole()}</p>
              </div>
            )}
          </div>

          <div className="relative mt-3">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              onMouseEnter={() => collapsed && setActiveTooltip('Déconnexion')}
              onMouseLeave={() => collapsed && setActiveTooltip(null)}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10
                disabled:opacity-50 disabled:cursor-not-allowed
                ${collapsed ? 'justify-center px-2' : 'justify-start'}
              `}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 shrink-0" />
              )}
              {!collapsed && <span>{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>}
            </button>

            {collapsed && activeTooltip === 'Déconnexion' && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-foreground text-background text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
