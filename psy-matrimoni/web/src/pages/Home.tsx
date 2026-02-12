import { Link } from 'react-router-dom';
import { Heart, Brain, Shield, Sparkles, Users, ArrowRight, Star, CheckCircle, Phone, MessageCircle, Calendar, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">MindMatch</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Features</a>
            <a href="#psychology" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Psychology</a>
            <Link to="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Login</Link>
            <Link to="/register" className="button-primary text-sm !px-5 !py-2.5">Register Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
          <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto max-w-6xl px-6 pt-16 pb-28 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full gradient-bg-subtle px-5 py-2 mb-8 animate-fade-in">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">India's First Psychology-Based Matrimony</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Where Minds Meet{' '}
            <span className="gradient-text">Before Hearts</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            MindMatch is India's first matrimonial platform that pairs you with a certified psychologist
            to evaluate deep compatibility — emotional, psychological, and personal — before you say "I do".
          </p>

          <p className="text-base text-muted-foreground/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            🕉️ Trusted by families across India • Hindu, Muslim, Sikh, Christian, Jain & more
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="button-primary text-lg !px-8 !py-4 flex items-center gap-2">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="button-secondary text-lg !px-8 !py-4">
              See How It Works
            </a>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { label: 'Happy Couples', value: '2,400+', icon: Heart },
              { label: 'Psychology Match Rate', value: '94%', icon: Brain },
              { label: 'Verified Profiles', value: '15K+', icon: Shield },
              { label: 'Psychologists', value: '50+', icon: Award },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Our Unique Process
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How <span className="gradient-text">MindMatch</span> Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Not just matching profiles — we match minds, hearts, and values through professional psychological assessment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Register & Build Profile', desc: 'Create your detailed matrimonial profile with personal, family, education & lifestyle details', icon: Users, color: 'from-rose-500 to-pink-500' },
              { step: '02', title: 'Psychology Session', desc: 'Get a one-on-one session with our certified psychologist who understands your personality deeply', icon: Brain, color: 'from-purple-500 to-violet-500' },
              { step: '03', title: 'AI + Psychology Matching', desc: 'Our algorithm combines your psychological profile with traditional preferences to find ideal matches', icon: Heart, color: 'from-blue-500 to-cyan-500' },
              { step: '04', title: 'Joint Session & Connect', desc: 'Like someone? Book a guided joint session with both families and our psychologist before proceeding', icon: Calendar, color: 'from-amber-500 to-orange-500' },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-2xl p-6 card-hover group text-center">
                <div className="relative mx-auto mb-5">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-bg text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {item.step}
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Psychology USP */}
      <section id="psychology" className="section-padding">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                <Brain className="w-3.5 h-3.5" />
                What Makes Us Different
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Psychology-First <span className="gradient-text">Matchmaking</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Traditional matrimony sites match on surface-level criteria — age, caste, income. But a lasting marriage
                needs deeper compatibility. Our certified psychologists assess your emotional maturity, communication style,
                attachment patterns, values, and conflict resolution approach to find someone who truly complements you.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Certified Psychologists', desc: 'Licensed professionals with 10+ years of counseling experience' },
                  { title: 'Psychological Profiling', desc: 'Assessment across 6 key dimensions — emotional, values, communication, lifestyle, family, attachment' },
                  { title: 'Joint Pre-Marriage Counseling', desc: 'Guided sessions for both partners before families meet — ensures alignment' },
                  { title: 'Compatibility Report', desc: 'Detailed report highlighting strengths, challenges, and expert recommendations' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 relative">
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-display text-xl font-bold mb-6">Your Psychology Profile</h3>

              <div className="space-y-4">
                {[
                  { label: 'Emotional Stability', value: 85, color: 'bg-emerald-500' },
                  { label: 'Openness to Experience', value: 78, color: 'bg-blue-500' },
                  { label: 'Agreeableness', value: 92, color: 'bg-purple-500' },
                  { label: 'Conscientiousness', value: 88, color: 'bg-amber-500' },
                  { label: 'Extroversion', value: 65, color: 'bg-rose-500' },
                ].map((dim) => (
                  <div key={dim.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{dim.label}</span>
                      <span className="text-muted-foreground">{dim.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${dim.color} transition-all duration-1000`} style={{ width: `${dim.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Psychologist Note:</span> "Shows strong emotional
                  intelligence and family values. Best matched with someone who values stability and open communication."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-padding bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything for a <span className="gradient-text">Perfect Match</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Verified Profiles', desc: 'Every profile is verified through Aadhaar/ID, phone, and family background checks.', color: 'from-emerald-500 to-teal-500' },
              { icon: Brain, title: 'Deep Compatibility', desc: 'Our algorithm goes beyond kundali — we check emotional, psychological, and value compatibility.', color: 'from-purple-500 to-violet-500' },
              { icon: Users, title: 'All Communities', desc: 'Hindu, Muslim, Sikh, Christian, Jain, Buddhist — every religion and caste across India.', color: 'from-blue-500 to-cyan-500' },
              { icon: Phone, title: 'Privacy First', desc: 'Control who sees your profile. Phone numbers shared only after mutual acceptance.', color: 'from-rose-500 to-pink-500' },
              { icon: MessageCircle, title: 'Guided Communication', desc: 'Our counselors guide initial conversations to help break the ice meaningfully.', color: 'from-amber-500 to-orange-500' },
              { icon: Star, title: 'Success Stories', desc: '2,400+ successful matches and counting. Read real stories from happy couples.', color: 'from-indigo-500 to-purple-500' },
            ].map((feature) => (
              <div key={feature.title} className="glass-card rounded-2xl p-6 card-hover group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-muted-foreground">Real couples matched through MindMatch psychology</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya & Rahul', location: 'Mumbai', quote: 'The psychology session revealed things about ourselves we never knew. Our psychologist helped us understand how perfectly we complement each other.' },
              { name: 'Ananya & Vikram', location: 'Bangalore', quote: 'Unlike other sites, MindMatch matched us on values and emotional compatibility. The joint session with Dr. Sharma gave us so much confidence.' },
              { name: 'Meera & Arjun', location: 'Delhi', quote: 'Our families were unsure, but the compatibility report from MindMatch psychologist convinced everyone. 1 year married and couldn\'t be happier!' },
            ].map((story) => (
              <div key={story.name} className="glass-card rounded-2xl p-6 card-hover">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{story.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{story.name}</p>
                  <p className="text-xs text-muted-foreground">{story.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto max-w-3xl text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Find Your <span className="gradient-text">Life Partner</span> Through Science
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            Don't leave the most important decision of your life to chance. Let our psychologists help you find someone
            who truly understands you.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Free registration • First psychology session at ₹499 only
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="button-primary text-lg !px-10 !py-4 inline-flex items-center gap-2">
              Register Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="button-secondary text-lg !px-8 !py-4">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold gradient-text text-lg">MindMatch</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India's first psychology-based matrimonial platform. Matching minds before hearts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/about" className="block hover:text-foreground transition-colors">About Us</Link>
                <a href="#how-it-works" className="block hover:text-foreground transition-colors">How It Works</a>
                <Link to="/register" className="block hover:text-foreground transition-colors">Register</Link>
                <Link to="/login" className="block hover:text-foreground transition-colors">Login</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link to="/contact" className="block hover:text-foreground transition-colors">Contact Us</Link>
                <Link to="/privacy" className="block hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="block hover:text-foreground transition-colors">Terms of Service</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 support@mindmatch.in</p>
                <p>📞 +91 98765 43210</p>
                <p>📍 Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 MindMatch Matrimonial Pvt. Ltd. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
