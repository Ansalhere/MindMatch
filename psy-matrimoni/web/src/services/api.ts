import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('mindmatch-auth');
  if (auth) {
    const { state } = JSON.parse(auth);
    if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
  }
  return config;
});

// ── Types ───────────────────────────────────────────────────────

export interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  dateOfBirth: string;
  height: string;
  weight?: string;
  bodyType?: string;
  complexion?: string;
  phone: string;
  location: string;
  city: string;
  state: string;
  country: string;
  religion: string;
  caste?: string;
  subCaste?: string;
  gothra?: string;
  motherTongue: string;
  manglik?: string;
  rashi?: string;
  nakshatra?: string;
  familyType: string;
  familyStatus: string;
  familyValues: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  siblings?: string;
  education: string;
  educationDetail?: string;
  occupation: string;
  company?: string;
  annualIncome?: string;
  workingWith?: string;
  diet: string;
  smoking: string;
  drinking: string;
  bio: string;
  interests: string[];
  hobbies: string[];
  partnerPreferences: PartnerPreferences;
  psychologyStatus: string;
  psychologyScore?: PsychologyScore;
  photos: string[];
  profileComplete: boolean;
  matchScore?: number;
  matchReasons?: string[];
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

export interface PsychologyScore {
  overall: number;
  dimensions: {
    emotionalStability: number;
    openness: number;
    agreeableness: number;
    conscientiousness: number;
    extroversion: number;
    attachmentStyle: string;
    communicationStyle: string;
    conflictResolution: string;
    loveLanguage: string;
    values: string[];
  };
  psychologistNotes?: string;
  assessedBy?: string;
  assessedAt?: string;
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  type: 'scale' | 'choice' | 'multi_choice' | 'text';
  options?: string[];
  dimension: string;
}

export interface PsychologySession {
  id: string;
  userId: string;
  type: 'individual' | 'joint';
  status: string;
  scheduledAt: string;
  psychologistName: string;
  score?: PsychologyScore;
  completedAt?: string;
}

export interface CompatibilityReport {
  overallScore: number;
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
}

export interface Request {
  id: string;
  senderId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  senderProfile?: Profile;
  recipientProfile?: Profile;
}

// ── Services ────────────────────────────────────────────────────

export const authService = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profiles/me');
    return response.data;
  },
  getProfileById: async (id: string) => {
    const response = await api.get(`/profiles/by-id/${id}`);
    return response.data;
  },
  updateProfile: async (data: Partial<Profile>) => {
    const response = await api.put('/profiles/me', data);
    return response.data;
  },
  getMatches: async () => {
    const response = await api.get('/profiles/matches');
    return response.data;
  },
};

export const psychologyService = {
  getQuestions: async () => {
    const response = await api.get('/psychology/questions');
    return response.data;
  },
  bookSession: async (data?: { scheduledAt?: string; psychologistName?: string }) => {
    const response = await api.post('/psychology/sessions/book', data || {});
    return response.data;
  },
  getSessions: async () => {
    const response = await api.get('/psychology/sessions');
    return response.data;
  },
  submitAssessment: async (responses: Record<string, any>) => {
    const response = await api.post('/psychology/assessment', { responses });
    return response.data;
  },
  getScore: async () => {
    const response = await api.get('/psychology/score');
    return response.data;
  },
  getCompatibility: async (profileId: string) => {
    const response = await api.get(`/psychology/compatibility/${profileId}`);
    return response.data;
  },
  requestJointSession: async (partnerId: string) => {
    const response = await api.post('/psychology/joint-session', { partnerId });
    return response.data;
  },
  getJointSessions: async () => {
    const response = await api.get('/psychology/joint-sessions');
    return response.data;
  },
};

export const requestService = {
  createRequest: async (recipientId: string, message?: string) => {
    const response = await api.post('/requests', { recipientId, message });
    return response.data;
  },
  listRequests: async () => {
    const response = await api.get<{ success: boolean; requests: Request[] }>('/requests');
    return response.data;
  },
  respondRequest: async (id: string, action: 'accept' | 'reject') => {
    const response = await api.patch(`/requests/${id}`, { status: action === 'accept' ? 'accepted' : 'rejected' });
    return response.data;
  },
  cancelRequest: async (id: string) => {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  },
};

export default api;
