
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUser } from '@/hooks/useUser';
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className = '' }: LayoutProps) => {
  const { user } = useUser();
  
  return (
    <div className={`flex flex-col min-h-screen ${user?.user_type === 'employer' ? 'theme-employer' : ''} ${className}`}>
      <Navbar />
      <main className="flex-grow animate-fade-in">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
