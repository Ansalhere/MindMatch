import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIAssistantButtonProps {
  type: 'job-description' | 'professional-summary' | 'improve-bullet' | 'skills-suggestion';
  context: {
    title?: string;
    company?: string;
    experience?: string;
    field?: string;
    skills?: string;
    text?: string;
  };
  onGenerated: (text: string) => void;
  label?: string;
}

const AIAssistantButton = ({ type, context, onGenerated, label }: AIAssistantButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('resume-ai-assistant', {
        body: { type, context }
      });

      if (error) throw error;

      if (data?.text) {
        onGenerated(data.text);
        toast.success("AI Generated! Content has been generated successfully");
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast.error(error.message || "Could not generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {label || 'AI Generate'}
    </Button>
  );
};

export default AIAssistantButton;
