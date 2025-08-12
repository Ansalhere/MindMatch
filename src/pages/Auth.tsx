import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useUser } from '@/hooks/useUser';

const Auth = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to dashboard after login
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  return <AuthForm />;
};

export default Auth;