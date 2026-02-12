import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useNotificationStore } from '@/store';
import { Heart, LayoutDashboard, UserCircle, Users, MessageCircle, LogOut, X, CheckCircle, AlertCircle, Info, Brain } from 'lucide-react';
import { useEffect } from 'react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { notifications, removeNotification } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Auto-dismiss notifications
  useEffect(() => {
    notifications.forEach((notif) => {
      const timer = setTimeout(() => removeNotification(notif.id), 4000);
      return () => clearTimeout(timer);
    });
  }, [notifications]);

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
    { to: '/assessment', icon: Brain, label: 'Assessment' },
    { to: '/matches', icon: Heart, label: 'Matches' },
    { to: '/requests', icon: MessageCircle, label: 'Requests' },
  ];

  const notifIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const notifBorder = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-emerald-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Heart className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display text-lg font-bold gradient-text hidden sm:block">MindMatch</span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'gradient-bg text-white shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="hidden md:inline">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications */}
      <div className="fixed top-20 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`glass-card rounded-xl p-4 border-l-4 ${notifBorder(notif.type)} flex items-start gap-3 animate-slide-up cursor-pointer pointer-events-auto shadow-lg`}
            onClick={() => removeNotification(notif.id)}
          >
            {notifIcon(notif.type)}
            <p className="text-sm font-medium flex-1">{notif.message}</p>
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
