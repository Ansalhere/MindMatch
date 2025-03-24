
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user_id from request
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Calculate ranking based on various factors
    const rankData = await calculateRanking(supabaseClient, userId);

    // Return the calculated data
    return new Response(JSON.stringify(rankData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error calculating rank:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        suggestion: "Please ensure the user exists and has skills, education, certifications, or experience data.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

async function calculateRanking(supabase, userId) {
  console.log(`Calculating ranking for user: ${userId}`);

  // Get all user data in parallel
  const [
    skillsResponse,
    educationResponse,
    certificationsResponse,
    experienceResponse,
    userResponse
  ] = await Promise.all([
    supabase.from('skills').select('*').eq('user_id', userId),
    supabase.from('education').select('*').eq('user_id', userId),
    supabase.from('certifications').select('*').eq('user_id', userId),
    supabase.from('experiences').select('*').eq('user_id', userId),
    supabase.from('users').select('*').eq('id', userId).single()
  ]);

  // Check for errors
  if (skillsResponse.error) console.error("Error fetching skills:", skillsResponse.error);
  if (educationResponse.error) console.error("Error fetching education:", educationResponse.error);
  if (certificationsResponse.error) console.error("Error fetching certifications:", certificationsResponse.error);
  if (experienceResponse.error) console.error("Error fetching experiences:", experienceResponse.error);
  if (userResponse.error) {
    console.error("Error fetching user:", userResponse.error);
    throw new Error("User not found");
  }

  // Initialize data
  const skills = skillsResponse.data || [];
  const education = educationResponse.data || [];
  const certifications = certificationsResponse.data || [];
  const experiences = experienceResponse.data || [];
  const user = userResponse.data;

  console.log(`Found ${skills.length} skills, ${education.length} education entries, ${certifications.length} certifications, ${experiences.length} experiences`);

  // Calculate ranking components
  const skillsScore = calculateSkillsScore(skills);
  const educationScore = calculateEducationScore(education);
  const certificationScore = calculateCertificationScore(certifications);
  const experienceScore = calculateExperienceScore(experiences);

  // Calculate total rank score (weighted)
  const weights = {
    skills: 0.35,
    education: 0.25,
    certifications: 0.15,
    experience: 0.25
  };

  const totalRankScore = (
    (skillsScore * weights.skills) +
    (educationScore * weights.education) +
    (certificationScore * weights.certifications) +
    (experienceScore * weights.experience)
  );

  // Normalize to 0-100 scale
  const finalRankScore = Math.min(100, Math.max(0, totalRankScore));
  
  // Update the user's rank_score in the database
  const { error: updateError } = await supabase
    .from('users')
    .update({ rank_score: finalRankScore.toFixed(2) })
    .eq('id', userId);

  if (updateError) {
    console.error("Error updating user rank:", updateError);
  } else {
    console.log(`Updated user rank to ${finalRankScore.toFixed(2)}`);
  }

  // Return calculated information
  return {
    rank: finalRankScore.toFixed(2),
    components: {
      skills: {
        score: skillsScore.toFixed(2),
        count: skills.length,
        weight: weights.skills
      },
      education: {
        score: educationScore.toFixed(2),
        count: education.length,
        weight: weights.education
      },
      certifications: {
        score: certificationScore.toFixed(2),
        count: certifications.length,
        weight: weights.certifications
      },
      experience: {
        score: experienceScore.toFixed(2),
        count: experiences.length,
        weight: weights.experience,
        years: calculateTotalExperienceYears(experiences)
      }
    },
    position: calculatePositionEstimate(finalRankScore),
    recommendation: generateRecommendation(skills, education, certifications, experiences)
  };
}

function calculateSkillsScore(skills) {
  if (!skills.length) return 0;

  // Calculate based on skill level and years of experience
  return skills.reduce((score, skill) => {
    const levelScore = (skill.level || 1) * 15; // Level 1-5: 15-75 points
    const expScore = (skill.experience_years || 0) * 5; // Each year: 5 points
    const verificationBonus = skill.is_verified ? 10 : 0; // Verified skills get a bonus
    
    return score + levelScore + expScore + verificationBonus;
  }, 0) / (skills.length * 100) * 100; // Normalize to 0-100
}

function calculateEducationScore(education) {
  if (!education.length) return 0;

  return education.reduce((score, edu) => {
    // Tier represents education level (1: PhD, 2: Masters, 3: Bachelors, 4: Associates, 5: Certificate)
    const tierScore = 100 - ((edu.tier || 3) - 1) * 20; // Tier 1: 100, Tier 5: 20
    
    // GPA bonus (if applicable)
    const gpaScore = edu.gpa ? (edu.gpa / 4) * 20 : 0; // Max 20 points for 4.0 GPA
    
    // Completion bonus
    const completionBonus = !edu.is_current && edu.end_date ? 10 : 0;
    
    return score + tierScore + gpaScore + completionBonus;
  }, 0) / (education.length * 130) * 100; // Normalize to 0-100
}

function calculateCertificationScore(certifications) {
  if (!certifications.length) return 0;

  const currentDate = new Date();
  
  return certifications.reduce((score, cert) => {
    // Base certification score
    let certScore = 70;
    
    // Verification bonus
    if (cert.is_verified) certScore += 20;
    
    // Check if certification is expired
    if (cert.expiry_date) {
      const expiryDate = new Date(cert.expiry_date);
      if (expiryDate < currentDate) {
        certScore *= 0.5; // Reduce score for expired certifications
      }
    }
    
    // Recency bonus - newer certifications are worth more
    if (cert.issue_date) {
      const issueDate = new Date(cert.issue_date);
      const ageInYears = (currentDate.getTime() - issueDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
      if (ageInYears < 2) certScore += 10; // Recent certifications get a boost
    }
    
    return score + certScore;
  }, 0) / (certifications.length * 100) * 100; // Normalize to 0-100
}

function calculateExperienceScore(experiences) {
  if (!experiences.length) return 0;

  const totalYears = calculateTotalExperienceYears(experiences);
  
  // Score based on years of experience
  let yearsScore = Math.min(totalYears * 10, 80); // Cap at 80 points for 8+ years
  
  // Bonuses for role diversity and recency
  const roleTypes = new Set(experiences.map(exp => exp.role)).size;
  const diversityBonus = Math.min(roleTypes * 5, 20); // Up to 20 points for diverse roles
  
  // Calculate how recent the experience is
  const hasCurrentJob = experiences.some(exp => exp.is_current);
  const recencyBonus = hasCurrentJob ? 10 : 0; // 10 points if currently employed
  
  return Math.min(yearsScore + diversityBonus + recencyBonus, 100);
}

function calculateTotalExperienceYears(experiences) {
  const currentDate = new Date();
  
  return experiences.reduce((total, exp) => {
    const startDate = new Date(exp.start_date);
    const endDate = exp.is_current ? currentDate : exp.end_date ? new Date(exp.end_date) : currentDate;
    
    const durationInYears = (endDate.getTime() - startDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
    return total + Math.max(0, durationInYears); // Prevent negative durations
  }, 0);
}

function calculatePositionEstimate(finalScore) {
  // Simplified position estimation - could be made more sophisticated
  // This is just a rough estimate based on the score
  if (finalScore > 90) return { position: Math.floor(Math.random() * 30) + 1, total: 5000 };
  if (finalScore > 80) return { position: Math.floor(Math.random() * 70) + 30, total: 5000 };
  if (finalScore > 70) return { position: Math.floor(Math.random() * 100) + 100, total: 5000 };
  if (finalScore > 60) return { position: Math.floor(Math.random() * 200) + 200, total: 5000 };
  if (finalScore > 50) return { position: Math.floor(Math.random() * 300) + 400, total: 5000 };
  
  // For scores under 50
  return { position: Math.floor(Math.random() * 1000) + 800, total: 5000 };
}

function generateRecommendation(skills, education, certifications, experiences) {
  const recommendations = [];
  
  // Check for missing components
  if (skills.length < 3) {
    recommendations.push("Add more skills to improve your ranking. Try to add at least 3-5 core skills in your domain.");
  }
  
  if (education.length === 0) {
    recommendations.push("Add your educational background to boost your profile ranking.");
  }
  
  if (certifications.length === 0) {
    recommendations.push("Consider adding relevant certifications to demonstrate your expertise.");
  }
  
  if (experiences.length === 0) {
    recommendations.push("Add your work experience to significantly improve your ranking.");
  }
  
  // Check for low skill levels
  const lowLevelSkills = skills.filter(skill => (skill.level || 0) < 3);
  if (lowLevelSkills.length > 0 && skills.length > 0) {
    recommendations.push("Improve your proficiency level in existing skills to enhance your ranking.");
  }
  
  // If everything looks good
  if (recommendations.length === 0) {
    recommendations.push("Your profile is well-rounded. Consider keeping your skills and certifications up to date.");
  }
  
  return recommendations;
}
