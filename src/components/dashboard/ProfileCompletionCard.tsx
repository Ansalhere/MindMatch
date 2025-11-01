import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileCompletionResult } from "@/utils/profileCompletion";

interface ProfileCompletionCardProps {
  completion: ProfileCompletionResult;
  compact?: boolean;
}

const ProfileCompletionCard = ({ completion, compact = false }: ProfileCompletionCardProps) => {
  const { percentage, recommendations } = completion;

  const getStatusColor = () => {
    if (percentage === 100) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = () => {
    if (percentage === 100) return "Complete!";
    if (percentage >= 75) return "Almost There";
    if (percentage >= 50) return "In Progress";
    return "Needs Attention";
  };

  const getProgressColor = () => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {percentage === 100 ? (
                <Award className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <p className="font-semibold text-sm">Profile Completion</p>
                <p className={`text-xs font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${getStatusColor()}`}>
                {percentage}%
              </p>
            </div>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-2 mb-3"
          />

          {percentage === 100 ? (
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
              <CheckCircle2 className="h-4 w-4" />
              <span>+10 bonus rank points earned!</span>
            </div>
          ) : recommendations.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Next steps:</p>
              <p className="text-xs text-muted-foreground">• {recommendations[0]}</p>
              <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
                <Link to="/edit-profile">
                  Complete Profile <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {percentage === 100 ? (
                <Award className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              Profile Completion
            </CardTitle>
            <CardDescription>
              {percentage === 100 
                ? "Your profile is 100% complete!" 
                : "Complete your profile to improve your ranking"}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-bold ${getStatusColor()}`}>
              {percentage}%
            </p>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{percentage}/100</span>
          </div>
          <Progress 
            value={percentage} 
            className="h-3"
          />
        </div>

        {percentage === 100 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Award className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">
                  Congratulations! 🎉
                </h4>
                <p className="text-sm text-green-700 mb-2">
                  Your profile is 100% complete! You've earned a bonus of +10 rank points.
                </p>
                <Badge className="bg-green-600">
                  Premium Profile
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <>
            {recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recommendations:</h4>
                <ul className="space-y-2">
                  {recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button asChild className="w-full">
              <Link to="/edit-profile">
                Complete Your Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </>
        )}

        {percentage >= 75 && percentage < 100 && (
          <p className="text-xs text-center text-muted-foreground">
            You're almost there! Complete your profile to earn +10 bonus rank points.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
