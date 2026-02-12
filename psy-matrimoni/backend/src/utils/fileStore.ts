import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// ── Indian Matrimonial Profile ──────────────────────────────────
export interface IndianProfile {
  id: string;
  userId: string;
  // Basic
  name: string;
  age: number;
  gender: 'male' | 'female';
  dateOfBirth: string;
  height: string; // e.g. "5'8\""
  weight?: string;
  bodyType?: string;
  complexion?: string;
  // Contact
  phone: string;
  location: string;
  city: string;
  state: string;
  country: string;
  // Religion & Community
  religion: string;
  caste?: string;
  subCaste?: string;
  gothra?: string;
  motherTongue: string;
  // Horoscope
  manglik?: 'yes' | 'no' | 'partial' | 'not_sure';
  rashi?: string;
  nakshatra?: string;
  // Family
  familyType: 'joint' | 'nuclear' | 'other';
  familyStatus: 'middle_class' | 'upper_middle' | 'rich' | 'affluent';
  familyValues: 'orthodox' | 'moderate' | 'liberal';
  fatherOccupation?: string;
  motherOccupation?: string;
  siblings?: string;
  // Education & Career
  education: string;
  educationDetail?: string;
  occupation: string;
  company?: string;
  annualIncome?: string;
  workingWith?: 'private' | 'government' | 'business' | 'not_working';
  // Lifestyle
  diet: 'vegetarian' | 'non_vegetarian' | 'eggetarian' | 'vegan' | 'jain';
  smoking: 'no' | 'occasionally' | 'yes';
  drinking: 'no' | 'occasionally' | 'yes';
  // About
  bio: string;
  interests: string[];
  hobbies: string[];
  // Partner Preferences
  partnerPreferences: PartnerPreferences;
  // Psychology
  psychologyStatus: 'not_started' | 'session_booked' | 'assessment_done' | 'scored';
  psychologyScore?: PsychologyScore;
  // Photos
  photos: string[];
  // Metadata
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerPreferences {
  ageMin: number;
  ageMax: number;
  heightMin?: string;
  heightMax?: string;
  religion?: string[];
  caste?: string[];
  motherTongue?: string[];
  education?: string[];
  occupation?: string[];
  annualIncomeMin?: string;
  city?: string[];
  state?: string[];
  manglik?: string;
  diet?: string[];
  smoking?: string;
  drinking?: string;
  familyType?: string[];
}

// ── Psychology System ───────────────────────────────────────────
export interface PsychologyScore {
  overall: number; // 0-100
  dimensions: {
    emotionalStability: number;
    openness: number;
    agreeableness: number;
    conscientiousness: number;
    extroversion: number;
    attachmentStyle: string; // secure, anxious, avoidant, fearful
    communicationStyle: string; // assertive, passive, aggressive, passive-aggressive
    conflictResolution: string; // collaborative, compromising, accommodating, avoiding, competing
    loveLanguage: string; // words, touch, gifts, service, time
    values: string[]; // family, career, spirituality, adventure, stability, etc.
  };
  psychologistNotes?: string;
  assessedBy?: string;
  assessedAt?: string;
}

export interface PsychologySession {
  id: string;
  userId: string;
  type: 'individual' | 'joint';
  status: 'booked' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: string;
  psychologistName: string;
  psychologistId: string;
  // For joint sessions
  partnerId?: string;
  // Assessment results
  assessmentResponses?: Record<string, any>;
  notes?: string;
  score?: PsychologyScore;
  createdAt: string;
  completedAt?: string;
}

export interface JointSession {
  id: string;
  requesterId: string;
  partnerId: string;
  status: 'requested' | 'accepted' | 'booked' | 'completed' | 'cancelled';
  psychologistName?: string;
  scheduledAt?: string;
  compatibilityReport?: CompatibilityReport;
  createdAt: string;
}

export interface CompatibilityReport {
  overallScore: number; // 0-100
  breakdown: {
    psychologicalMatch: number;
    valuesAlignment: number;
    communicationCompat: number;
    lifestyleCompat: number;
    familyCompat: number;
    emotionalCompat: number;
  };
  strengths: string[];
  challenges: string[];
  psychologistRecommendation: string;
  generatedAt: string;
}

// ── Store ───────────────────────────────────────────────────────
export interface DataStore {
  users: any[];
  profiles: IndianProfile[];
  requests: any[];
  psychologySessions: PsychologySession[];
  jointSessions: JointSession[];
  assessmentQuestions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  type: 'scale' | 'choice' | 'multi_choice' | 'text';
  options?: string[];
  dimension: string;
}

const defaultStore: DataStore = {
  users: [],
  profiles: [],
  requests: [],
  psychologySessions: [],
  jointSessions: [],
  assessmentQuestions: getDefaultQuestions(),
};

function getDefaultQuestions(): AssessmentQuestion[] {
  return [
    // Emotional Stability
    { id: 'es1', category: 'Emotional Stability', question: 'How do you typically handle unexpected stressful situations?', type: 'choice', options: ['I stay calm and composed', 'I feel anxious but manage', 'I get overwhelmed easily', 'I avoid thinking about it'], dimension: 'emotionalStability' },
    { id: 'es2', category: 'Emotional Stability', question: 'When you have a disagreement with someone close, what is your first reaction?', type: 'choice', options: ['I try to understand their perspective', 'I need time to cool down first', 'I express my feelings immediately', 'I tend to withdraw and stay silent'], dimension: 'emotionalStability' },
    { id: 'es3', category: 'Emotional Stability', question: 'How quickly do you recover from emotional setbacks?', type: 'scale', dimension: 'emotionalStability' },
    // Openness
    { id: 'op1', category: 'Openness & Growth', question: 'How open are you to trying new experiences, foods, or travel destinations?', type: 'scale', dimension: 'openness' },
    { id: 'op2', category: 'Openness & Growth', question: 'How important is personal growth and learning to you?', type: 'choice', options: ['Extremely important — I constantly learn', 'Important — I seek growth regularly', 'Somewhat important', 'I prefer stability over change'], dimension: 'openness' },
    { id: 'op3', category: 'Openness & Growth', question: 'How do you feel about your partner having different cultural or religious views?', type: 'choice', options: ['Completely comfortable', 'Open to it with boundaries', 'Prefer similar views', 'Need same background'], dimension: 'openness' },
    // Communication
    { id: 'cm1', category: 'Communication Style', question: 'How do you prefer to resolve conflicts in a relationship?', type: 'choice', options: ['Open discussion right away', 'Cool down first, then talk', 'Write my thoughts down', 'Prefer to let things settle naturally'], dimension: 'communicationStyle' },
    { id: 'cm2', category: 'Communication Style', question: 'How do you express love and affection?', type: 'multi_choice', options: ['Words of affirmation', 'Physical touch', 'Acts of service', 'Gift giving', 'Quality time'], dimension: 'loveLanguage' },
    { id: 'cm3', category: 'Communication Style', question: 'How important is daily communication with your partner?', type: 'scale', dimension: 'communicationStyle' },
    // Values
    { id: 'vl1', category: 'Values & Beliefs', question: 'What matters most to you in life? (Select up to 3)', type: 'multi_choice', options: ['Family & relationships', 'Career & success', 'Spiritual growth', 'Financial security', 'Adventure & freedom', 'Social impact', 'Health & wellness', 'Creative expression'], dimension: 'values' },
    { id: 'vl2', category: 'Values & Beliefs', question: 'How important is your partner\'s involvement in family decisions?', type: 'scale', dimension: 'agreeableness' },
    { id: 'vl3', category: 'Values & Beliefs', question: 'How do you view the role of traditions in married life?', type: 'choice', options: ['Very important — should be followed', 'Important but flexible', 'Nice to have but optional', 'Prefer a modern approach'], dimension: 'values' },
    // Relationship
    { id: 'rl1', category: 'Relationship Expectations', question: 'What is your ideal living arrangement after marriage?', type: 'choice', options: ['With joint family', 'Near family but separate home', 'Independent — just us', 'Flexible based on needs'], dimension: 'agreeableness' },
    { id: 'rl2', category: 'Relationship Expectations', question: 'How do you feel about your partner having close friends of the opposite gender?', type: 'choice', options: ['Completely fine', 'Fine with transparency', 'Slightly uncomfortable', 'Prefer they don\'t'], dimension: 'emotionalStability' },
    { id: 'rl3', category: 'Relationship Expectations', question: 'How important is financial planning and saving to you?', type: 'scale', dimension: 'conscientiousness' },
    // Lifestyle
    { id: 'ls1', category: 'Lifestyle Compatibility', question: 'How do you prefer to spend weekends?', type: 'multi_choice', options: ['Socializing with friends/family', 'Outdoor activities', 'Staying home relaxing', 'Pursuing hobbies', 'Religious/spiritual activities', 'Travel & exploration'], dimension: 'extroversion' },
    { id: 'ls2', category: 'Lifestyle Compatibility', question: 'How important is health and fitness in your daily routine?', type: 'scale', dimension: 'conscientiousness' },
    { id: 'ls3', category: 'Lifestyle Compatibility', question: 'How do you handle household responsibilities?', type: 'choice', options: ['Equal sharing is a must', 'Whoever is available handles it', 'Traditional roles are fine', 'Happy to take the lead'], dimension: 'agreeableness' },
    // Attachment
    { id: 'at1', category: 'Emotional Connection', question: 'How comfortable are you with emotional vulnerability?', type: 'scale', dimension: 'attachmentStyle' },
    { id: 'at2', category: 'Emotional Connection', question: 'How do you react when your partner needs space?', type: 'choice', options: ['I respect it and give them space', 'I understand but feel anxious', 'I worry about the relationship', 'I also prefer my own space'], dimension: 'attachmentStyle' },
    { id: 'at3', category: 'Emotional Connection', question: 'What does trust mean to you in a relationship? Describe briefly.', type: 'text', dimension: 'attachmentStyle' },
  ];
}

export async function readFileStore(): Promise<DataStore> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const store = JSON.parse(data);
    // Ensure all collections exist
    return {
      users: store.users || [],
      profiles: store.profiles || [],
      requests: store.requests || [],
      psychologySessions: store.psychologySessions || [],
      jointSessions: store.jointSessions || [],
      assessmentQuestions: store.assessmentQuestions || getDefaultQuestions(),
    };
  } catch (error) {
    return { ...defaultStore };
  }
}

export async function writeFileStore(store: DataStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2));
}
