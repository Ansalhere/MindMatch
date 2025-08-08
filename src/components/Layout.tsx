
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUser } from '@/hooks/useUser';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useUser();
  
  return (
    <div className={`flex flex-col min-h-screen ${user?.user_type === 'employer' ? 'theme-employer' : ''}`}>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
