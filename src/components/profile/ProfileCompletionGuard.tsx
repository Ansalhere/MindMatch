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

    // Strict check for complete profile
    const hasBasicInfo = user.name && user.location && user.phone;
    
    // For candidates, also check for resume
    const candidateComplete = user.user_type !== 'candidate' || (hasBasicInfo && user.resume_url);
    
    // If missing required info, force redirect to complete profile
    if (!hasBasicInfo || !candidateComplete) {
      navigate('/edit-profile', { 
        state: { from: location.pathname, incomplete: true },
        replace: true 
      });
    }
  }, [user, isLoading, location.pathname, navigate]);

  return <>{children}</>;
};
