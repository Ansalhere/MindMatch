
import Layout from '@/components/Layout';
import { Users, Target, Award, TrendingUp, Heart, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <Layout
      title="About Us - FresherPools | AI-Powered Job Matching Platform"
      description="Learn about FresherPools' mission to revolutionize fresher hiring through AI-powered skill ranking and intelligent job matching. Discover how we're bridging the gap between talent and opportunity."
      keywords="about fresherpools, AI recruitment platform, skill-based hiring, fresher jobs, career platform, job matching technology"
    >
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Transforming How Freshers Find Their Dream Jobs
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            FresherPools is revolutionizing the recruitment landscape by combining artificial intelligence 
            with skill-based assessments to create meaningful connections between talented freshers and 
            forward-thinking employers.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                Our Mission
              </h2>
              <div className="prose prose-lg">
                <p className="text-foreground/90 leading-relaxed mb-4">
                  We believe that every fresher deserves a fair chance to showcase their true potential. 
                  Traditional hiring methods often overlook talented individuals due to lack of experience 
                  or conventional credentials. That's why we built FresherPools.
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  Our mission is to democratize job opportunities by focusing on what truly matters: skills, 
                  aptitude, and growth potential. Through our AI-powered ranking system, we help freshers 
                  stand out based on their capabilities, not just their resume.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Candidates</div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">2K+</div>
                  <div className="text-sm text-muted-foreground">Hiring Companies</div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">15K+</div>
                  <div className="text-sm text-muted-foreground">Jobs Posted</div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">92%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How We're Different */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">AI-Powered Ranking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our proprietary algorithm analyzes skills, assessments, and potential to create 
                  fair, objective rankings that help candidates showcase their true abilities to employers.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Skill-Based Matching</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Move beyond traditional resume screening. We match candidates with opportunities 
                  based on verified skills, reducing hiring bias and improving job fit quality.
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Career Growth Tools</h3>
                <p className="text-muted-foreground leading-relaxed">
                  From resume builders to skill assessments, we provide comprehensive tools that 
                  help freshers develop professionally and land their ideal first job.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-20 bg-muted/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground/90 leading-relaxed mb-4">
              FresherPools was born from a simple observation: the hiring process for freshers is broken. 
              Talented graduates were struggling to get noticed, while companies couldn't efficiently 
              identify the right candidates from thousands of applications.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-4">
              Our founders, having experienced these challenges firsthand in both academia and corporate 
              recruitment, envisioned a platform where skills speak louder than credentials. They assembled 
              a team of technologists, HR experts, and career counselors to build a solution that would 
              benefit both job seekers and employers.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Today, FresherPools has grown into a comprehensive career platform that empowers freshers 
              to take control of their job search while helping companies discover hidden talent. We're 
              proud to have facilitated thousands of successful placements and continue to innovate in 
              the recruitment technology space.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Fairness & Transparency</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every candidate deserves equal opportunity. Our platform ensures transparent 
                  evaluation criteria and unbiased skill assessments.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Candidate-First Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We prioritize the job seeker experience, providing tools and resources that 
                  genuinely help freshers succeed in their career journey.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Innovation & Excellence</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We continuously improve our technology and processes to deliver the best 
                  possible outcomes for both candidates and employers.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Quality Over Quantity</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We focus on meaningful job matches rather than just application volume, 
                  ensuring better outcomes for everyone involved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Join Thousands of Successful Freshers</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your career journey with FresherPools today. Get ranked, showcase your skills, 
            and connect with top employers looking for talent like you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/register" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Get Started Free
            </a>
            <a 
              href="/jobs" 
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Browse Jobs
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
