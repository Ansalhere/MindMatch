import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { calculateProfileCompletion } from '@/utils/profileCompletion';

const EXCLUDED_ROUTES = [
  '/complete-profile',
  '/edit-profile',
  '/login',
  '/register',
  '/auth',
  '/auth-selector',
  '/admin-login',
  '/admin-signup',
  '/employer-login',
  '/',
  '/jobs',
  '/about',
  '/contact',
  '/pricing',
  '/terms',
  '/privacy',
  '/blog'
];

export const ProfileCompletionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || !user) return;

    // Skip check for excluded routes
    if (EXCLUDED_ROUTES.some(route => location.pathname.startsWith(route))) {
      return;
    }

    // Quick check for basic profile info
    const hasBasicInfo = user.name && user.location;
    
    // If missing basic info, redirect to complete profile
    if (!hasBasicInfo) {
      navigate('/edit-profile', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [user, isLoading, location.pathname, navigate]);

  return <>{children}</>;
};
