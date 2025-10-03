
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { signOut } from '@/lib/supabase';
import { toast } from 'sonner';
import { LogOut, Menu, X, Trophy } from 'lucide-react';
import NotificationCenter from '@/components/NotificationCenter';

const Navbar = () => {
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error("Failed to log out. Please try again.");
        return;
      }
      
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      
      // Force refresh user state
      await refreshUser();
      
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Exception during logout:", error);
      toast.error("An error occurred during logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (location.pathname === '/') {
      // If we're on the homepage, scroll to the section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to homepage with scroll parameter
      navigate(`/?scrollTo=${sectionId}`);
    }
    setIsMenuOpen(false);
  };

  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Jobs', to: '/jobs' },
      { label: 'Profiles', to: '/profiles' },
      { label: 'Rankings', to: '/rankings' },
      { label: 'Community', to: '/community' },
      { label: 'Skills', to: '/skills' },
      { label: 'Resume Builder', to: '/resume-builder' },
    ];
    
    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b' : 'bg-transparent'
      }`}
    >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <Trophy className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  RankMe.AI
                </span>
              </Link>
            </div>
          
            {/* Desktop Navigation - More compact */}
            <nav className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.to} 
                  className="text-gray-600 hover:text-primary transition-colors font-medium px-2 py-1 rounded hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <NotificationCenter />
                
                  {/* Professional User Badge - More compact */}
                  <div className="flex items-center space-x-2">
                    {user.user_type === 'candidate' && user.rank_score && (
                      <div className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg border border-white/20 min-w-[60px] justify-center">
                        <Trophy className="h-4 w-4 text-white drop-shadow-sm" />
                        <span className="tracking-wide text-white font-extrabold drop-shadow-sm">#{Math.floor(user.rank_score)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer text-sm" onClick={() => navigate('/dashboard')}>
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium text-gray-700">
                        {user.user_type === 'employer' ? user.company?.split(' ')[0] : user.name?.split(' ')[0] || 'User'}
                      </span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
              </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth-selector">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t pt-4">
            {navigationItems.map((item, index) => (
              <Link 
                key={index}
                to={item.to} 
                className="block py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {user ? (
              <>
                {/* User info in mobile */}
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.user_type === 'employer' ? user.company : user.name}</p>
                           {user.user_type === 'candidate' && user.rank_score && (
                             <div className="flex items-center gap-1">
                               <Trophy className="h-3 w-3 text-primary" />
                               <span className="text-xs text-primary font-bold">Rank #{Math.floor(user.rank_score)}</span>
                             </div>
                           )}
                        </div>
                      </div>
                </div>
                
                <Link 
                  to="/dashboard" 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link 
                  to="/auth-selector" 
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link 
                  to="/register" 
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
