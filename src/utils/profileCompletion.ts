// Profile completion calculation utility

export interface ProfileCompletionResult {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
  recommendations: string[];
}

export const calculateProfileCompletion = (
  user: any,
  skills: any[] = [],
  education: any[] = [],
  experience: any[] = [],
  certifications: any[] = []
): ProfileCompletionResult => {
  const completedFields: string[] = [];
  const missingFields: string[] = [];
  const recommendations: string[] = [];

  // Basic Information (30 points total)
  const basicFields = [
    { key: 'name', label: 'Full Name', points: 3 },
    { key: 'email', label: 'Email Address', points: 3 },
    { key: 'phone', label: 'Phone Number', points: 4 },
    { key: 'location', label: 'Location', points: 4 },
    { key: 'bio', label: 'Professional Summary', points: 6 },
    { key: 'avatar_url', label: 'Profile Photo', points: 5 },
    { key: 'resume_url', label: 'Resume/CV', points: 5 },
  ];

  // Professional Details (20 points for candidates)
  const professionalFields = user?.user_type === 'candidate' 
    ? [
        { key: 'current_ctc', label: 'Current CTC', points: 5 },
        { key: 'expected_ctc', label: 'Expected CTC', points: 5 },
      ]
    : [
        { key: 'company', label: 'Company Name', points: 5 },
        { key: 'industry', label: 'Industry', points: 3 },
        { key: 'size', label: 'Company Size', points: 2 },
        { key: 'website', label: 'Company Website', points: 5 },
      ];

  // Check basic fields
  let totalPoints = 0;
  const maxPoints = 100;

  basicFields.forEach(field => {
    if (user?.[field.key] && user[field.key].toString().trim()) {
      completedFields.push(field.label);
      totalPoints += field.points;
    } else {
      missingFields.push(field.label);
      recommendations.push(`Add your ${field.label.toLowerCase()} to improve your profile`);
    }
  });

  // Check professional fields
  professionalFields.forEach(field => {
    if (user?.[field.key] && user[field.key].toString().trim()) {
      completedFields.push(field.label);
      totalPoints += field.points;
    } else {
      missingFields.push(field.label);
      recommendations.push(`Complete your ${field.label.toLowerCase()}`);
    }
  });

  // Skills (20 points)
  if (user?.user_type === 'candidate') {
    if (skills.length >= 5) {
      completedFields.push('Skills (5+ added)');
      totalPoints += 20;
    } else if (skills.length >= 3) {
      completedFields.push('Skills (3-4 added)');
      totalPoints += 15;
      recommendations.push('Add at least 5 skills to maximize your profile score');
    } else if (skills.length >= 1) {
      completedFields.push('Skills (1-2 added)');
      totalPoints += 10;
      recommendations.push('Add more skills to improve your profile');
    } else {
      missingFields.push('Skills');
      recommendations.push('Add your key skills to help employers find you');
    }
  }

  // Education (15 points)
  if (user?.user_type === 'candidate') {
    if (education.length >= 1) {
      completedFields.push('Education');
      totalPoints += 15;
    } else {
      missingFields.push('Education');
      recommendations.push('Add your educational background');
    }
  }

  // Experience (15 points)
  if (user?.user_type === 'candidate') {
    if (experience.length >= 2) {
      completedFields.push('Work Experience (2+ positions)');
      totalPoints += 15;
    } else if (experience.length >= 1) {
      completedFields.push('Work Experience (1 position)');
      totalPoints += 10;
      recommendations.push('Add more work experiences to strengthen your profile');
    } else {
      missingFields.push('Work Experience');
      recommendations.push('Add your work experience to showcase your expertise');
    }
  }

  // Certifications (bonus, but capped at overall 100%)
  if (user?.user_type === 'candidate' && certifications.length > 0) {
    completedFields.push(`Certifications (${certifications.length})`);
  }

  // For employers, adjust the calculation
  if (user?.user_type === 'employer') {
    totalPoints = Math.min(100, totalPoints * 2); // Employers have fewer fields, so weight them more
  }

  const percentage = Math.min(100, Math.round(totalPoints));

  // Add profile visibility recommendation if applicable
  if (user?.user_type === 'candidate' && !user?.is_profile_public && percentage >= 70) {
    recommendations.push('Consider making your profile public to attract more employers');
  }

  return {
    percentage,
    completedFields,
    missingFields,
    recommendations: recommendations.slice(0, 3), // Top 3 recommendations
  };
};

export const getProfileCompletionBonus = (completionPercentage: number): number => {
  // Award bonus points for profile completion
  if (completionPercentage === 100) return 10; // Full bonus for 100%
  if (completionPercentage >= 90) return 7;
  if (completionPercentage >= 75) return 5;
  if (completionPercentage >= 50) return 2;
  return 0;
};
