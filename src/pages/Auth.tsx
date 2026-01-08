import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useUser } from '@/hooks/useUser';

const safeReturnTo = (value: string | null) => {
  if (!value) return '/dashboard';
  return value.startsWith('/') ? value : '/dashboard';
};

const Auth = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get('returnTo'));

  useEffect(() => {
    if (!isLoading && user) {
      navigate(returnTo, { replace: true });
    }
  }, [user, isLoading, navigate, returnTo]);

  return <AuthForm />;
};

export default Auth;
