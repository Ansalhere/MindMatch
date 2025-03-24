
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Pricing</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the right plan for your needs
          </p>
        </div>
        
        <div className="prose max-w-3xl mx-auto">
          <p>Pricing page content coming soon...</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
