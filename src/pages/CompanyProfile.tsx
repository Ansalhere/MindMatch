import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  MapPin, 
  Globe, 
  Users, 
  Calendar, 
  Phone, 
  Mail,
  ArrowLeft,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';

interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: string;
  website: string;
  location: string;
  logo_url: string;
  founded_year: number;
  employee_count: string;
  company_type: string;
  is_verified: boolean;
  contact_email: string;
  phone: string;
  social_links: any;
}

interface Job {
  id: string;
  title: string;
  location: string;
  job_type: string;
  salary_min: number;
  salary_max: number;
  created_at: string;
}

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCompany();
      fetchCompanyJobs();
    }
  }, [id]);

  const fetchCompany = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCompany(data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      // We'll need to join with users table to get company jobs
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          location,
          job_type,
          salary_min,
          salary_max,
          created_at,
          employer_id
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching company jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const getCompanyTypeColor = (type: string) => {
    switch (type) {
      case 'startup': return 'bg-green-100 text-green-800';
      case 'corporation': return 'bg-blue-100 text-blue-800';
      case 'non-profit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `Up to ₹${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading company profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Company not found</h3>
            <p className="text-muted-foreground mb-4">
              The company you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/companies">Browse Companies</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead 
        title={`${company.name} - Company Profile | FresherPools`}
        description={`Learn about ${company.name}, a ${company.industry} company located in ${company.location}. ${company.description}`}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/companies">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Link>
        </Button>

        {/* Company Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={`${company.name} logo`}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <Building className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {company.name}
                      {company.is_verified && (
                        <Badge variant="secondary" className="ml-2">
                          Verified
                        </Badge>
                      )}
                    </CardTitle>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {company.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {company.employee_count}
                      </div>
                      {company.founded_year && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Founded {company.founded_year}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className={getCompanyTypeColor(company.company_type)}>
                        {company.company_type}
                      </Badge>
                      <Badge variant="outline">{company.industry}</Badge>
                      <Badge variant="outline">{company.size}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {company.website && (
                      <Button variant="outline" asChild>
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed whitespace-pre-wrap">
                  {company.description || 'No description available.'}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Open Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading jobs...</p>
                  </div>
                ) : jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <Badge variant="outline">{job.job_type}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {formatSalary(job.salary_min, job.salary_max)}
                          </span>
                          <Button size="sm" asChild>
                            <Link to={`/job/${job.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {jobs.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" asChild>
                          <Link to={`/jobs?company=${company.name}`}>
                            View All {jobs.length} Jobs
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No open positions at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.contact_email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                    <a
                      href={`mailto:${company.contact_email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {company.contact_email}
                    </a>
                  </div>
                )}
                
                {company.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                    <a
                      href={`tel:${company.phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {company.phone}
                    </a>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Company Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Industry</span>
                  <span className="text-sm font-medium">{company.industry}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Company Size</span>
                  <span className="text-sm font-medium">{company.employee_count}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium capitalize">{company.company_type}</span>
                </div>
                
                {company.founded_year && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Founded</span>
                      <span className="text-sm font-medium">{company.founded_year}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfile;