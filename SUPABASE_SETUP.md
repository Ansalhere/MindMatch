
# FresherPools Supabase Setup Guide

This document outlines how to set up the Supabase backend for the FresherPools application.

## Database Schema

### 1. Users Table
```sql
create table public.users (
  id uuid references auth.users not null primary key,
  created_at timestamp with time zone default now() not null,
  email text not null,
  name text,
  user_type text not null check (user_type in ('candidate', 'employer')),
  avatar_url text,
  phone text,
  current_ctc text,
  expected_ctc text,
  company text,
  industry text,
  size text,
  website text,
  is_premium boolean default false
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Policies
create policy "Users can view their own data" on users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on users
  for update using (auth.uid() = id);

create policy "Employers can view candidate profiles" on users
  for select using (auth.uid() in (
    select id from users where user_type = 'employer'
  ) and user_type = 'candidate');
```

### 2. Skills Table
```sql
create table public.skills (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references public.users not null,
  name text not null,
  level integer not null check (level between 1 and 5),
  experience_years numeric(3,1) not null,
  is_verified boolean default false,
  verification_source text
);

-- Enable Row Level Security
alter table public.skills enable row level security;

-- Policies
create policy "Users can view their own skills" on skills
  for select using (auth.uid() = user_id);

create policy "Users can insert their own skills" on skills
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own skills" on skills
  for update using (auth.uid() = user_id);

create policy "Users can delete their own skills" on skills
  for delete using (auth.uid() = user_id);

create policy "Employers can view candidate skills" on skills
  for select using (
    auth.uid() in (select id from users where user_type = 'employer')
    and
    user_id in (select id from users where user_type = 'candidate')
  );
```

### 3. Certifications Table
```sql
create table public.certifications (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references public.users not null,
  name text not null,
  issuer text not null,
  issue_date date not null,
  expiry_date date,
  credential_id text,
  credential_url text,
  is_verified boolean default false
);

-- Enable Row Level Security
alter table public.certifications enable row level security;

-- Policies (similar to skills)
```

### 4. Experience Table
```sql
create table public.experiences (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references public.users not null,
  company text not null,
  role text not null,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  description text,
  location text
);

-- Enable Row Level Security
alter table public.experiences enable row level security;

-- Policies (similar to skills)
```

### 5. Education Table
```sql
create table public.education (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references public.users not null,
  institution text not null,
  degree text not null,
  field text not null,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  gpa numeric(3,2),
  tier integer check (tier between 1 and 3)
);

-- Enable Row Level Security
alter table public.education enable row level security;

-- Policies (similar to skills)
```

### 6. Jobs Table
```sql
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  employer_id uuid references public.users not null,
  title text not null,
  description text not null,
  location text not null,
  job_type text not null check (job_type in ('full-time', 'part-time', 'contract', 'internship')),
  min_experience numeric(3,1),
  salary_min integer,
  salary_max integer,
  required_skills text[],
  min_rank_requirement integer check (min_rank_requirement between 1 and 10000),
  closing_date date,
  is_active boolean default true
);

-- Enable Row Level Security
alter table public.jobs enable row level security;

-- Policies
create policy "Employers can manage their own jobs" on jobs
  for all using (auth.uid() = employer_id);

create policy "Anyone can view active jobs" on jobs
  for select using (is_active = true);
```

### 7. Applications Table
```sql
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  job_id uuid references public.jobs not null,
  candidate_id uuid references public.users not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'shortlisted', 'rejected', 'offered', 'accepted')),
  candidate_note text,
  employer_note text
);

-- Enable Row Level Security
alter table public.applications enable row level security;

-- Policies
create policy "Candidates can view and manage their own applications" on applications
  for all using (auth.uid() = candidate_id);

create policy "Employers can view and manage applications for their jobs" on applications
  for all using (
    auth.uid() in (
      select employer_id from jobs where id = job_id
    )
  );
```

### 8. Packages Table
```sql
create table public.packages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  name text not null,
  description text not null,
  user_type text not null check (user_type in ('candidate', 'employer')),
  price numeric(10,2) not null,
  duration_days integer not null,
  job_post_limit integer,
  profile_view_limit integer,
  features text[],
  is_active boolean default true
);

-- No RLS needed for this table as it's read-only for users
```

