import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Settings,
  Bell,
  BellOff,
  User,
  LogOut,
  ChevronDown,
  Menu,
  CheckCheck,
  Clock,
  Info,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

const notificationIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  default: Bell,
}

const Header = ({ onToggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await logout();
      window.location.replace(ROUTES.LOGIN);
    } catch (error) {
      localStorage.removeItem('authToken');
      window.location.replace(ROUTES.LOGIN);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setIsDropdownOpen(false);
      await authService.logoutAll();
      localStorage.removeItem('authToken');
      window.location.replace(ROUTES.LOGIN);
    } catch (error) {
      localStorage.removeItem('authToken');
      window.location.replace(ROUTES.LOGIN);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.readAt) {
      await markAsRead(notification.id)
    }
    if (notification.link) {
      navigate(notification.link)
    }
    setIsNotifOpen(false)
  }

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

  const formatNotifDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    if (diff < 60000) return 'À l\'instant'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-4 sm:px-6">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-foreground/60 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            placeholder="Rechercher des projets, tâches..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-foreground/60 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium px-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-card-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Tout marquer lu
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <BellOff className="h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map((notif) => {
                    const Icon = notificationIcons[notif.type] || notificationIcons.default
                    return (
                      <button
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent transition-colors ${
                          !notif.readAt ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className={`mt-0.5 p-1 rounded-full ${
                          notif.readAt ? 'text-muted-foreground' : 'text-primary'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notif.readAt ? 'text-muted-foreground' : 'text-card-foreground font-medium'}`}>
                            {notif.message || notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatNotifDate(notif.createdAt || notif.created_at)}
                          </p>
                        </div>
                        {!notif.readAt && (
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 text-foreground/70 hover:bg-accent rounded-lg transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {getUserInitials()}
            </div>
            <span className="text-sm font-medium hidden sm:block">{getFullName()}</span>
            <ChevronDown className={`h-4 w-4 hidden sm:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-card-foreground">{getFullName()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                <p className="text-xs text-primary font-medium mt-1 capitalize">
                  {user?.roleGlobal || user?.role || 'Membre'}
                </p>
              </div>

              <button
                onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-accent transition-colors"
              >
                <User className="h-4 w-4" />
                Mon profil
              </button>

              <button
                onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-accent transition-colors"
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </button>

              <div className="border-t border-border my-1" />

              <button
                onClick={handleLogoutAll}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-card-foreground hover:bg-accent transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion (tous les appareils)
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
