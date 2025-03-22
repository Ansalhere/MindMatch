
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BadgeCheck, Briefcase, Star } from 'lucide-react';

const Index = () => {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    howItWorks: false,
    testimonials: false,
    cta: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const stats = document.getElementById('stats');
      const howItWorks = document.getElementById('how-it-works');
      const testimonials = document.getElementById('testimonials');
      const cta = document.getElementById('cta');

      if (stats) {
        setIsVisible(prev => ({ 
          ...prev, 
          stats: isElementInViewport(stats) 
        }));
      }
      
      if (howItWorks) {
        setIsVisible(prev => ({ 
          ...prev, 
          howItWorks: isElementInViewport(howItWorks) 
        }));
      }
      
      if (testimonials) {
        setIsVisible(prev => ({ 
          ...prev, 
          testimonials: isElementInViewport(testimonials) 
        }));
      }
      
      if (cta) {
        setIsVisible(prev => ({ 
          ...prev, 
          cta: isElementInViewport(cta) 
        }));
      }
    };

    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        {/* Stats Section */}
        <section id="stats" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div 
              className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${
                isVisible.stats ? 'opacity-100' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">25K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-muted-foreground">Job Listings</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <BadgeCheck className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">15K+</div>
                <div className="text-muted-foreground">Matched Jobs</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>
        
        <Features />
        
        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ${
                isVisible.howItWorks ? 'opacity-100' : 'opacity-0 translate-y-10'
              }`}>
                How <span className="text-primary">FresherPools</span> Works
              </h2>
              <p className={`text-lg text-muted-foreground transition-all duration-700 delay-100 ${
                isVisible.howItWorks ? 'opacity-100' : 'opacity-0 translate-y-10'
              }`}>
                Our AI-powered platform makes it easy to connect freshers with the perfect job opportunities in just a few simple steps.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Create Your Profile',
                  description: 'Sign up and build your comprehensive profile highlighting your education, skills, and strengths.',
                  delay: 200
                },
                {
                  step: '02',
                  title: 'AI Matches You',
                  description: 'Our algorithm analyzes your profile and matches you with the most suitable job opportunities.',
                  delay: 400
                },
                {
                  step: '03',
                  title: 'Apply & Connect',
                  description: 'Apply to jobs with a single click and connect directly with interested employers.',
                  delay: 600
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-700 ${
                    isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className={`flex justify-center mt-12 transition-all duration-700 delay-800 ${
              isVisible.howItWorks ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button asChild>
                <Link to="/register">
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-secondary/50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ${
                isVisible.testimonials ? 'opacity-100' : 'opacity-0 translate-y-10'
              }`}>
                What Our Users Say
              </h2>
              <p className={`text-lg text-muted-foreground transition-all duration-700 delay-100 ${
                isVisible.testimonials ? 'opacity-100' : 'opacity-0 translate-y-10'
              }`}>
                Don't just take our word for it. Here's what freshers and employers have to say about FresherPools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah J.',
                  role: 'Frontend Developer',
                  testimonial: 'FresherPools completely transformed my job search. Within two weeks of creating my profile, I received three interview calls and landed my dream job!',
                  delay: 200
                },
                {
                  name: 'David M.',
                  role: 'HR Manager at TechCorp',
                  testimonial: 'As an employer, finding the right fresher talent was always challenging. FresherPools' skill-based matching has saved us countless hours of screening.',
                  delay: 400
                },
                {
                  name: 'Priya K.',
                  role: 'Data Science Graduate',
                  testimonial: 'The skill ranking feature helped me understand which areas to improve. After enhancing those skills, my match rate improved by 45% and I got hired!',
                  delay: 600
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-700 ${
                    isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10"></div>
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">"{item.testimonial}"</p>
                  <div className="mt-6 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="cta" className="py-24 bg-primary text-white">
          <div className="container mx-auto px-6">
            <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
              isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-white/80 mb-10">
                Join thousands of freshers and employers already using FresherPools to connect talent with opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-primary px-8">
                  <Link to="/register">Sign Up Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 px-8">
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