### 9. Subscriptions Table
```sql
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references public.users not null,
  package_id uuid references public.packages not null,
  start_date date not null,
  end_date date not null,
  is_active boolean default true,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'refunded')),
  payment_reference text
);

-- Enable Row Level Security
alter table public.subscriptions enable row level security;

-- Policies
create policy "Users can view their own subscriptions" on subscriptions
  for select using (auth.uid() = user_id);
```

## Authentication Setup

1. Enable email/password authentication in Supabase Auth settings
2. Set up email templates for verification, password reset, etc.
3. Configure any social providers (Google, LinkedIn) if needed

## Storage Setup

1. Create buckets for:
   - profile_photos
   - resume_documents
   - certification_documents

2. Set up appropriate bucket policies:
```sql
-- Example policy for profile photos
create policy "Users can upload their own profile photo" 
on storage.objects for insert 
with check (bucket_id = 'profile_photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own profile photo" 
on storage.objects for update
using (bucket_id = 'profile_photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view profile photos" 
on storage.objects for select
using (bucket_id = 'profile_photos');
```

## Edge Functions

1. Create an edge function for rank calculation:
```typescript
// rank-calculator.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.12.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { userId } = await req.json();

    // Get user skills
    const { data: skills, error: skillsError } = await supabaseClient
      .from("skills")
      .select("*")
      .eq("user_id", userId);

    if (skillsError) throw skillsError;

    // Get certifications
    const { data: certifications, error: certError } = await supabaseClient
      .from("certifications")
      .select("*")
      .eq("user_id", userId);

    if (certError) throw certError;

    // Get experience
    const { data: experiences, error: expError } = await supabaseClient
      .from("experiences")
      .select("*")
      .eq("user_id", userId);

    if (expError) throw expError;

    // Get education
    const { data: education, error: eduError } = await supabaseClient
      .from("education")
      .select("*")
      .eq("user_id", userId);

    if (eduError) throw eduError;

    // Calculate rank based on various factors
    // This is a simplified version; a real system would be more complex
    let rankScore = 0;

    // Skills contribute to score
    if (skills) {
      skills.forEach((skill) => {
        rankScore += skill.level * 5;
        rankScore += skill.experience_years * 3;
        if (skill.is_verified) rankScore += 10;
      });
    }

    // Certifications contribute to score
    if (certifications) {
      rankScore += certifications.length * 15;
      certifications.forEach((cert) => {
        if (cert.is_verified) rankScore += 10;
      });
    }

    // Experience contributes to score
    if (experiences) {
      experiences.forEach((exp) => {
        // Calculate years of experience
        const startDate = new Date(exp.start_date);
        const endDate = exp.is_current ? new Date() : new Date(exp.end_date);
        const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
        rankScore += years * 20;
      });
    }

    // Education contributes to score
    if (education) {
      education.forEach((edu) => {
        // Higher tier institutions get more points
        rankScore += (4 - edu.tier) * 15;
        if (edu.gpa) rankScore += edu.gpa * 5;
      });
    }

    // Normalize to 0-100 scale
    let normalizedScore = Math.min(100, Math.max(0, rankScore / 5));

    // Update the user's rank in the database
    const { error: updateError } = await supabaseClient
      .from("users")
      .update({ rank_score: normalizedScore })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Return the calculated rank
    return new Response(JSON.stringify({ rank: normalizedScore }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
```

2. Create an edge function for job matching:
```typescript
// job-matcher.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.12.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { userId, jobId } = await req.json();

    // Get job details
    const { data: job, error: jobError } = await supabaseClient
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError) throw jobError;

    // Get user skills
    const { data: userSkills, error: skillsError } = await supabaseClient
      .from("skills")
      .select("name, level, experience_years")
      .eq("user_id", userId);

    if (skillsError) throw skillsError;

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

    // Return the calculated match
    return new Response(JSON.stringify({ matchPercentage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
```

## Client-Side Integration

In your React application:

1. Install the Supabase client:
```
npm install @supabase/supabase-js
```

2. Create a Supabase client in a new file (src/lib/supabase.ts):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

3. Deploy your application to a hosting platform like Vercel, Netlify, or directly from GitHub.

## Environment Variables

Make sure to set these environment variables in your hosting platform:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
