import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateAdvancedRanking } from '@/lib/ranking';
import { toast } from 'sonner';

export interface RankingUpdateResult {
  previousScore: number;
  newScore: number;
  improvement: number;
  breakdown: any;
  recommendations: string[];
}

export const useRankingCalculator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastResult, setLastResult] = useState<RankingUpdateResult | null>(null);

  const recalculateRanking = useCallback(async (userId: string, showToast: boolean = true): Promise<RankingUpdateResult | null> => {
    if (!userId) return null;
    
    setIsCalculating(true);
    try {
      // Get current rank score
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('rank_score, name, email, phone, location, bio, avatar_url, resume_url, current_ctc, expected_ctc')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      
      const previousScore = Number(userData?.rank_score) || 0;
      
      // Fetch all profile data for ranking calculation
      const [skillsRes, educationRes, experienceRes, certificationsRes] = await Promise.all([
        supabase.from('skills').select('*').eq('user_id', userId),
        supabase.from('education').select('*').eq('user_id', userId),
        supabase.from('experiences').select('*').eq('user_id', userId),
        supabase.from('certifications').select('*').eq('user_id', userId),
      ]);
      
      const skills = skillsRes.data || [];
      const education = educationRes.data || [];
      const experiences = experienceRes.data || [];
      const certifications = certificationsRes.data || [];
      
      // Calculate profile completeness percentage
      let completionPercentage = 0;
      const basicFields = ['name', 'email', 'phone', 'location', 'bio', 'avatar_url', 'resume_url'];
      const completedBasic = basicFields.filter(field => userData?.[field]).length;
      completionPercentage += (completedBasic / basicFields.length) * 30;
      completionPercentage += skills.length > 0 ? 20 : 0;
      completionPercentage += education.length > 0 ? 15 : 0;
      completionPercentage += experiences.length > 0 ? 15 : 0;
      completionPercentage += certifications.length > 0 ? 10 : 0;
      completionPercentage += userData?.current_ctc ? 5 : 0;
      completionPercentage += userData?.expected_ctc ? 5 : 0;
      
      // Calculate advanced ranking
      const rankingResult = calculateAdvancedRanking(
        skills.map(s => ({
          name: s.name,
          level: s.level,
          experience_years: Number(s.experience_years),
          is_verified: s.is_verified || false,
          verification_source: s.verification_source || undefined,
        })),
        education.map(e => ({
          institution: e.institution,
          degree: e.degree,
          field: e.field,
          gpa: e.gpa ? Number(e.gpa) : undefined,
          tier: e.tier || undefined,
          college_tier: e.college_tier || undefined,
        })),
        experiences.map(exp => ({
          company: exp.company,
          role: exp.role,
          start_date: exp.start_date,
          end_date: exp.end_date || undefined,
          is_current: exp.is_current || false,
          description: exp.description || undefined,
        })),
        certifications.map(c => ({
          name: c.name,
          issuer: c.issuer,
          issue_date: c.issue_date,
          expiry_date: c.expiry_date || undefined,
          is_verified: c.is_verified || false,
        })),
        [], // coding assessments
        { completionPercentage, ...userData }
      );
      
      const newScore = rankingResult.total_score;
      
      // Update the rank score in the database
      const { error: updateError } = await supabase
        .from('users')
        .update({ rank_score: newScore })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      const result: RankingUpdateResult = {
        previousScore,
        newScore,
        improvement: newScore - previousScore,
        breakdown: {
          skills: rankingResult.skills.score,
          education: rankingResult.education.score,
          experience: rankingResult.experience.score,
          certifications: rankingResult.certifications.score,
          profile: rankingResult.profile_completeness.score,
        },
        recommendations: rankingResult.recommendations,
      };
      
      setLastResult(result);
      
      // Show improvement toast if rank improved
      if (showToast) {
        if (result.improvement > 0) {
          toast.success(`🎉 Ranking improved by +${result.improvement.toFixed(1)} points!`, {
            description: `Your new rank score is ${newScore.toFixed(1)}`,
          });
        } else if (result.improvement < 0) {
          toast.info('Ranking updated', {
            description: `Your rank score is now ${newScore.toFixed(1)}`,
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error recalculating ranking:', error);
      toast.error('Failed to update ranking');
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  return {
    recalculateRanking,
    isCalculating,
    lastResult,
  };
};
