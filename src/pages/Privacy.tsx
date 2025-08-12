
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how we collect, use, and protect your information
          </p>
        </div>
        
        <div className="prose max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              update your profile, or communicate with us. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Personal information (name, email, phone number)</li>
              <li>Professional information (work experience, skills, education)</li>
              <li>Account credentials and preferences</li>
              <li>Communications and messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and improve our services</li>
              <li>Connect candidates with relevant job opportunities</li>
              <li>Enable communication between employers and candidates</li>
              <li>Calculate and display skill rankings</li>
              <li>Send notifications and updates</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>With employers when you apply for jobs or make your profile visible</li>
              <li>With service providers who assist in platform operations</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transaction (merger, acquisition, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Control who can view your profile</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@skillrank.com" className="text-primary hover:underline">
                privacy@skillrank.com
              </a>
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
