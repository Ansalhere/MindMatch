import { z } from 'zod';
import DOMPurify from 'dompurify';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Auth form validation
export const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  user_type: z.enum(['candidate', 'employer']),
});

// Job posting validation
export const jobSchema = z.object({
  title: z.string()
    .min(5, 'Job title must be at least 5 characters')
    .max(200, 'Job title must not exceed 200 characters'),
  description: z.string()
    .min(50, 'Job description must be at least 50 characters')
    .max(5000, 'Job description must not exceed 5000 characters'),
  location: z.string().min(2, 'Location is required'),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']),
  salary_min: z.number().positive().optional(),
  salary_max: z.number().positive().optional(),
  min_experience: z.number().min(0).optional(),
  required_skills: z.array(z.string()).optional(),
  min_rank_requirement: z.number().min(0).max(100).optional(),
  closing_date: z.string().optional(),
}).refine((data) => {
  if (data.salary_min && data.salary_max) {
    return data.salary_min <= data.salary_max;
  }
  return true;
}, {
  message: 'Minimum salary cannot be greater than maximum salary',
  path: ['salary_max'],
});

// Skill validation
export const skillSchema = z.object({
  name: z.string()
    .min(2, 'Skill name must be at least 2 characters')
    .max(100, 'Skill name must not exceed 100 characters'),
  level: z.number()
    .min(1, 'Skill level must be between 1 and 10')
    .max(10, 'Skill level must be between 1 and 10'),
  experience_years: z.number()
    .min(0, 'Experience years cannot be negative')
    .max(50, 'Experience years cannot exceed 50'),
});

// Profile validation
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  current_ctc: z.string().optional(),
  expected_ctc: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

// Input sanitization utility
export const sanitizeInput = (input: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
  }
  // Server-side fallback
  return input.replace(/<[^>]*>/g, '').trim();
};

// Sanitize object utility
export const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

export type AuthFormData = z.infer<typeof authSchema>;
export type JobFormData = z.infer<typeof jobSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;