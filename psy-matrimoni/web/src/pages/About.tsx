import { Link } from 'react-router-dom';
import { Heart, Brain, Shield, Users, Award, CheckCircle, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      <nav className="nav-glass sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center"><Heart className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-display font-bold gradient-text">MindMatch</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground">Login</Link>
            <Link to="/register" className="button-primary text-sm !px-5 !py-2.5">Register Free</Link>
          </div>
        </div>
      </nav>

      <section className="hero-gradient relative">
        <div className="container mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">About <span className="gradient-text">MindMatch</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">India's first psychology-based matrimonial platform, founded on the belief that lasting marriages are built on deep emotional and psychological compatibility.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
            <h2 className="font-display text-2xl font-bold mb-4 gradient-text">Our Mission</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              At MindMatch, we believe that the most important decision of your life — choosing a life partner — should be backed by science, 
              not just surface-level preferences. While traditional matrimonial sites focus on age, income, and caste, we go deeper.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Our team of certified psychologists works one-on-one with every registered member to understand their emotional patterns, 
              communication style, attachment tendencies, values, and relationship expectations. This deep profiling allows our algorithm 
              to find matches that are truly compatible — not just on paper, but in the heart and mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Brain, title: '50+ Psychologists', desc: 'Certified professionals with extensive experience in relationship counseling and personality assessment.' },
              { icon: Shield, title: 'Verified Profiles', desc: 'Every profile undergoes verification through ID, phone, and family background checks.' },
              { icon: Users, title: 'All Communities', desc: 'Serving Hindu, Muslim, Sikh, Christian, Jain, Buddhist, and all communities across India.' },
              { icon: Award, title: '2,400+ Matches', desc: 'Successfully matched thousands of couples through psychological compatibility.' },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-6">
                <item.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
            <h2 className="font-display text-2xl font-bold mb-4 gradient-text">How Psychology Makes the Difference</h2>
            <div className="space-y-3">
              {[
                'One-on-one session with a certified psychologist after registration',
                'Assessment across 6 dimensions: emotional, values, communication, lifestyle, family, attachment',
                'Psychological scoring and personality profiling for accurate matching',
                'Compatibility reports with strengths, challenges, and expert recommendations',
                'Joint sessions for both partners before families meet',
                'Pre-marriage counseling to set the foundation for a healthy relationship',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link to="/register" className="button-primary text-lg !px-10 !py-4 inline-flex items-center gap-2">
              Join MindMatch <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
