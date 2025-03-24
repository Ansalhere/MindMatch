
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">About Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn about FresherPools and our mission to connect freshers with great opportunities
          </p>
        </div>
        
        <div className="prose max-w-3xl mx-auto">
          <p>About page content coming soon...</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
