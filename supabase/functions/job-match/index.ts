
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase client');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userId, jobId } = await req.json();

    console.log(`Computing match for user ${userId} and job ${jobId}`);

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) throw jobError;

    // Get user skills
    const { data: userSkills, error: skillsError } = await supabase
      .from('skills')
      .select('name, level, experience_years')
      .eq('user_id', userId);

    if (skillsError) throw skillsError;

    console.log(`Found ${userSkills.length} skills for user`);
    console.log(`Job requires skills: ${job.required_skills}`);

    // Calculate match score
    let matchScore = 0;
    let totalPossibleScore = 0;

    // Convert user skills to a map for easy lookup
    const userSkillMap = new Map();
    userSkills.forEach((skill) => {
      userSkillMap.set(skill.name.toLowerCase(), {
        level: skill.level,
        years: skill.experience_years,
      });
    });

    // Calculate match for each required skill
    job.required_skills.forEach((skillName) => {
      totalPossibleScore += 100;
      
      const userSkill = userSkillMap.get(skillName.toLowerCase());
      if (userSkill) {
        // Base points for having the skill
        matchScore += 50;
        
        // Add points based on skill level (max 25)
        matchScore += userSkill.level * 5;
        
        // Add points based on experience years (max 25)
        matchScore += Math.min(userSkill.years * 5, 25);
      }
    });

    // Calculate percentage match
    const matchPercentage = totalPossibleScore > 0 
      ? Math.round((matchScore / totalPossibleScore) * 100) 
      : 0;

    console.log(`Match percentage: ${matchPercentage}%`);

    // Return the calculated match
    return new Response(JSON.stringify({ matchPercentage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
