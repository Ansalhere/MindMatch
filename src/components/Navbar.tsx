
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { signOut } from '@/lib/supabase';
import { toast } from 'sonner';
import { LogOut, Menu, X } from 'lucide-react';

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
      // If we're on another page, navigate to homepage and then scroll
      navigate('/', { state: { scrollTo: sectionId } });
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">TalentMatch</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('ranking-system')}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Ranking System
            </button>
            <Link to="/jobs" className="text-gray-600 hover:text-primary transition-colors">
              Browse Jobs
            </Link>
            <Link to="/profiles" className="text-gray-600 hover:text-primary transition-colors">
              Browse Profiles
            </Link>
            <Link to="/skills" className="text-gray-600 hover:text-primary transition-colors">
              Skill Assessment
            </Link>
            <Link to="/resources" className="text-gray-600 hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/packages" className="text-gray-600 hover:text-primary transition-colors">
              Pricing
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                {user.user_type === 'employer' && (
                  <Link to="/post-job" className="text-gray-600 hover:text-primary transition-colors">
                    Post a Job
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {isLoggingOut ? 'Logging out...' : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-600"
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
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('ranking-system')}
              className="block w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Ranking System
            </button>
            <Link 
              to="/jobs" 
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Jobs
            </Link>
            <Link 
              to="/profiles" 
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Profiles
            </Link>
            <Link 
              to="/skills" 
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Skill Assessment
            </Link>
            <Link 
              to="/resources" 
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link 
              to="/packages" 
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.user_type === 'employer' && (
                  <Link 
                    to="/post-job" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Post a Job
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center w-full text-left py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
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
                  <Button variant="outline" className="w-full">Login</Button>
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
