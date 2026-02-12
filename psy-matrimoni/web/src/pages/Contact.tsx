import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

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

      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold mb-4">Contact <span className="gradient-text">Us</span></h1>
            <p className="text-muted-foreground">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold mb-4">Get In Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /><div><p className="text-sm font-medium">Email</p><p className="text-sm text-muted-foreground">support@mindmatch.in</p></div></div>
                  <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /><div><p className="text-sm font-medium">Phone</p><p className="text-sm text-muted-foreground">+91 98765 43210</p></div></div>
                  <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /><div><p className="text-sm font-medium">Office</p><p className="text-sm text-muted-foreground">Mumbai, Maharashtra, India</p></div></div>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-2">Office Hours</h3>
                <p className="text-sm text-muted-foreground">Monday - Saturday: 9:00 AM - 7:00 PM IST</p>
                <p className="text-sm text-muted-foreground">Sunday: 10:00 AM - 4:00 PM IST</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <h2 className="font-display text-xl font-bold mb-2">Send a Message</h2>
                  <div><label className="text-sm font-medium mb-1 block">Name</label><input type="text" required className="input-styled" placeholder="Your name" /></div>
                  <div><label className="text-sm font-medium mb-1 block">Email</label><input type="email" required className="input-styled" placeholder="your@email.com" /></div>
                  <div><label className="text-sm font-medium mb-1 block">Subject</label><input type="text" required className="input-styled" placeholder="How can we help?" /></div>
                  <div><label className="text-sm font-medium mb-1 block">Message</label><textarea rows={4} required className="input-styled !h-auto resize-none" placeholder="Tell us more..." /></div>
                  <button type="submit" className="button-primary w-full flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
