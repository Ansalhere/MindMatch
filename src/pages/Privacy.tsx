
import Layout from '@/components/Layout';

const Privacy = () => {
  return (
    <Layout
      title="Privacy Policy - FresherPools | Your Data Protection"
      description="FresherPools Privacy Policy: Learn how we collect, use, protect and manage your personal information. We're committed to your data privacy and security."
      keywords="privacy policy, data protection, GDPR, data security, user privacy, personal information"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: October 2025
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">1. Introduction</h2>
            <p className="text-foreground/90 leading-relaxed">
              FresherPools ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our job 
              matching platform and related services. Please read this policy carefully to understand our 
              practices regarding your personal data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
                <p className="text-foreground/90 mb-3">
                  We collect information you voluntarily provide when you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                  <li><strong>Create an account:</strong> Name, email address, phone number, password, and user type (candidate/employer)</li>
                  <li><strong>Build your profile:</strong> Professional experience, education history, skills, certifications, resume, location preferences, and career goals</li>
                  <li><strong>Use our services:</strong> Job applications, messages to employers, skill assessments, and profile preferences</li>
                  <li><strong>Contact us:</strong> Support inquiries, feedback, and correspondence</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">2.2 Automatically Collected Information</h3>
                <p className="text-foreground/90 mb-3">
                  When you access our platform, we automatically collect:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                  <li><strong>Device information:</strong> IP address, browser type, operating system, and device identifiers</li>
                  <li><strong>Usage data:</strong> Pages visited, time spent on pages, links clicked, and navigation paths</li>
                  <li><strong>Performance data:</strong> Load times, errors, and interaction patterns</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">3. How We Use Your Information</h2>
            <p className="text-foreground/90 mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li><strong>Service delivery:</strong> Create and manage your account, process job applications, and facilitate communication between candidates and employers</li>
              <li><strong>AI ranking system:</strong> Calculate skill rankings based on verified competencies, experience, and education</li>
              <li><strong>Job matching:</strong> Recommend relevant job opportunities to candidates and qualified candidates to employers</li>
              <li><strong>Platform improvement:</strong> Analyze usage patterns to enhance features and user experience</li>
              <li><strong>Communication:</strong> Send service-related notifications, job alerts, and platform updates</li>
              <li><strong>Security:</strong> Detect and prevent fraud, unauthorized access, and other harmful activities</li>
              <li><strong>Legal compliance:</strong> Comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">4. Information Sharing and Disclosure</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-3">4.1 With Your Consent</h3>
                <p className="text-foreground/90">
                  We share your profile information with employers when you:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/90 mt-2">
                  <li>Apply for a job posting</li>
                  <li>Make your profile publicly visible</li>
                  <li>Accept a connection request from an employer</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">4.2 Service Providers</h3>
                <p className="text-foreground/90">
                  We may share information with trusted third-party service providers who assist in:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/90 mt-2">
                  <li>Cloud hosting and data storage</li>
                  <li>Email delivery and communication services</li>
                  <li>Analytics and performance monitoring</li>
                  <li>Payment processing (for premium services)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">4.3 Legal Requirements</h3>
                <p className="text-foreground/90">
                  We may disclose your information when required by law, court order, or to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/90 mt-2">
                  <li>Comply with legal obligations</li>
                  <li>Protect our rights and property</li>
                  <li>Prevent illegal activities or policy violations</li>
                  <li>Protect the safety of our users or the public</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">4.4 Business Transfers</h3>
                <p className="text-foreground/90">
                  In the event of a merger, acquisition, or sale of assets, your information may be 
                  transferred to the acquiring entity, subject to the same privacy protections.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">5. Data Security</h2>
            <p className="text-foreground/90 mb-3">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li><strong>Encryption:</strong> Data is encrypted in transit using SSL/TLS and at rest using AES-256 encryption</li>
              <li><strong>Access controls:</strong> Role-based access restrictions ensure only authorized personnel can access sensitive data</li>
              <li><strong>Regular audits:</strong> We conduct security assessments and vulnerability testing</li>
              <li><strong>Secure infrastructure:</strong> Data is hosted on secure, compliant cloud servers</li>
            </ul>
            <p className="text-foreground/90 mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect 
              your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">6. Your Privacy Rights</h2>
            <p className="text-foreground/90 mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information in your profile settings</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data (subject to legal retention requirements)</li>
              <li><strong>Data portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
              <li><strong>Restriction:</strong> Request limitation on how we use your data</li>
              <li><strong>Withdraw consent:</strong> Revoke previously granted permissions at any time</li>
            </ul>
            <p className="text-foreground/90 mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@fresherpools.com" className="text-primary hover:underline font-medium">
                privacy@fresherpools.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">7. Data Retention</h2>
            <p className="text-foreground/90">
              We retain your personal information for as long as your account is active or as needed to 
              provide services. After account deletion, we may retain certain information for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90 mt-3">
              <li>Legal compliance and regulatory requirements (typically 7 years)</li>
              <li>Dispute resolution and legal claims</li>
              <li>Fraud prevention and security purposes</li>
              <li>Anonymized analytics (with all personally identifiable information removed)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">8. Cookies and Tracking Technologies</h2>
            <p className="text-foreground/90 mb-3">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze site usage and improve functionality</li>
              <li>Provide personalized job recommendations</li>
            </ul>
            <p className="text-foreground/90 mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may 
              affect platform functionality.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">9. Children's Privacy</h2>
            <p className="text-foreground/90">
              Our services are not intended for users under 18 years of age. We do not knowingly collect 
              personal information from children. If you believe a child has provided us with personal 
              information, please contact us immediately at{' '}
              <a href="mailto:privacy@fresherpools.com" className="text-primary hover:underline font-medium">
                privacy@fresherpools.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">10. International Data Transfers</h2>
            <p className="text-foreground/90">
              Your information may be transferred to and processed in countries other than your country 
              of residence. We ensure appropriate safeguards are in place to protect your data in accordance 
              with this Privacy Policy and applicable data protection laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">11. Changes to This Privacy Policy</h2>
            <p className="text-foreground/90">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal 
              requirements. We will notify you of significant changes via email or platform notification. 
              The "Last Updated" date at the top indicates when the policy was last revised.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">12. Contact Information</h2>
            <p className="text-foreground/90 mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <div>
                <strong className="text-foreground">Email:</strong>{' '}
                <a href="mailto:privacy@fresherpools.com" className="text-primary hover:underline">
                  privacy@fresherpools.com
                </a>
              </div>
              <div>
                <strong className="text-foreground">Phone:</strong>{' '}
                <a href="tel:+919645479703" className="text-primary hover:underline">
                  +91 9645479703
                </a>
              </div>
              <div>
                <strong className="text-foreground">Mailing Address:</strong><br />
                <span className="text-foreground/90">
                  FresherPools<br />
                  Keepath, Perumbavoor<br />
                  Kochi, Kerala 683556<br />
                  India
                </span>
              </div>
            </div>
          </section>

          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Your Consent</h3>
            <p className="text-foreground/90">
              By using FresherPools, you acknowledge that you have read, understood, and agree to be 
              bound by this Privacy Policy. If you do not agree with any part of this policy, please 
              discontinue use of our services.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
