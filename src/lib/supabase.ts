
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Authentication functions
export async function signUp(email: string, password: string, userData: any) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing up:", error);
    return { data: null, error };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
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

// Skills related functions
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

// User education functions
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

// User experience functions
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

// User certifications functions
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

// Jobs related functions
export async function getJobs() {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, employer:employer_id(name, company)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { jobs: data, error: null };
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], error };
  }
}

export async function createJob(jobData: any) {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
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

// Applications related functions
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

// Calculate user rank (calling the function we created in the database)
export async function calculateUserRank(userId: string) {
  try {
    const { data, error } = await supabase.rpc('calculate_candidate_rank', { user_id: userId });
    
    if (error) throw error;
    return { rank: data, error: null };
  } catch (error: any) {
    console.error("Error calculating user rank:", error);
    return { rank: 0, error };
  }
}
