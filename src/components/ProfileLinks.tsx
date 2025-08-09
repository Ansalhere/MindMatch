import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building, Eye, Trophy, Star } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

interface ProfileLinksProps {
  profileData?: any;
  showViewProfile?: boolean;
}

const ProfileLinks = ({ profileData, showViewProfile = true }: ProfileLinksProps) => {
  const { user } = useUser();
  
  if (!user) return null;

  const isEmployer = user.user_type === 'employer';
  const profileUrl = isEmployer ? `/profile/${user.id}/employer` : `/profile/${user.id}/candidate`;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEmployer ? <Building className="h-5 w-5" /> : <User className="h-5 w-5" />}
          {isEmployer ? 'Company Profile' : 'Your Profile'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showViewProfile && (
          <Button asChild variant="outline" className="w-full">
            <Link to={profileUrl}>
              <Eye className="h-4 w-4 mr-2" />
              View {isEmployer ? 'Company' : 'My'} Profile
            </Link>
          </Button>
        )}
        
        {!isEmployer && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rank Score:</span>
                <Badge variant="secondary">{user.rank_score || 0}</Badge>
              </div>
              {user.rank_score && user.rank_score > 80 && (
                <div className="flex items-center gap-1 text-amber-600 text-sm">
                  <Trophy className="h-3 w-3" />
                  <span>Top Ranked</span>
                </div>
              )}
            </div>
            
            <Button asChild size="sm" className="w-full">
              <Link to="/add-skill">
                <Star className="h-4 w-4 mr-2" />
                Improve Ranking
              </Link>
            </Button>
          </>
        )}
        
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileLinks;