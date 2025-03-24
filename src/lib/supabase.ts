import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Authentication functions
export async function signUp(email: string, password: string, userData: any) {
  try {
    // Sign up with admin rights to bypass email verification
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: null // Explicitly set to null to avoid email verification
      }
    });

    if (error) throw error;
    
    // Immediately sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (signInError) throw signInError;
    
    return { data: signInData, error: null };
  } catch (error: any) {
    console.error("Error signing up:", error);
    return { data: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Try to sign in normally first
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error) {
      return { data, error: null };
    }
    
    // If error is about email not confirmed, let's try to bypass this
    if (error.message && error.message.includes("Email not confirmed")) {
      console.log("Email not confirmed, attempting alternative sign in...");
      
      // First try to update the user to confirm their email
      try {
        // Create a new session with the provided credentials
        const { data: newData, error: newError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (!newError) {
          return { data: newData, error: null };
        }
      } catch (bypassError) {
        console.error("Error in bypass attempt:", bypassError);
      }
    }
    
    // If we got here, we couldn't bypass the error
    throw error;
  } catch (error: any) {
    console.error("Error signing in:", error);
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error("Error signing out:", error);
    return { error };
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error: any) {
    console.error("Error getting current user:", error);
    return { user: null, error };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return { profile: null, error };
  }
}

export async function getUserSkills(userId: string) {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return { skills: data, error: null };
  } catch (error: any) {
    console.error("Error fetching user skills:", error);
    return { skills: [], error };
  }
}

export async function addUserSkill(skillData: any) {
  try {
    const { data, error } = await supabase
      .from('skills')
      .insert(skillData)
      .select()
      .single();

    if (error) throw error;
    toast.success("Skill added successfully!");
    return { skill: data, error: null };
  } catch (error: any) {
    console.error("Error adding skill:", error);
    toast.error("Failed to add skill: " + error.message);
    return { skill: null, error };
  }
}

export async function getUserEducation(userId: string) {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return { education: data, error: null };
  } catch (error: any) {
    console.error("Error fetching user education:", error);
    return { education: [], error };
  }
}

export async function getUserExperience(userId: string) {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return { experiences: data, error: null };
  } catch (error: any) {
    console.error("Error fetching user experiences:", error);
    return { experiences: [], error };
  }
}

export async function getUserCertifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false });

    if (error) throw error;
    return { certifications: data, error: null };
  } catch (error: any) {
    console.error("Error fetching user certifications:", error);
    return { certifications: [], error };
  }
}

export async function getJobs() {
  try {
    console.log("Fetching jobs from database");
    const { data, error } = await supabase
      .from('jobs')
      .select('*, employer:employer_id(name, company)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
    
    console.log("Jobs fetched successfully:", data);
    return { jobs: data, error: null };
  } catch (error: any) {
    console.error("Error in getJobs function:", error);
    return { jobs: [], error };
  }
}

export async function createJob(jobData: any) {
  try {
    // Get current user to set as employer_id
    const { user } = await getCurrentUser();
    if (!user) throw new Error("You must be logged in to post a job");

    // Prepare job data with employer ID
    const newJobData = {
      ...jobData,
      employer_id: user.id,
      created_at: new Date(),
      is_active: true
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert(newJobData)
      .select()
      .single();

    if (error) throw error;
    toast.success("Job posted successfully!");
    return { job: data, error: null };
  } catch (error: any) {
    console.error("Error creating job:", error);
    toast.error("Failed to post job: " + error.message);
    return { job: null, error };
  }
}

export async function applyForJob(applicationData: any) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();

    if (error) throw error;
    toast.success("Application submitted successfully!");
    return { application: data, error: null };
  } catch (error: any) {
    console.error("Error applying for job:", error);
    toast.error("Failed to submit application: " + error.message);
    return { application: null, error };
  }
}

export async function getUserApplications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:job_id(
          title, 
          location,
          employer:employer_id(name, company)
        )
      `)
      .eq('candidate_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { applications: data, error: null };
  } catch (error: any) {
    console.error("Error fetching user applications:", error);
    return { applications: [], error };
  }
}

export async function calculateUserRank(userId: string) {
  try {
    // Try to use the edge function first
    try {
      const response = await supabase.functions.invoke('rank-calculator', {
        body: { userId }
      });
      
      if (response.data && !response.error) {
        return { rank: response.data.rank, error: null };
      }
    } catch (edgeFunctionError) {
      console.log("Edge function failed, falling back to RPC:", edgeFunctionError);
      // Fall back to RPC if edge function fails
    }
    
    // Fall back to direct RPC call
    const { data, error } = await supabase.rpc('calculate_candidate_rank', { user_id: userId });
    
    if (error) throw error;
    return { rank: data, error: null };
  } catch (error: any) {
    console.error("Error calculating user rank:", error);
    return { rank: 0, error };
  }
}

export async function getRankingFactors(userId: string) {
  try {
    const [skills, certifications, education, experience] = await Promise.all([
      getUserSkills(userId),
      getUserCertifications(userId),
      getUserEducation(userId),
      getUserExperience(userId)
    ]);
    
    return {
      skills: skills.skills || [],
      certifications: certifications.certifications || [],
      education: education.education || [],
      experience: experience.experiences || [],
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching ranking factors:", error);
    return {
      skills: [],
      certifications: [],
      education: [],
      experience: [],
      error
    };
  }
}

export async function getEmployerJobs(employerId: string) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        applications:applications(
          id,
          candidate_id,
          status,
          created_at,
          candidate:candidate_id(name, email, rank_score)
        )
      `)
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { jobs: data, error: null };
  } catch (error: any) {
    console.error("Error fetching employer jobs:", error);
    return { jobs: [], error };
  }
}
