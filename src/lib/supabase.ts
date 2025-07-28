
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Authentication functions
export async function signUp(email: string, password: string, userData: any) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: null
      }
    });

    if (error) throw error;
    
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
    console.log('Attempting to sign in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Sign in response:', { data: !!data, error: error?.message });

    if (!error) {
      return { data, error: null };
    }
    
    if (error.message && error.message.includes("Email not confirmed")) {
      console.log("Email not confirmed, attempting alternative sign in...");
      
      try {
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
    // Don't log session missing errors as they're expected when not logged in
    if (error?.name !== 'AuthSessionMissingError') {
      console.error("Error getting current user:", error);
    }
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
    console.log("Starting getJobs function...");
    
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
      return { jobs: [], error: jobsError };
    }
    
    console.log("Jobs fetched successfully, count:", jobsData?.length || 0);

    if (!jobsData || jobsData.length === 0) {
      return { jobs: [], error: null };
    }

    const employerIds = jobsData.map(job => job.employer_id).filter(Boolean);
    
    if (employerIds.length > 0) {
      try {
        const { data: employersData, error: employersError } = await supabase
          .from('users')
          .select('id, name, company')
          .in('id', employerIds);

        if (!employersError && employersData && employersData.length > 0) {
          const employersMap = employersData.reduce((map: Record<string, any>, employer) => {
            map[employer.id] = employer;
            return map;
          }, {});

          const jobsWithEmployers = jobsData.map(job => ({
            ...job,
            employer: employersMap[job.employer_id] || null
          }));
          
          console.log("Jobs enriched with employer data:", jobsWithEmployers.length);
          return { jobs: jobsWithEmployers, error: null };
        }
      } catch (employerError) {
        console.error("Error processing employer data:", employerError);
      }
    }
    
    console.log("Returning jobs without employer data:", jobsData.length);
    return { jobs: jobsData, error: null };
  } catch (error: any) {
    console.error("Exception in getJobs function:", error);
    return { jobs: [], error };
  }
}

export async function createJob(jobData: any) {
  try {
    const { user } = await getCurrentUser();
    if (!user) throw new Error("You must be logged in to post a job");

    const newJobData = {
      ...jobData,
      employer_id: user.id,
      created_at: new Date(),
      is_active: true
    };

    console.log("Creating job with data:", newJobData);

    const { data, error } = await supabase
      .from('jobs')
      .insert(newJobData)
      .select()
      .single();

    if (error) throw error;
    
    console.log("Job created successfully:", data);
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
    console.log("Applying for job with data:", applicationData);
    
    const { data: existingApplications, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .match({ 
        job_id: applicationData.job_id,
        candidate_id: applicationData.candidate_id
      });
      
    if (checkError) throw checkError;
    
    if (existingApplications && existingApplications.length > 0) {
      throw new Error("You have already applied for this job");
    }
    
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();

    if (error) throw error;
    
    console.log("Application submitted successfully:", data);
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
    
    console.log("User applications fetched:", data);
    return { applications: data, error: null };
  } catch (error: any) {
    console.error("Error fetching user applications:", error);
    return { applications: [], error };
  }
}

export async function calculateUserRank(userId: string) {
  try {
    try {
      const response = await supabase.functions.invoke('rank-calculator', {
        body: { userId }
      });
      
      if (response.data && !response.error) {
        return { rank: response.data.rank, error: null };
      }
    } catch (edgeFunctionError) {
      console.log("Edge function failed, falling back to RPC:", edgeFunctionError);
    }
    
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
          status,
          candidate_id,
          created_at,
          candidate_note
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

export async function updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected') {
  try {
    console.log(`Updating application ${applicationId} status to ${status}`);
    
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating application status:", error);
      throw error;
    }
    
    return { application: data, error: null };
  } catch (error: any) {
    console.error("Exception in updateApplicationStatus function:", error);
    return { application: null, error };
  }
}

export async function getJobById(jobId: string) {
  try {
    console.log(`Fetching job with ID: ${jobId}`);
    
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError) {
      console.error("Error fetching job by ID:", jobError);
      throw jobError;
    }
    
    let jobWithDetails: any = {
      ...jobData,
      employer: undefined,
      applications: []
    };
    
    if (jobData && jobData.employer_id) {
      try {
        const { data: employerData } = await supabase
          .from('users')
          .select('*')
          .eq('id', jobData.employer_id)
          .single();
          
        if (employerData) {
          jobWithDetails.employer = employerData;
        }
      } catch (employerError) {
        console.warn("Could not fetch employer data:", employerError);
      }
    }
    
    try {
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          candidate_id,
          created_at,
          candidate_note
        `)
        .eq('job_id', jobId);
        
      if (applicationsData) {
        jobWithDetails.applications = applicationsData;
      }
    } catch (applicationsError) {
      console.warn("Could not fetch applications:", applicationsError);
      jobWithDetails.applications = [];
    }
    
    console.log("Job fetched successfully:", jobWithDetails);
    return { job: jobWithDetails, error: null };
  } catch (error: any) {
    console.error("Exception in getJobById function:", error);
    return { job: null, error };
  }
}
