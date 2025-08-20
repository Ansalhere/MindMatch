import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface BackNavigationProps {
  customBack?: string;
  showBreadcrumb?: boolean;
}

const BackNavigation = ({ customBack, showBreadcrumb = true }: BackNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getPageTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'jobs': 'Jobs',
      'profiles': 'Profiles',
      'skills': 'Skills',
      'community': 'Community',
      'rankings': 'Rankings',
      'skill-assessment': 'Skill Assessment',
      'profile': 'Profile',
      'edit-profile': 'Edit Profile',
      'post-job': 'Post Job',
      'add-skill': 'Add Skill'
    };
    
    return segments.map(segment => titles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1));
  };

  const handleBack = () => {
    if (customBack) {
      navigate(customBack);
    } else {
      navigate(-1);
    }
  };

  const pathSegments = getPageTitle(location.pathname);
  
  return (
    <div className="mb-6 space-y-3">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleBack}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      {showBreadcrumb && pathSegments.length > 1 && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/" 
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-3 w-3" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {pathSegments.map((segment, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === pathSegments.length - 1 ? (
                    <BreadcrumbPage className="font-medium">
                      {segment}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      href={`/${pathSegments.slice(0, index + 1).join('/').toLowerCase()}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {segment}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </div>
  );
};

export default BackNavigation;