import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <nav className="nav-glass sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center"><Heart className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-display font-bold gradient-text">MindMatch</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground">← Back to Home</Link>
        </div>
      </nav>

      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold mb-8">Privacy <span className="gradient-text">Policy</span></h1>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">1. Information We Collect</h2>
              <p className="mb-2">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Personal information (name, email, phone number, date of birth)</li>
                <li>Matrimonial profile details (religion, caste, education, family details)</li>
                <li>Psychology assessment responses and scores</li>
                <li>Communication between you and other members</li>
                <li>Usage data and analytics</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>To provide and improve our matrimonial matching services</li>
                <li>To conduct psychological assessments and generate compatibility reports</li>
                <li>To match you with compatible profiles based on your preferences and psychology</li>
                <li>To communicate with you about your account, sessions, and matches</li>
                <li>To ensure the safety and security of our platform</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">3. Data Security</h2>
              <p className="text-sm">We implement industry-standard security measures to protect your personal information. Your psychology assessment data is encrypted and stored securely. Access to psychological profiles is restricted to certified psychologists assigned to your case.</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">4. Information Sharing</h2>
              <p className="text-sm mb-2">We do not sell your personal information. We share information only in these cases:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>With other members as part of the matching process (profile information only)</li>
                <li>With our certified psychologists for assessment and counseling purposes</li>
                <li>When required by law or to protect rights and safety</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">5. Your Rights</h2>
              <p className="text-sm">You can access, update, or delete your personal information at any time through your account settings. You may also contact us at support@mindmatch.in to exercise your data rights.</p>
            </div>

            <p className="text-xs text-muted-foreground">Last updated: January 2025 • MindMatch Matrimonial Pvt. Ltd.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
