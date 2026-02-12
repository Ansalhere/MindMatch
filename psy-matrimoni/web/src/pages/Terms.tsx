import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Terms() {
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
          <h1 className="font-display text-4xl font-bold mb-8">Terms of <span className="gradient-text">Service</span></h1>

          <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-sm">By accessing and using MindMatch, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. MindMatch is intended for individuals aged 18 years and above seeking a life partner for marriage.</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">2. User Eligibility</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>You must be at least 18 years old (21 for male, 18 for female as per Indian law)</li>
                <li>You must be legally eligible for marriage</li>
                <li>You must provide accurate and truthful information</li>
                <li>Only one account per person is permitted</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">3. Psychology Services</h2>
              <p className="text-sm mb-2">Our psychology assessment and counseling services are provided by certified professionals. By using these services:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>You consent to psychological assessment for matchmaking purposes</li>
                <li>You understand that assessment results are used to improve match quality</li>
                <li>You agree that psychology sessions are confidential but results may be shared with potential matches as part of compatibility reports</li>
                <li>You understand that our psychologists provide guidance, not medical treatment</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">4. User Conduct</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Do not provide false or misleading information</li>
                <li>Do not harass, abuse, or threaten other users</li>
                <li>Do not use the platform for any purpose other than matrimonial matchmaking</li>
                <li>Do not share other users' personal information without consent</li>
                <li>Respect the privacy and boundaries of other members and their families</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">5. Payments & Refunds</h2>
              <p className="text-sm">Psychology session fees are non-refundable once the session has been completed. If you cancel a session at least 24 hours before the scheduled time, you may request a full refund or reschedule. Subscription fees follow the refund policy outlined at the time of purchase.</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-3 text-foreground">6. Limitation of Liability</h2>
              <p className="text-sm">MindMatch acts as a platform to facilitate introductions. We do not guarantee marriage or relationship outcomes. Users are responsible for their own decisions and interactions. We are not liable for any disputes or issues arising between members.</p>
            </div>

            <p className="text-xs text-muted-foreground">Last updated: January 2025 • MindMatch Matrimonial Pvt. Ltd.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
