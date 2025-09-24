import { Link } from 'react-router-dom';
import { 
  Briefcase, Clock, Trophy, MapPin, DollarSign, Users, 
  Star, TrendingUp, Zap, Building2, Calendar, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  description?: string;
  required_skills?: string[];
  salary_min?: number;
  salary_max?: number;
  posted_date?: string;
  created_at?: string;
  min_rank_requirement?: number;
  applications?: any[];
  company_name?: string;
  external_apply_url?: string;
  min_experience?: string;
}

interface ColorfulJobCardProps {
  job: Job;
  compact?: boolean;
  showApplications?: boolean;
}

const ColorfulJobCard = ({ job, compact = false, showApplications = false }: ColorfulJobCardProps) => {
  // Color schemes for different job types
  const getJobTypeColor = (jobType: string) => {
    const colors = {
      'full-time': 'from-blue-500 to-cyan-500',
      'part-time': 'from-green-500 to-emerald-500',
      'contract': 'from-purple-500 to-pink-500',
      'freelance': 'from-orange-500 to-red-500',
      'remote': 'from-indigo-500 to-purple-500',
      'internship': 'from-yellow-500 to-orange-500',
    };
    return colors[jobType.toLowerCase() as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getCompanyInitials = (companyName: string) => {
    if (!companyName) return 'CO';
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get the correct company name - prioritize company_name for admin posts
  const getCompanyName = () => {
    return job.company_name || job.company || 'Company';
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    
    const formatAmount = (amount: number) => {
      if (amount >= 100000) {
        return `${(amount / 100000).toFixed(0)}L`;
      }
      return `${(amount / 1000).toFixed(0)}K`;
    };
    
    if (min && max) {
      return `₹${formatAmount(min)} - ${formatAmount(max)}`;
    }
    return min ? `₹${formatAmount(min)}+` : `Up to ₹${formatAmount(max!)}`;
  };

  const getPostedDate = () => {
    const date = new Date(job.posted_date || job.created_at || Date.now());
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays}d ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}w ago`;
    return `${Math.ceil(diffDays / 30)}m ago`;
  };

  const getExperienceText = () => {
    const minExp = job.min_experience;
    if (!minExp || minExp === '0') return 'Fresher';
    return `${minExp}+ years`;
  };

  const applicationCount = job.applications?.length || 0;
  const hasTopRankedCandidates = job.applications?.some((app: any) => 
    app.candidate_rank && app.candidate_rank <= 100
  );

  if (compact) {
    return (
      <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 h-full" 
            style={{ borderLeftColor: `var(--${getJobTypeColor(job.job_type).split(' ')[0].replace('from-', '')})` }}>
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className={`bg-gradient-to-br ${getJobTypeColor(job.job_type)} text-white font-bold text-xs`}>
                {getCompanyInitials(getCompanyName())}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm line-clamp-1 mb-1">{job.title}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <Building2 className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{getCompanyName()}</span>
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Briefcase className="h-3 w-3 flex-shrink-0" />
                  <span>{getExperienceText()}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{getPostedDate()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
            {showApplications && (
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{applicationCount} applications</span>
                </div>
                {hasTopRankedCandidates && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800">
                    <Trophy className="h-2.5 w-2.5 mr-1" />
                    Top talent
                  </Badge>
                )}
              </div>
            )}
            
            <Button asChild size="xs" className="ml-auto flex-shrink-0">
              <Link to={`/job/${job.id}`}>
                <Eye className="h-3 w-3 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover-lift card-hover relative overflow-hidden h-full flex flex-col">
      <div className={`absolute inset-0 bg-gradient-to-br ${getJobTypeColor(job.job_type)} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      {/* Header Section - Fixed Height */}
      <CardHeader className="pb-4 space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className={`bg-gradient-to-br ${getJobTypeColor(job.job_type)} text-white font-bold`}>
              {getCompanyInitials(getCompanyName())}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-1">{job.title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="text-sm truncate">{getCompanyName()}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span className="text-sm">Experience: {getExperienceText()}</span>
            </div>
          </div>
          <Badge className={`bg-gradient-to-r ${getJobTypeColor(job.job_type)} text-white border-0 shrink-0`}>
            {job.job_type}
          </Badge>
        </div>
        
        {job.min_rank_requirement && (
          <div className="flex justify-end">
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Rank {job.min_rank_requirement}+
            </Badge>
          </div>
        )}
      </CardHeader>

      {/* Content Section - Flexible Height */}
      <CardContent className="flex-1 flex flex-col space-y-4 pb-4">
        {/* Location, Date, Salary Row */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{getPostedDate()}</span>
          </div>
          {formatSalary(job.salary_min, job.salary_max) && (
            <div className="flex items-center gap-1 font-semibold text-green-600">
              <DollarSign className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{formatSalary(job.salary_min, job.salary_max)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}

        {/* Skills */}
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.required_skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs px-2 py-1">
                {skill}
              </Badge>
            ))}
            {job.required_skills.length > 4 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{job.required_skills.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer Section - Fixed to Bottom */}
        <div className="border-t pt-4 space-y-3">
          {showApplications ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>{applicationCount} applications</span>
                </div>
                {hasTopRankedCandidates && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Trophy className="h-3 w-3 mr-1" />
                    Top talent
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 shrink-0" />
              <span>Growing fast</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link to={`/job/${job.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
            {job.external_apply_url ? (
              <Button asChild size="sm" className="flex-1">
                <a href={job.external_apply_url} target="_blank" rel="noopener noreferrer">
                  <Zap className="h-4 w-4 mr-1" />
                  Apply
                </a>
              </Button>
            ) : (
              <Button asChild size="sm" className="flex-1">
                <Link to={`/job/${job.id}?apply=true`}>
                  <Zap className="h-4 w-4 mr-1" />
                  Apply
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorfulJobCard;