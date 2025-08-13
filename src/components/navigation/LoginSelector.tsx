import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building, Shield, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';

const LoginSelector = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const loginOptions = [
    {
      type: 'candidate',
      title: 'Job Seeker',
      description: 'Find your dream job and showcase your skills',
      icon: User,
      path: '/login',
      color: 'bg-blue-500',
    },
    {
      type: 'employer',
      title: 'Employer',
      description: 'Post jobs and find the best candidates',
      icon: Building,
      path: '/employer-login',
      color: 'bg-green-500',
    },
    {
      type: 'admin',
      title: 'Administrator',
      description: 'System administration and management',
      icon: Shield,
      path: '/admin-login',
      color: 'bg-purple-500',
    },
  ];

  const handleSelect = (path: string) => {
    navigate(path);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center py-8 px-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to RankMe.AI
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose your login type to get started
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {loginOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={option.type}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
                    selectedType === option.type ? 'border-primary shadow-lg scale-105' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedType(option.type)}
                >
                  <CardHeader className="text-center space-y-4 pb-4">
                    <div className={`mx-auto ${option.color} p-4 rounded-full w-16 h-16 flex items-center justify-center shadow-md`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold">{option.title}</CardTitle>
                      <CardDescription className="text-sm mt-2">
                        {option.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Button 
                      className="w-full group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option.path);
                      }}
                      variant={selectedType === option.type ? "default" : "outline"}
                    >
                      Continue as {option.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-primary hover:underline"
                onClick={() => navigate('/register')}
              >
                Sign up here
              </Button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginSelector;