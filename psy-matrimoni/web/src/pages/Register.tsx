import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/api';
import { useAuthStore, useNotificationStore } from '@/store';
import { Heart, Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff, Sparkles, Phone, MapPin, BookOpen, Briefcase, Users, CheckCircle } from 'lucide-react';

const RELIGIONS = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];
const MOTHER_TONGUES = ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Assamese', 'English', 'Other'];
const FAMILY_TYPES = ['Joint', 'Nuclear', 'Extended'];
const FAMILY_STATUS = ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'];
const FAMILY_VALUES = ['Traditional', 'Moderate', 'Liberal'];
const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'];
const EDUCATIONS = ['High School', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD', 'Professional Degree', 'Other'];
const MANGLIK_OPTIONS = ['Yes', 'No', 'Doesn\'t Matter'];
const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

const STEPS = [
  { label: 'Account', icon: Mail },
  { label: 'Personal', icon: User },
  { label: 'Family', icon: Users },
  { label: 'Education', icon: BookOpen },
  { label: 'Lifestyle', icon: Briefcase },
];

export default function Register() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    gender: '', dateOfBirth: '', height: '', religion: '', caste: '', motherTongue: '', manglik: '',
    familyType: '', familyStatus: '', familyValues: '', fatherOccupation: '', motherOccupation: '', siblings: '',
    education: '', educationDetail: '', occupation: '', company: '', annualIncome: '',
    diet: '', smoking: 'No', drinking: 'No', bio: '', city: '', state: '', country: 'India',
  });

  const u = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await authService.register({ email: form.email, password: form.password, name: form.name });
      setAuth(res.user, res.token);
      addNotification('Welcome to MindMatch! 🎉 Complete your profile next.', 'success');
      navigate('/profile');
    } catch (error: any) {
      addNotification(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step === STEPS.length - 1) {
      handleRegister();
    } else {
      setStep(step + 1);
    }
  };

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.password.length >= 6;
    if (step === 1) return form.gender && form.dateOfBirth && form.religion && form.motherTongue;
    return true;
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold gradient-text">MindMatch</span>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'gradient-bg text-white shadow-lg' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < step ? 'bg-emerald-500' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8">
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl font-bold mb-1">{STEPS[step].label} Details</h1>
            <p className="text-sm text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
          </div>

          {/* Step 0: Account */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="e.g. Rahul Sharma" value={form.name} onChange={(e) => u('name', e.target.value)} required className="input-styled !pl-10" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => u('email', e.target.value)} required className="input-styled !pl-10" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={(e) => u('password', e.target.value)} required minLength={6} className="input-styled !pl-10 !pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => u('phone', e.target.value)} className="input-styled !pl-10" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Gender *</label>
                  <select value={form.gender} onChange={(e) => u('gender', e.target.value)} required className="input-styled">
                    <option value="">Select</option>
                    <option value="male">Male (Groom)</option>
                    <option value="female">Female (Bride)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Date of Birth *</label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => u('dateOfBirth', e.target.value)} required className="input-styled" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Height</label>
                  <input type="text" placeholder="e.g. 5'8&quot;" value={form.height} onChange={(e) => u('height', e.target.value)} className="input-styled" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Manglik</label>
                  <select value={form.manglik} onChange={(e) => u('manglik', e.target.value)} className="input-styled">
                    <option value="">Select</option>
                    {MANGLIK_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Religion *</label>
                <select value={form.religion} onChange={(e) => u('religion', e.target.value)} required className="input-styled">
                  <option value="">Select Religion</option>
                  {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Caste</label>
                  <input type="text" placeholder="e.g. Brahmin" value={form.caste} onChange={(e) => u('caste', e.target.value)} className="input-styled" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Mother Tongue *</label>
                  <select value={form.motherTongue} onChange={(e) => u('motherTongue', e.target.value)} required className="input-styled">
                    <option value="">Select</option>
                    {MOTHER_TONGUES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Family */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Family Type</label>
                  <select value={form.familyType} onChange={(e) => u('familyType', e.target.value)} className="input-styled">
                    <option value="">Select</option>
                    {FAMILY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Family Status</label>
                  <select value={form.familyStatus} onChange={(e) => u('familyStatus', e.target.value)} className="input-styled">
                    <option value="">Select</option>
                    {FAMILY_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Family Values</label>
                <select value={form.familyValues} onChange={(e) => u('familyValues', e.target.value)} className="input-styled">
                  <option value="">Select</option>
                  {FAMILY_VALUES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Father's Occupation</label>
                  <input type="text" placeholder="e.g. Business" value={form.fatherOccupation} onChange={(e) => u('fatherOccupation', e.target.value)} className="input-styled" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Mother's Occupation</label>
                  <input type="text" placeholder="e.g. Homemaker" value={form.motherOccupation} onChange={(e) => u('motherOccupation', e.target.value)} className="input-styled" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Siblings</label>
                <input type="text" placeholder="e.g. 1 Brother, 1 Sister" value={form.siblings} onChange={(e) => u('siblings', e.target.value)} className="input-styled" />
              </div>
            </div>
          )}

          {/* Step 3: Education & Career */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Highest Education</label>
                <select value={form.education} onChange={(e) => u('education', e.target.value)} className="input-styled">
                  <option value="">Select</option>
                  {EDUCATIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Education Detail</label>
                <input type="text" placeholder="e.g. B.Tech from IIT Delhi" value={form.educationDetail} onChange={(e) => u('educationDetail', e.target.value)} className="input-styled" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Occupation</label>
                  <input type="text" placeholder="e.g. Software Engineer" value={form.occupation} onChange={(e) => u('occupation', e.target.value)} className="input-styled" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Company</label>
                  <input type="text" placeholder="e.g. TCS" value={form.company} onChange={(e) => u('company', e.target.value)} className="input-styled" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Annual Income</label>
                <select value={form.annualIncome} onChange={(e) => u('annualIncome', e.target.value)} className="input-styled">
                  <option value="">Select</option>
                  <option value="Below 3 Lakh">Below 3 Lakh</option>
                  <option value="3-5 Lakh">3-5 Lakh</option>
                  <option value="5-10 Lakh">5-10 Lakh</option>
                  <option value="10-20 Lakh">10-20 Lakh</option>
                  <option value="20-50 Lakh">20-50 Lakh</option>
                  <option value="50 Lakh - 1 Crore">50 Lakh - 1 Crore</option>
                  <option value="Above 1 Crore">Above 1 Crore</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Lifestyle */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">City</label>
                  <input type="text" placeholder="e.g. Mumbai" value={form.city} onChange={(e) => u('city', e.target.value)} className="input-styled" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">State</label>
                  <select value={form.state} onChange={(e) => u('state', e.target.value)} className="input-styled">
                    <option value="">Select</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Diet</label>
                <select value={form.diet} onChange={(e) => u('diet', e.target.value)} className="input-styled">
                  <option value="">Select</option>
                  {DIETS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Smoking</label>
                  <select value={form.smoking} onChange={(e) => u('smoking', e.target.value)} className="input-styled">
                    <option value="No">No</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Drinking</label>
                  <select value={form.drinking} onChange={(e) => u('drinking', e.target.value)} className="input-styled">
                    <option value="No">No</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">About Yourself</label>
                <textarea value={form.bio} onChange={(e) => u('bio', e.target.value)} rows={3} placeholder="Tell us about yourself, your values, and what you're looking for..." className="input-styled !h-auto resize-none" />
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Next: Psychology Session</span>
                </div>
                <p className="text-xs text-muted-foreground">After registration, you'll be able to book a session with our certified psychologist for personality assessment and better matching.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="button-secondary flex items-center gap-2 !px-5">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            <button
              onClick={next}
              disabled={!canNext() || loading}
              className="button-primary flex-1 flex items-center justify-center gap-2 !py-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : step === STEPS.length - 1 ? (
                <>Create Account <Sparkles className="w-4 h-4" /></>
              ) : (
                <>Next <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold gradient-text hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
