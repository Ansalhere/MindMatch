
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/useUser';
import { signOut } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useUser();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    
    // If we're on the homepage, scroll to the section
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to homepage with the section
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out: " + error.message);
    } else {
      toast.success("Signed out successfully");
      navigate('/');
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-bold text-primary"
        >
          <span className="bg-primary text-white px-2 py-1 rounded-md">F</span>
          <span>FresherPools</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover-underline-animation text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <button 
            onClick={() => navigateToSection('how-it-works')}
            className="hover-underline-animation text-foreground/80 hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
          >
            How It Works
          </button>
          <Link to="/profiles" className="hover-underline-animation text-foreground/80 hover:text-foreground transition-colors">
            Browse Profiles
          </Link>
          <Link to="/post-job" className="hover-underline-animation text-foreground/80 hover:text-foreground transition-colors">
            Post Job
          </Link>
          <Link to="/packages" className="hover-underline-animation text-foreground/80 hover:text-foreground transition-colors">
            Packages
          </Link>
          <Link to="/ranking-explanation" className="hover-underline-animation text-foreground/80 hover:text-foreground transition-colors">
            How Ranking Works
          </Link>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <div className="w-24 h-10 bg-muted animate-pulse rounded-md"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={16} />
                  <span>{user.name ? user.name.split(' ')[0] : 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}/${user.user_type}`)}>
                  Profile
                </DropdownMenuItem>
                {user.user_type === 'employer' && (
                  <DropdownMenuItem onClick={() => navigate('/post-job')}>
                    Post a Job
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] z-40 bg-white/95 backdrop-blur-md animate-fade-in">
          <div className="flex flex-col items-center py-8 space-y-6">
            <Link 
              to="/" 
              className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <button
              onClick={() => navigateToSection('how-it-works')}
              className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
            >
              How It Works
            </button>
            <Link 
              to="/profiles" 
              className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Profiles
            </Link>
            <Link 
              to="/post-job" 
              className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Post Job
            </Link>
            <Link 
              to="/packages" 
              className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Packages
            </Link>
            <Link 
              to="/ranking-explanation" 
              className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How Ranking Works
            </Link>
            
            <div className="flex flex-col w-full items-center space-y-4 mt-4 px-12">
              {user ? (
                <>
                  <Button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="w-full">
                    Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
