// Advanced Ranking Algorithm with Coding Assessment Integration
import { getProfileCompletionBonus } from '@/utils/profileCompletion';

export interface SkillData {
  name: string;
  level: number;
  experience_years: number;
  is_verified: boolean;
  verification_source?: string;
}

export interface EducationData {
  institution: string;
  degree: string;
  field: string;
  gpa?: number;
  tier?: number;
  college_tier?: number;
}

export interface ExperienceData {
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface CertificationData {
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  is_verified: boolean;
}

export interface CodingAssessmentData {
  language: string;
  score: number;
  max_score: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  problem_solved: number;
  total_problems: number;
  time_taken: number; // in minutes
  efficiency_score: number; // code efficiency rating
}

export interface RankingBreakdown {
  skills: {
    score: number;
    breakdown: {
      technical_skills: number;
      experience_depth: number;
      skill_diversity: number;
      verification_bonus: number;
    };
  };
  education: {
    score: number;
    breakdown: {
      degree_level: number;
      institution_tier: number;
      academic_performance: number;
      field_relevance: number;
    };
  };
  experience: {
    score: number;
    breakdown: {
      total_years: number;
      role_progression: number;
      company_quality: number;
      industry_diversity: number;
    };
  };
  certifications: {
    score: number;
    breakdown: {
      certification_count: number;
      certification_quality: number;
      recency_bonus: number;
      verification_status: number;
    };
  };
  coding_assessment: {
    score: number;
    breakdown: {
      problem_solving: number;
      code_efficiency: number;
      algorithm_knowledge: number;
      language_proficiency: number;
    };
  };
  profile_completeness: {
    score: number;
    breakdown: {
      basic_info: number;
      professional_summary: number;
      portfolio_links: number;
      recommendations: number;
    };
  };
  total_score: number;
  position_estimate: number;
  recommendations: string[];
}

// Skill tier mapping for different technologies
const SKILL_TIERS = {
  'React': 95,
  'Angular': 90,
  'Vue.js': 85,
  'Node.js': 90,
  'Python': 95,
  'Java': 90,
  'JavaScript': 85,
  'TypeScript': 90,
  'AWS': 95,
  'Azure': 90,
  'Docker': 85,
  'Kubernetes': 95,
  'Machine Learning': 100,
  'Data Science': 95,
  'DevOps': 90,
  'Cybersecurity': 95,
  'Blockchain': 100,
  'AI': 100,
};

// Company tier mapping
const COMPANY_TIERS = {
  'Google': 100,
  'Microsoft': 100,
  'Amazon': 100,
  'Apple': 100,
  'Meta': 100,
  'Netflix': 95,
  'Tesla': 95,
  'Uber': 90,
  'Airbnb': 90,
  'Spotify': 85,
};

// College tier mapping  
const COLLEGE_TIERS = {
  'IIT': 100,
  'IIM': 95,
  'MIT': 100,
  'Stanford': 100,
  'Harvard': 100,
  'Cambridge': 95,
  'Oxford': 95,
  'NIT': 85,
  'IIIT': 80,
};

export function calculateAdvancedRanking(
  skills: SkillData[],
  education: EducationData[],
  experiences: ExperienceData[],
  certifications: CertificationData[],
  codingAssessments: CodingAssessmentData[] = [],
  profileData?: any
): RankingBreakdown {
  
  // Skills Assessment (30% weight)
  const skillsBreakdown = calculateSkillsScore(skills);
  
  // Education Assessment (20% weight)
  const educationBreakdown = calculateEducationScore(education);
  
  // Experience Assessment (25% weight)
  const experienceBreakdown = calculateExperienceScore(experiences);
  
  // Certifications Assessment (10% weight)
  const certificationsBreakdown = calculateCertificationsScore(certifications);
  
  // Coding Assessment (10% weight) - NEW
  const codingBreakdown = calculateCodingScore(codingAssessments);
  
  // Profile Completeness (5% weight) + completion bonus
  const profileBreakdown = calculateProfileScore(profileData);
  
  // Get profile completion bonus (up to 10 additional points)
  const completionPercentage = profileData?.completionPercentage || 0;
  const profileBonus = getProfileCompletionBonus(completionPercentage);
  
  // Calculate weighted total
  const totalScore = 
    (skillsBreakdown.score * 0.30) +
    (educationBreakdown.score * 0.20) +
    (experienceBreakdown.score * 0.25) +
    (certificationsBreakdown.score * 0.10) +
    (codingBreakdown.score * 0.10) +
    (profileBreakdown.score * 0.05) +
    profileBonus; // Add the completion bonus
  
  const positionEstimate = calculatePositionEstimate(totalScore);
  const recommendations = generateRecommendations(
    skillsBreakdown,
    educationBreakdown,
    experienceBreakdown,
    certificationsBreakdown,
    codingBreakdown,
    profileBreakdown
  );
  
  return {
    skills: skillsBreakdown,
    education: educationBreakdown,
    experience: experienceBreakdown,
    certifications: certificationsBreakdown,
    coding_assessment: codingBreakdown,
    profile_completeness: profileBreakdown,
    total_score: Math.round(totalScore * 100) / 100,
    position_estimate: positionEstimate,
    recommendations
  };
}

function calculateSkillsScore(skills: SkillData[]) {
  if (!skills || skills.length === 0) {
    return {
      score: 0,
      breakdown: {
        technical_skills: 0,
        experience_depth: 0,
        skill_diversity: 0,
        verification_bonus: 0
      }
    };
  }

  // Technical skills score based on skill tier and level
  const technicalScore = skills.reduce((sum, skill) => {
    const skillTier = SKILL_TIERS[skill.name] || 50;
    const levelMultiplier = skill.level / 10;
    return sum + (skillTier * levelMultiplier);
  }, 0) / skills.length;

  // Experience depth - average years of experience
  const experienceDepth = skills.reduce((sum, skill) => sum + skill.experience_years, 0) / skills.length;
  const experienceScore = Math.min(experienceDepth * 10, 100);

  // Skill diversity - variety of skills
  const diversityScore = Math.min(skills.length * 5, 100);

  // Verification bonus
  const verifiedSkills = skills.filter(skill => skill.is_verified).length;
  const verificationScore = (verifiedSkills / skills.length) * 100;

  const totalSkillScore = (technicalScore * 0.4) + (experienceScore * 0.3) + (diversityScore * 0.2) + (verificationScore * 0.1);

  return {
    score: Math.min(totalSkillScore, 100),
    breakdown: {
      technical_skills: Math.round(technicalScore),
      experience_depth: Math.round(experienceScore),
      skill_diversity: Math.round(diversityScore),
      verification_bonus: Math.round(verificationScore)
    }
  };
}

function calculateEducationScore(education: EducationData[]) {
  if (!education || education.length === 0) {
    return {
      score: 0,
      breakdown: {
        degree_level: 0,
        institution_tier: 0,
        academic_performance: 0,
        field_relevance: 0
      }
    };
  }

  const highestEducation = education[0]; // Assuming sorted by priority

  // Degree level scoring
  const degreeScores = {
    'PhD': 100,
    'Masters': 80,
    'Bachelor': 60,
    'Diploma': 40,
    'Certificate': 20
  };
  
  const degreeLevel = Object.keys(degreeScores).find(degree => 
    highestEducation.degree.toLowerCase().includes(degree.toLowerCase())
  );
  const degreeLevelScore = degreeScores[degreeLevel] || 50;

  // Institution tier
  const institutionName = highestEducation.institution.toUpperCase();
  const institutionTier = Object.keys(COLLEGE_TIERS).find(tier => 
    institutionName.includes(tier)
  );
  const institutionScore = COLLEGE_TIERS[institutionTier] || (highestEducation.college_tier ? (5 - highestEducation.college_tier) * 20 : 50);

  // Academic performance (GPA)
  const gpaScore = highestEducation.gpa ? (highestEducation.gpa / 4.0) * 100 : 70;

  // Field relevance to tech
  const techFields = ['computer', 'software', 'information', 'data', 'engineering', 'mathematics'];
  const isRelevantField = techFields.some(field => 
    highestEducation.field.toLowerCase().includes(field)
  );
  const fieldRelevanceScore = isRelevantField ? 100 : 60;

  const totalEducationScore = (degreeLevelScore * 0.3) + (institutionScore * 0.4) + (gpaScore * 0.2) + (fieldRelevanceScore * 0.1);

  return {
    score: Math.min(totalEducationScore, 100),
    breakdown: {
      degree_level: Math.round(degreeLevelScore),
      institution_tier: Math.round(institutionScore),
      academic_performance: Math.round(gpaScore),
      field_relevance: Math.round(fieldRelevanceScore)
    }
  };
}

function calculateExperienceScore(experiences: ExperienceData[]) {
  if (!experiences || experiences.length === 0) {
    return {
      score: 0,
      breakdown: {
        total_years: 0,
        role_progression: 0,
        company_quality: 0,
        industry_diversity: 0
      }
    };
  }

  // Total years of experience
  const totalYears = experiences.reduce((sum, exp) => {
    const startDate = new Date(exp.start_date);
    const endDate = exp.end_date ? new Date(exp.end_date) : new Date();
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return sum + years;
  }, 0);
  const yearsScore = Math.min(totalYears * 15, 100);

  // Role progression (seniority levels)
  const seniorityLevels = ['intern', 'junior', 'mid', 'senior', 'lead', 'principal', 'architect', 'director', 'vp', 'cto'];
  const progressionScore = experiences.reduce((maxLevel, exp) => {
    const roleLevel = seniorityLevels.findIndex(level => 
      exp.role.toLowerCase().includes(level)
    );
    return Math.max(maxLevel, roleLevel >= 0 ? roleLevel * 10 : 30);
  }, 0);

  // Company quality
  const companyScore = experiences.reduce((sum, exp) => {
    const companyTier = Object.keys(COMPANY_TIERS).find(company => 
      exp.company.toLowerCase().includes(company.toLowerCase())
    );
    return sum + (COMPANY_TIERS[companyTier] || 50);
  }, 0) / experiences.length;

  // Industry diversity
  const uniqueCompanies = [...new Set(experiences.map(exp => exp.company))];
  const diversityScore = Math.min(uniqueCompanies.length * 20, 100);

  const totalExperienceScore = (yearsScore * 0.4) + (progressionScore * 0.3) + (companyScore * 0.2) + (diversityScore * 0.1);

  return {
    score: Math.min(totalExperienceScore, 100),
    breakdown: {
      total_years: Math.round(yearsScore),
      role_progression: Math.round(progressionScore),
      company_quality: Math.round(companyScore),
      industry_diversity: Math.round(diversityScore)
    }
  };
}

function calculateCertificationsScore(certifications: CertificationData[]) {
  if (!certifications || certifications.length === 0) {
    return {
      score: 0,
      breakdown: {
        certification_count: 0,
        certification_quality: 0,
        recency_bonus: 0,
        verification_status: 0
      }
    };
  }

  // Count bonus
  const countScore = Math.min(certifications.length * 15, 100);

  // Quality based on issuer
  const qualityIssuers = ['AWS', 'Microsoft', 'Google', 'Oracle', 'Cisco', 'IBM', 'Red Hat'];
  const qualityScore = certifications.reduce((sum, cert) => {
    const isQualityIssuer = qualityIssuers.some(issuer => 
      cert.issuer.toLowerCase().includes(issuer.toLowerCase())
    );
    return sum + (isQualityIssuer ? 100 : 60);
  }, 0) / certifications.length;

  // Recency bonus
  const currentDate = new Date();
  const recencyScore = certifications.reduce((sum, cert) => {
    const issueDate = new Date(cert.issue_date);
    const monthsOld = (currentDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return sum + Math.max(100 - monthsOld * 2, 20);
  }, 0) / certifications.length;

  // Verification status
  const verifiedCerts = certifications.filter(cert => cert.is_verified).length;
  const verificationScore = (verifiedCerts / certifications.length) * 100;

  const totalCertScore = (countScore * 0.3) + (qualityScore * 0.4) + (recencyScore * 0.2) + (verificationScore * 0.1);

  return {
    score: Math.min(totalCertScore, 100),
    breakdown: {
      certification_count: Math.round(countScore),
      certification_quality: Math.round(qualityScore),
      recency_bonus: Math.round(recencyScore),
      verification_status: Math.round(verificationScore)
    }
  };
}

function calculateCodingScore(assessments: CodingAssessmentData[]) {
  if (!assessments || assessments.length === 0) {
    return {
      score: 0,
      breakdown: {
        problem_solving: 0,
        code_efficiency: 0,
        algorithm_knowledge: 0,
        language_proficiency: 0
      }
    };
  }

  // Problem solving (based on completion rate)
  const problemSolvingScore = assessments.reduce((sum, assessment) => {
    const completionRate = (assessment.problem_solved / assessment.total_problems) * 100;
    return sum + completionRate;
  }, 0) / assessments.length;

  // Code efficiency
  const efficiencyScore = assessments.reduce((sum, assessment) => {
    return sum + assessment.efficiency_score;
  }, 0) / assessments.length;

  // Algorithm knowledge (based on difficulty levels completed)
  const difficultyWeights = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
  const algorithmScore = assessments.reduce((sum, assessment) => {
    const difficultyMultiplier = difficultyWeights[assessment.difficulty_level];
    const scorePercentage = (assessment.score / assessment.max_score) * 100;
    return sum + (scorePercentage * difficultyMultiplier / 100);
  }, 0) / assessments.length;

  // Language proficiency (average across all languages)
  const languageScore = assessments.reduce((sum, assessment) => {
    return sum + ((assessment.score / assessment.max_score) * 100);
  }, 0) / assessments.length;

  const totalCodingScore = (problemSolvingScore * 0.3) + (efficiencyScore * 0.25) + (algorithmScore * 0.25) + (languageScore * 0.2);

  return {
    score: Math.min(totalCodingScore, 100),
    breakdown: {
      problem_solving: Math.round(problemSolvingScore),
      code_efficiency: Math.round(efficiencyScore),
      algorithm_knowledge: Math.round(algorithmScore),
      language_proficiency: Math.round(languageScore)
    }
  };
}

function calculateProfileScore(profileData: any) {
  if (!profileData) {
    return {
      score: 50,
      breakdown: {
        basic_info: 50,
        professional_summary: 0,
        portfolio_links: 0,
        recommendations: 0
      }
    };
  }

  // Basic info completeness
  const basicFields = ['name', 'email', 'phone', 'location'];
  const completedBasic = basicFields.filter(field => profileData[field]).length;
  const basicScore = (completedBasic / basicFields.length) * 100;

  // Professional summary
  const summaryScore = profileData.bio && profileData.bio.length > 100 ? 100 : 
                      profileData.bio && profileData.bio.length > 50 ? 70 : 
                      profileData.bio ? 40 : 0;

  // Portfolio/website links
  const portfolioScore = profileData.website ? 100 : 0;

  // Recommendations (placeholder - would need separate table)
  const recommendationsScore = 0; // To be implemented

  const totalProfileScore = (basicScore * 0.4) + (summaryScore * 0.3) + (portfolioScore * 0.2) + (recommendationsScore * 0.1);

  return {
    score: totalProfileScore,
    breakdown: {
      basic_info: Math.round(basicScore),
      professional_summary: Math.round(summaryScore),
      portfolio_links: Math.round(portfolioScore),
      recommendations: Math.round(recommendationsScore)
    }
  };
}

function calculatePositionEstimate(totalScore: number): number {
  // Estimate position based on score distribution
  if (totalScore >= 90) return Math.floor(Math.random() * 50) + 1;
  if (totalScore >= 80) return Math.floor(Math.random() * 200) + 51;
  if (totalScore >= 70) return Math.floor(Math.random() * 500) + 251;
  if (totalScore >= 60) return Math.floor(Math.random() * 1000) + 751;
  return Math.floor(Math.random() * 2000) + 1751;
}

function generateRecommendations(
  skills: any,
  education: any,
  experience: any,
  certifications: any,
  coding: any,
  profile: any
): string[] {
  const recommendations: string[] = [];

  if (skills.score < 70) {
    recommendations.push("Add more in-demand technical skills to boost your ranking");
    recommendations.push("Get your existing skills verified through assessments");
  }

  if (experience.breakdown.total_years < 50) {
    recommendations.push("Gain more professional experience in your field");
  }

  if (certifications.score < 60) {
    recommendations.push("Obtain industry-recognized certifications from top providers");
  }

  if (coding.score < 70) {
    recommendations.push("Take coding assessments to demonstrate your programming abilities");
    recommendations.push("Practice algorithm problems to improve problem-solving scores");
  }

  if (profile.score < 80) {
    recommendations.push("Complete your profile with professional summary and portfolio links");
  }

  if (education.breakdown.institution_tier < 70) {
    recommendations.push("Consider additional education or specialized courses from top institutions");
  }

  return recommendations;
}