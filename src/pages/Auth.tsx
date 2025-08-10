import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useUser } from '@/hooks/useUser';

const Auth = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      const type = user.user_type === 'employer' ? 'employer' : 'candidate';
      navigate(`/profile/${user.id}/${type}`, { replace: true });
    }
  }, [user, isLoading, navigate]);

  return <AuthForm />;
};

export default Auth;