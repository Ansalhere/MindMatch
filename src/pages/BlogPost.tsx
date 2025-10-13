import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const blogContent: Record<string, any> = {
  'first-job-interview-tips': {
    title: 'How to Ace Your First Job Interview as a Fresh Graduate',
    category: 'Career Tips',
    author: 'Sarah Johnson',
    date: '2025-01-15',
    readTime: '8 min read',
    content: `
      <p>Landing your first job interview as a fresh graduate is an exciting milestone, but it can also be intimidating. The good news? With the right preparation and mindset, you can turn those nerves into confidence and make a lasting impression on your potential employer.</p>

      <h2>1. Research the Company Thoroughly</h2>
      <p>Before your interview, spend time understanding the company's mission, values, recent news, and culture. Visit their website, read their blog, check their social media, and look up recent press releases. This knowledge will help you tailor your answers and demonstrate genuine interest in the organization.</p>

      <h2>2. Understand the Job Description Inside Out</h2>
      <p>Read the job posting multiple times and identify the key skills and qualifications they're seeking. Prepare specific examples from your education, internships, or projects that demonstrate these competencies. Use the STAR method (Situation, Task, Action, Result) to structure your responses.</p>

      <h2>3. Practice Common Interview Questions</h2>
      <p>While you can't predict every question, there are common ones that frequently appear in entry-level interviews. Practice answering questions like "Tell me about yourself," "What are your strengths and weaknesses?" and "Why do you want to work here?" Record yourself or practice with a friend to refine your delivery.</p>

      <h2>4. Prepare Thoughtful Questions to Ask</h2>
      <p>Having questions prepared shows you're engaged and thinking critically about the role. Ask about team structure, growth opportunities, typical projects, or company culture. Avoid questions about salary or benefits in the first interview unless the interviewer brings them up.</p>

      <h2>5. Dress Appropriately and Arrive Early</h2>
      <p>Professional attire shows respect for the interview process. When in doubt, it's better to be slightly overdressed than underdressed. Plan to arrive 10-15 minutes early, accounting for potential traffic or parking challenges. This buffer time also lets you compose yourself before the interview.</p>

      <h2>6. Master Your Body Language</h2>
      <p>Non-verbal communication is just as important as what you say. Maintain good eye contact, offer a firm handshake, sit up straight, and avoid fidgeting. Smile naturally and show enthusiasm through your body language. These subtle cues communicate confidence and professionalism.</p>

      <h2>7. Follow Up After the Interview</h2>
      <p>Within 24 hours, send a thank-you email to everyone who interviewed you. Reference specific topics discussed and reiterate your interest in the position. This simple gesture demonstrates professionalism and keeps you top of mind.</p>

      <h2>Final Thoughts</h2>
      <p>Remember, interviews are a two-way street. While the company is evaluating you, you're also assessing whether this role aligns with your career goals and values. Approach each interview as a learning experience, and don't be discouraged by rejections—they're stepping stones to finding the right opportunity.</p>

      <p>With proper preparation, authenticity, and a positive attitude, you'll be well-equipped to ace your first job interview and launch your career successfully.</p>
    `
  },
  'resume-mistakes-freshers': {
    title: '10 Common Resume Mistakes Fresh Graduates Make (And How to Fix Them)',
    category: 'Resume Building',
    author: 'Michael Chen',
    date: '2025-01-12',
    readTime: '6 min read',
    content: `
      <p>Your resume is often your first opportunity to make an impression on a potential employer. For fresh graduates entering the job market, crafting an effective resume can be challenging. Here are the most common mistakes and how to avoid them.</p>

      <h2>1. Using a Generic Resume for Every Application</h2>
      <p>Many freshers make the mistake of sending the same resume to every job posting. Customize your resume for each position by highlighting relevant skills and experiences that match the job description. This shows employers you've taken the time to understand their needs.</p>

      <h2>2. Poor Formatting and Design</h2>
      <p>A cluttered or overly creative resume can hurt your chances. Stick to a clean, professional format with consistent fonts, appropriate spacing, and clear section headings. Use bullet points for easy readability and ensure your contact information is prominently displayed.</p>

      <h2>3. Including Irrelevant Information</h2>
      <p>Your high school achievements, hobbies unrelated to the job, or personal details like age and marital status don't belong on your resume. Focus on education, relevant projects, internships, and skills that demonstrate your value to potential employers.</p>

      <h2>4. Weak or Vague Descriptions</h2>
      <p>Instead of writing "Responsible for social media," try "Increased Instagram engagement by 45% through strategic content planning and daily interaction with followers." Quantify your achievements whenever possible and use action verbs to start each bullet point.</p>

      <h2>5. Spelling and Grammar Errors</h2>
      <p>Typos and grammatical mistakes signal carelessness. Proofread your resume multiple times, use spell-check tools, and ask friends or mentors to review it. Even a single error can disqualify you from consideration.</p>

      <h2>6. Lying or Exaggerating Skills</h2>
      <p>Honesty is crucial. Don't claim proficiency in skills you don't have or inflate your responsibilities. Employers often verify information, and dishonesty will damage your reputation. Instead, focus on genuine strengths and show willingness to learn.</p>

      <h2>7. Neglecting Keywords from the Job Description</h2>
      <p>Many companies use Applicant Tracking Systems (ATS) to screen resumes. Include relevant keywords from the job posting naturally throughout your resume to ensure it passes automated screening and reaches human reviewers.</p>

      <h2>8. Poor Email Address</h2>
      <p>Using an unprofessional email address like "partygirl123@email.com" creates a negative impression. Create a professional email address using your name, such as "firstname.lastname@email.com."</p>

      <h2>9. Missing a Strong Summary or Objective</h2>
      <p>A compelling summary at the top of your resume can grab attention. Write 2-3 sentences highlighting your key qualifications, career goals, and what you bring to the role. Make it specific to the position you're applying for.</p>

      <h2>10. Making It Too Long or Too Short</h2>
      <p>For fresh graduates, a one-page resume is ideal. Include enough detail to showcase your qualifications without overwhelming the reader. If you're struggling to fill a page, expand on your projects, coursework, and relevant extracurricular activities.</p>

      <h2>Conclusion</h2>
      <p>Creating an effective resume takes time and attention to detail. Avoid these common mistakes, and you'll significantly improve your chances of landing interviews. Remember, your resume is a marketing document—make every word count and present yourself in the best possible light.</p>
    `
  },
  'skill-based-hiring-trend': {
    title: 'Why Skill-Based Hiring is the Future: What Freshers Need to Know',
    category: 'Industry Trends',
    author: 'Priya Sharma',
    date: '2025-01-10',
    readTime: '7 min read',
    content: `
      <p>The traditional job market, where a degree from a prestigious university was your golden ticket to employment, is rapidly evolving. Today's employers are increasingly prioritizing skills and competencies over educational pedigree. This shift toward skill-based hiring represents a fundamental change in how companies evaluate and recruit talent.</p>

      <h2>What is Skill-Based Hiring?</h2>
      <p>Skill-based hiring focuses on what candidates can actually do rather than where they studied or what degree they hold. Employers evaluate practical abilities, problem-solving skills, and demonstrated competencies through assessments, portfolios, and real-world examples rather than relying solely on credentials.</p>

      <h2>Why Companies Are Making the Shift</h2>
      <p>Several factors are driving this transformation. First, technology is evolving faster than traditional education can keep pace. Skills that weren't taught in college are now in high demand. Second, companies realize that a degree doesn't always correlate with job performance. Lastly, skill-based hiring expands the talent pool to include self-taught professionals and career changers.</p>

      <h2>Benefits for Fresh Graduates</h2>
      <p>This trend levels the playing field for freshers from various backgrounds. If you've developed relevant skills through online courses, personal projects, internships, or self-study, you can compete with graduates from top-tier institutions. Your GitHub portfolio, freelance work, or certifications can speak louder than your GPA.</p>

      <h2>How to Adapt to Skill-Based Hiring</h2>
      <p>Focus on building a portfolio that demonstrates your abilities. Create projects that solve real problems. Contribute to open-source initiatives. Take online courses and earn certifications in your field. Document your learning journey and showcase tangible results from your work.</p>

      <h2>Essential Skills Employers Are Seeking</h2>
      <p>While technical skills vary by industry, certain competencies are universally valued. Critical thinking, communication, adaptability, collaboration, and continuous learning are crucial. Pair these soft skills with industry-specific technical abilities, and you'll position yourself as a strong candidate.</p>

      <h2>Preparing for Skill-Based Assessments</h2>
      <p>Many companies now use practical assessments during hiring. You might face coding challenges, case studies, design tasks, or simulations. Practice these types of assessments on platforms like HackerRank, LeetCode, or industry-specific testing sites. The more comfortable you are with practical demonstrations, the better you'll perform.</p>

      <h2>The Role of Continuous Learning</h2>
      <p>In a skill-based economy, learning doesn't stop after graduation. Stay current with industry trends, update your skill set regularly, and seek opportunities to apply new knowledge. Platforms like Coursera, Udemy, LinkedIn Learning, and YouTube offer resources to keep your skills sharp and relevant.</p>

      <h2>Building Your Personal Brand</h2>
      <p>Your online presence matters more than ever. Maintain an updated LinkedIn profile highlighting your skills and projects. Share insights and engage with industry content. Build a personal website or portfolio showcasing your best work. These digital assets serve as evidence of your capabilities.</p>

      <h2>Conclusion</h2>
      <p>The shift to skill-based hiring is not just a trend—it's the future of work. For fresh graduates, this represents an opportunity to differentiate yourself through demonstrated competence rather than academic credentials alone. Embrace lifelong learning, build practical skills, and showcase your abilities authentically. In this new landscape, your potential and proven capabilities matter more than ever.</p>
    `
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogContent[slug] : null;

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <SEOHead
        title={`${post.title} | FresherPools Blog`}
        description={post.content.substring(0, 160).replace(/<[^>]*>/g, '')}
        keywords="career advice, job search, fresh graduate, professional development"
      />
      <Layout>
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <Badge className="mb-4">{post.category}</Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t">
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Read More Articles
              </Button>
            </Link>
          </div>
        </article>
      </Layout>
    </>
  );
};

export default BlogPost;
