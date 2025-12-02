
import { Users, Briefcase, BadgeCheck, Star } from 'lucide-react';

interface StatsSectionProps {
  isVisible: boolean;
}

const StatsSection = ({ isVisible }: StatsSectionProps) => {
  const stats = [
    { icon: Users, value: "25K+", label: "Active Users", color: "from-blue-500 to-cyan-500" },
    { icon: Briefcase, value: "10K+", label: "Job Listings", color: "from-purple-500 to-pink-500" },
    { icon: BadgeCheck, value: "15K+", label: "Matched Jobs", color: "from-green-500 to-emerald-500" },
    { icon: Star, value: "98%", label: "Client Satisfaction", color: "from-orange-500 to-yellow-500" }
  ];

  return (
    <section id="stats" className="py-32 relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`relative group transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Card */}
                <div className="glass-card p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 text-center h-full flex flex-col items-center justify-center group-hover:scale-105">
                  {/* Icon with gradient background */}
                  <div className={`relative mb-6`}>
                    <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-2xl blur-xl group-hover:opacity-40 transition-opacity"></div>
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Value */}
                  <div className="text-5xl font-black mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
