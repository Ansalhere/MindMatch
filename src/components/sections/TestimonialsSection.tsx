
import { Star } from 'lucide-react';

interface TestimonialsSectionProps {
  isVisible: boolean;
}

const TestimonialsSection = ({ isVisible }: TestimonialsSectionProps) => {
  const testimonials = [
    {
      name: 'Sarah J.',
      role: 'Frontend Developer',
      testimonial: 'RankMe completely transformed my job search. My ranking helped me stand out and I landed my dream job within two weeks!',
      delay: 200
    },
    {
      name: 'David M.',
      role: 'HR Manager at TechCorp',
      testimonial: 'As an employer, finding the right talent was always challenging. RankMe\'s ranking system helps us identify the best candidates instantly.',
      delay: 400
    },
    {
      name: 'Priya K.',
      role: 'Data Science Graduate',
      testimonial: 'The ranking feature helped me understand which areas to improve. After enhancing my skills, my rank improved and I got hired!',
      delay: 600
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            What Our Users Say
          </h2>
          <p className={`text-lg text-muted-foreground transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            Don&apos;t just take our word for it. Here&apos;s what candidates and employers have to say about RankMe.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
              <p className="text-muted-foreground">&quot;{item.testimonial}&quot;</p>
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
  );
};

export default TestimonialsSection;
