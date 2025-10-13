import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Search, User } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'first-job-interview-tips',
    title: 'How to Ace Your First Job Interview as a Fresh Graduate',
    excerpt: 'Landing your first job interview is exciting but nerve-wracking. Learn proven strategies to make a lasting impression, from research techniques to body language tips that will help you stand out from other candidates.',
    category: 'Career Tips',
    author: 'Sarah Johnson',
    date: '2025-01-15',
    readTime: '8 min read',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    slug: 'resume-mistakes-freshers',
    title: '10 Common Resume Mistakes Fresh Graduates Make (And How to Fix Them)',
    excerpt: 'Your resume is your first impression with potential employers. Discover the most common mistakes freshers make when crafting their resumes and learn actionable tips to create a compelling document that gets noticed by recruiters.',
    category: 'Resume Building',
    author: 'Michael Chen',
    date: '2025-01-12',
    readTime: '6 min read',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    slug: 'skill-based-hiring-trend',
    title: 'Why Skill-Based Hiring is the Future: What Freshers Need to Know',
    excerpt: 'The job market is shifting from degree-focused to skill-focused hiring. Understanding this trend can give you a competitive edge. Learn how to showcase your skills effectively and position yourself for success in this new landscape.',
    category: 'Industry Trends',
    author: 'Priya Sharma',
    date: '2025-01-10',
    readTime: '7 min read',
    image: '/placeholder.svg'
  },
  {
    id: '4',
    slug: 'linkedin-profile-optimization',
    title: 'LinkedIn Profile Optimization: A Complete Guide for Job Seekers',
    excerpt: 'Your LinkedIn profile is more than just an online resume. It\'s a powerful personal branding tool. Learn how to optimize every section of your profile, from your headline to your experience, to attract recruiters and hiring managers.',
    category: 'Personal Branding',
    author: 'David Martinez',
    date: '2025-01-08',
    readTime: '10 min read',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    slug: 'remote-work-skills',
    title: 'Essential Skills for Landing Remote Jobs in 2025',
    excerpt: 'Remote work is here to stay. But landing a remote position requires more than technical skills. Discover the soft skills, tools, and strategies that will make you an attractive candidate for remote positions in today\'s competitive market.',
    category: 'Remote Work',
    author: 'Emily Taylor',
    date: '2025-01-05',
    readTime: '9 min read',
    image: '/placeholder.svg'
  },
  {
    id: '6',
    slug: 'salary-negotiation-freshers',
    title: 'Salary Negotiation for Freshers: How to Ask for What You Deserve',
    excerpt: 'Many fresh graduates leave money on the table because they don\'t negotiate their first salary. Learn the art of professional salary negotiation, understand your market value, and gain confidence to have this crucial conversation.',
    category: 'Compensation',
    author: 'Robert Kim',
    date: '2025-01-03',
    readTime: '8 min read',
    image: '/placeholder.svg'
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEOHead
        title="Career Advice Blog | FresherPools"
        description="Expert career advice, job search tips, and industry insights for fresh graduates and entry-level professionals. Learn how to land your dream job and accelerate your career growth."
        keywords="career advice, job search tips, fresh graduate, resume tips, interview preparation, career development"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Career Insights & Resources</h1>
            <p className="text-xl text-muted-foreground">
              Expert advice to help you navigate your career journey and land your dream job
            </p>
          </div>

          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <Badge
                variant={!selectedCategory ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All Articles
              </Badge>
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <Badge className="w-fit mb-2">{post.category}</Badge>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Blog;
