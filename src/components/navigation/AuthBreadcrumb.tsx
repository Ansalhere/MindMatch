import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthBreadcrumb = () => {
  const location = useLocation();
  
  const getBreadcrumbData = () => {
    switch (location.pathname) {
      case '/login':
        return { title: 'Job Seeker Login', subtitle: 'Access your career dashboard' };
      case '/employer-login':
        return { title: 'Employer Portal', subtitle: 'Access your hiring dashboard' };
      case '/admin-login':
        return { title: 'Admin Access', subtitle: 'Secure login for system administrators' };
      case '/admin-signup':
        return { title: 'Create Admin Account', subtitle: 'Set up administrator access' };
      case '/register':
        return { title: 'Create Account', subtitle: 'Join our platform today' };
      case '/auth-selector':
        return { title: 'Login Options', subtitle: 'Choose your account type' };
      default:
        return { title: 'Authentication', subtitle: 'Secure access to your account' };
    }
  };

  const { title, subtitle } = getBreadcrumbData();

  return (
    <div className="mb-6">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthBreadcrumb;