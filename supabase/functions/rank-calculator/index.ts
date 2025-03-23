
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
    
    // Parse request body
    let userId;
    try {
      const { userId: reqUserId } = await req.json();
      userId = reqUserId;
    } catch (e) {
      console.error("Error parsing request body:", e);
      throw new Error('Invalid request format. Expected {"userId": "uuid"}');
    }

    if (!userId) {
      throw new Error('Missing required parameter: userId');
    }

    console.log(`Computing rank for user ${userId}`);

    // Get user profile info first to make sure user exists
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('id, name, user_type')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error("User profile error:", userError);
      throw new Error(`User not found: ${userId}`);
    }
    
    if (userProfile.user_type !== 'candidate') {
      console.log("User is not a candidate, returning default rank");
      return new Response(JSON.stringify({ rank: 0, message: "Ranking only applies to candidates" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Call the database function
    const { data, error } = await supabase.rpc('calculate_candidate_rank', {
      user_id: userId
    });

    if (error) {
      console.error("Error calculating rank:", error);
      throw error;
    }

    console.log(`Calculated rank: ${data}`);

    // Get additional ranking breakdown
    const { data: skills } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId);
      
    const { data: certs } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId);
      
    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId);
      
    const { data: experience } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', userId);
    
    // Calculate some basic breakdown stats
    const breakdown = {
      skills: {
        count: skills?.length || 0,
        averageLevel: skills?.length ? skills.reduce((sum, s) => sum + s.level, 0) / skills.length : 0
      },
      certifications: certs?.length || 0,
      education: education?.length || 0,
      experience: {
        count: experience?.length || 0,
        totalYears: experience?.length 
          ? experience.reduce((sum, exp) => {
              const startDate = new Date(exp.start_date);
              const endDate = exp.is_current ? new Date() : new Date(exp.end_date);
              const years = (endDate.getTime() - startDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
              return sum + years;
            }, 0) 
          : 0
      }
    };

    // Return the calculated rank with breakdown info
    return new Response(JSON.stringify({ 
      rank: data,
      breakdown,
      user: {
        id: userProfile.id,
        name: userProfile.name
      }
    }), {
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
