
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

  const navigationItems = [
    { label: 'How It Works', action: () => handleNavClick('how-it-works') },
    { label: 'Ranking System', action: () => handleNavClick('ranking-system') },
    { label: 'Browse Jobs', to: '/jobs' },
    { label: 'Browse Profiles', to: '/profiles' },
    { label: 'Skill Assessment', to: '/skills' },
    { label: 'Resources', to: '/resources' },
    { label: 'Pricing', to: '/packages' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Trophy className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                RankMe.AI
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item, index) => (
              item.to ? (
                <Link 
                  key={index}
                  to={item.to} 
                  className="text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <button 
                  key={index}
                  onClick={item.action}
                  className="text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </button>
              )
            ))}
            
            {user ? (
              <div className="flex items-center space-x-3">
                <NotificationCenter />
                
                {/* User Badge with Rank */}
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800 leading-tight">
                        {user.user_type === 'employer' ? user.company : user.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {user.user_type}
                      </span>
                    </div>
                  </div>
                  
                  {user.user_type === 'candidate' && user.rank_score && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-primary/15 rounded-full">
                      <Trophy className="h-3 w-3 text-primary" />
                      <span className="text-xs font-bold text-primary">
                        #{Math.floor(user.rank_score)}
                      </span>
                    </div>
                  )}
                </div>
                
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
                {user.user_type === 'employer' && (
                  <Link to="/post-job" className="text-gray-600 hover:text-primary transition-colors font-medium">
                    Post a Job
                  </Link>
                )}
                {user.user_type === 'admin' && (
                  <Link to="/super-admin" className="text-gray-600 hover:text-primary transition-colors font-medium">
                    Super Admin
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2"
                >
                  {isLoggingOut ? (
                    <span>Logging out...</span>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
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
              item.to ? (
                <Link 
                  key={index}
                  to={item.to} 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <button 
                  key={index}
                  onClick={item.action}
                  className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                >
                  {item.label}
                </button>
              )
            ))}
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.user_type === 'employer' && (
                  <Link 
                    to="/post-job" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post a Job
                  </Link>
                )}
                {user.user_type === 'admin' && (
                  <Link 
                    to="/super-admin" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Super Admin
                  </Link>
                )}
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
                  to="/login" 
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
