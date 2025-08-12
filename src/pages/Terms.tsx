
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our platform
          </p>
        </div>
        
        <div className="prose max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using SkillRank, you accept and agree to be bound by the terms 
              and provision of this agreement. These Terms of Service govern your use of our 
              platform and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              SkillRank is a professional networking platform that connects job seekers with 
              employers. Our services include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Professional profile creation and management</li>
              <li>Skill assessment and ranking system</li>
              <li>Job posting and application features</li>
              <li>Direct messaging between users</li>
              <li>Notification and alert system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              To use our services, you must:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Post false, misleading, or inaccurate information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the platform for any illegal purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Spam or send unsolicited communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Premium Services</h2>
            <p className="text-muted-foreground">
              Premium features may be available for additional fees. Premium subscriptions 
              automatically renew unless cancelled. Refunds are provided according to our 
              refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, features, and functionality of SkillRank are owned by us and are 
              protected by intellectual property laws. You retain rights to content you create 
              and upload.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also delete your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, contact us at{' '}
              <a href="mailto:legal@skillrank.com" className="text-primary hover:underline">
                legal@skillrank.com
              </a>
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
