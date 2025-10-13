
import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message too long"),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = contactFormSchema.parse(formData);
      setIsSubmitting(true);
      
      // Construct WhatsApp message
      const whatsappMessage = `*New Contact Form Submission*%0A%0A*Name:* ${encodeURIComponent(validated.firstName)} ${encodeURIComponent(validated.lastName)}%0A*Email:* ${encodeURIComponent(validated.email)}%0A*Subject:* ${encodeURIComponent(validated.subject)}%0A*Message:* ${encodeURIComponent(validated.message)}`;
      
      // Open WhatsApp
      window.open(`https://wa.me/919645479703?text=${whatsappMessage}`, '_blank');
      
      toast.success('Message sent! Redirecting to WhatsApp...');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout
      title="Contact Us - FresherPools | Get in Touch"
      description="Contact FresherPools support team for inquiries, technical support, or partnership opportunities. We're here to help you succeed."
      keywords="contact fresherpools, support, help desk, customer service, technical support"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <a href="mailto:support@fresherpools.com" className="text-primary hover:underline block mb-1">
                  support@fresherpools.com
                </a>
                <p className="text-sm text-muted-foreground">We'll respond within 24-48 hours</p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <a href="tel:+919645479703" className="text-primary hover:underline block mb-1">
                  +91 9645479703
                </a>
                <p className="text-sm text-muted-foreground">Mon-Sat: 9 AM - 6 PM IST</p>
              </CardContent>
            </Card>

            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                <p className="text-foreground/90 mb-1">
                  Keepath, Perumbavoor<br />
                  Kochi, Kerala 683556<br />
                  India
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form and we'll get back to you as soon as possible. For urgent inquiries, 
                  please call us directly.
                </p>
              </div>

              <Card className="border-primary/10">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name *</label>
                        <Input 
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleChange('firstName', e.target.value)}
                          placeholder="John"
                          maxLength={50}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name *</label>
                        <Input 
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleChange('lastName', e.target.value)}
                          placeholder="Doe"
                          maxLength={50}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john.doe@example.com"
                        maxLength={255}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                          <SelectItem value="Technical Support">Technical Support</SelectItem>
                          <SelectItem value="Account Issues">Account Issues</SelectItem>
                          <SelectItem value="Feature Request">Feature Request</SelectItem>
                          <SelectItem value="Partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="Feedback">Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <Textarea 
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="How can we help you?"
                        maxLength={1000}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.message.length}/1000 characters
                      </p>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message via WhatsApp
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">How does the ranking system work?</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Our AI-powered ranking system evaluates candidates based on verified skills, 
                      experience, education, certifications, and profile completeness to provide 
                      employers with qualified matches and help candidates stand out.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Is FresherPools free to use?</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Yes! Basic features including profile creation, job applications, and skill 
                      assessments are completely free. We offer premium packages for enhanced visibility 
                      and advanced features.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">How long does verification take?</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Profile verification typically takes 24-48 hours. Skill verification through 
                      assessments is instant, while certification verification may take up to 3 business days.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Can employers contact me directly?</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Yes, employers can send you messages through our secure messaging system. You have 
                      full control over your visibility settings and can choose who can view your profile.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What about data privacy?</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      We take data privacy seriously. Your information is encrypted and stored securely. 
                      We never share your data with third parties without your explicit consent. Read our{' '}
                      <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> for details.
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Need Immediate Assistance?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For urgent matters, reach out to us directly via WhatsApp or phone call. 
                    We're here to help you Monday through Saturday.
                  </p>
                  <div className="flex gap-3">
                    <Button asChild variant="outline" size="sm">
                      <a href="https://wa.me/919645479703" target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href="tel:+919645479703">
                        Call Now
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Contact;
