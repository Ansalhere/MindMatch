import { useState, useEffect } from 'react';
import { profileService, type Profile } from '@/services/api';
import { useNotificationStore, useAuthStore } from '@/store';
import { UserCircle, Edit3, MapPin, Calendar, Heart, Save, X, Sparkles, Plus, Briefcase, GraduationCap, Users, Utensils, Brain, CheckCircle, Loader2 } from 'lucide-react';

const RELIGIONS = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Buddhist', 'Parsi', 'Jewish', 'Other'];
const MOTHER_TONGUES = ['Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Assamese', 'English', 'Other'];
const FAMILY_TYPES = ['Joint', 'Nuclear', 'Extended'];
const FAMILY_STATUS = ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'];
const FAMILY_VALUES = ['Traditional', 'Moderate', 'Liberal'];
const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'];
const EDUCATIONS = ["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Professional Degree", "Other"];
const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [interestInput, setInterestInput] = useState('');
  const { addNotification } = useNotificationStore();
  const { user, setAuth } = useAuthStore();

  const [form, setForm] = useState<Partial<Profile>>({
    name: '', age: 18, gender: '' as any, dateOfBirth: '', height: '', weight: '', bodyType: '', complexion: '',
    phone: '', location: '', city: '', state: '', country: 'India',
    religion: '', caste: '', subCaste: '', gothra: '', motherTongue: '', manglik: '', rashi: '', nakshatra: '',
    familyType: '', familyStatus: '', familyValues: '', fatherOccupation: '', motherOccupation: '', siblings: '',
    education: '', educationDetail: '', occupation: '', company: '', annualIncome: '', workingWith: '',
    diet: '', smoking: 'No', drinking: 'No', bio: '', interests: [], hobbies: [],
  });

  const u = (field: string, value: any) => setForm({ ...form, [field]: value });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      if (data.profile) {
        setProfile(data.profile);
        setForm({ ...form, ...data.profile });
      }
    } catch {} finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileService.updateProfile(form);
      addNotification('Profile updated! ✨', 'success');
      setEditing(false);
      setProfile(res.profile);
      if (res.profile.profileComplete && user) {
        setAuth({ ...user, profileComplete: true }, localStorage.getItem('mindmatch-auth') ? JSON.parse(localStorage.getItem('mindmatch-auth')!).state.token : '');
      }
    } catch {
      addNotification('Failed to update profile', 'error');
    } finally { setSaving(false); }
  };

  const addInterest = () => {
    if (interestInput.trim() && !(form.interests || []).includes(interestInput.trim())) {
      u('interests', [...(form.interests || []), interestInput.trim()]);
      setInterestInput('');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
  );

  // No profile yet
  if (!profile && !editing) {
    return (
      <div className="animate-fade-in flex items-center justify-center py-20">
        <div className="glass-card rounded-3xl p-10 text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-3xl gradient-bg flex items-center justify-center mb-6">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Create Your Profile</h1>
          <p className="text-muted-foreground mb-6">
            Build your complete matrimonial profile with personal, family, education & lifestyle details to find your perfect match.
          </p>
          <button onClick={() => setEditing(true)} className="button-primary inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Get Started
          </button>
        </div>
      </div>
    );
  }

  // Edit form
  if (editing) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{profile ? 'Edit' : 'Create'} Profile</h1>
            <p className="text-sm text-muted-foreground">Fill in your matrimonial details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg gradient-text flex items-center gap-2"><UserCircle className="w-5 h-5" /> Personal Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Full Name *</label><input type="text" value={form.name} onChange={(e) => u('name', e.target.value)} required className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Gender *</label>
                <select value={form.gender} onChange={(e) => u('gender', e.target.value)} required className="input-styled"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Date of Birth</label><input type="date" value={form.dateOfBirth} onChange={(e) => u('dateOfBirth', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Age *</label><input type="number" min="18" max="100" value={form.age} onChange={(e) => u('age', parseInt(e.target.value))} required className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Height</label><input type="text" placeholder="5'8&quot;" value={form.height} onChange={(e) => u('height', e.target.value)} className="input-styled" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Phone</label><input type="tel" value={form.phone} onChange={(e) => u('phone', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Complexion</label>
                <select value={form.complexion} onChange={(e) => u('complexion', e.target.value)} className="input-styled"><option value="">Select</option><option>Fair</option><option>Wheatish</option><option>Dark</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Body Type</label>
                <select value={form.bodyType} onChange={(e) => u('bodyType', e.target.value)} className="input-styled"><option value="">Select</option><option>Slim</option><option>Average</option><option>Athletic</option><option>Heavy</option></select></div>
            </div>
          </div>

          {/* Religion & Community */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg gradient-text flex items-center gap-2"><Heart className="w-5 h-5" /> Religion & Community</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Religion *</label>
                <select value={form.religion} onChange={(e) => u('religion', e.target.value)} required className="input-styled"><option value="">Select</option>{RELIGIONS.map(r=><option key={r}>{r}</option>)}</select></div>
              <div><label className="text-sm font-medium mb-1 block">Mother Tongue *</label>
                <select value={form.motherTongue} onChange={(e) => u('motherTongue', e.target.value)} required className="input-styled"><option value="">Select</option>{MOTHER_TONGUES.map(l=><option key={l}>{l}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Caste</label><input type="text" value={form.caste} onChange={(e) => u('caste', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Sub-Caste</label><input type="text" value={form.subCaste} onChange={(e) => u('subCaste', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Gothra</label><input type="text" value={form.gothra} onChange={(e) => u('gothra', e.target.value)} className="input-styled" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Manglik</label>
                <select value={form.manglik} onChange={(e) => u('manglik', e.target.value)} className="input-styled"><option value="">Select</option><option>Yes</option><option>No</option><option>Doesn't Matter</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Rashi</label><input type="text" value={form.rashi} onChange={(e) => u('rashi', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Nakshatra</label><input type="text" value={form.nakshatra} onChange={(e) => u('nakshatra', e.target.value)} className="input-styled" /></div>
            </div>
          </div>

          {/* Family */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg gradient-text flex items-center gap-2"><Users className="w-5 h-5" /> Family Details</h2>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Family Type</label>
                <select value={form.familyType} onChange={(e) => u('familyType', e.target.value)} className="input-styled"><option value="">Select</option>{FAMILY_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="text-sm font-medium mb-1 block">Family Status</label>
                <select value={form.familyStatus} onChange={(e) => u('familyStatus', e.target.value)} className="input-styled"><option value="">Select</option>{FAMILY_STATUS.map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label className="text-sm font-medium mb-1 block">Family Values</label>
                <select value={form.familyValues} onChange={(e) => u('familyValues', e.target.value)} className="input-styled"><option value="">Select</option>{FAMILY_VALUES.map(v=><option key={v}>{v}</option>)}</select></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Father's Occupation</label><input type="text" value={form.fatherOccupation} onChange={(e) => u('fatherOccupation', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Mother's Occupation</label><input type="text" value={form.motherOccupation} onChange={(e) => u('motherOccupation', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Siblings</label><input type="text" placeholder="e.g. 1 Brother" value={form.siblings} onChange={(e) => u('siblings', e.target.value)} className="input-styled" /></div>
            </div>
          </div>

          {/* Education & Career */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg gradient-text flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Education & Career</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Education</label>
                <select value={form.education} onChange={(e) => u('education', e.target.value)} className="input-styled"><option value="">Select</option>{EDUCATIONS.map(e=><option key={e}>{e}</option>)}</select></div>
              <div><label className="text-sm font-medium mb-1 block">Education Detail</label><input type="text" placeholder="e.g. B.Tech IIT" value={form.educationDetail} onChange={(e) => u('educationDetail', e.target.value)} className="input-styled" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Occupation</label><input type="text" value={form.occupation} onChange={(e) => u('occupation', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">Company</label><input type="text" value={form.company} onChange={(e) => u('company', e.target.value)} className="input-styled" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Annual Income</label>
                <select value={form.annualIncome} onChange={(e) => u('annualIncome', e.target.value)} className="input-styled"><option value="">Select</option>
                  <option>Below 3 Lakh</option><option>3-5 Lakh</option><option>5-10 Lakh</option><option>10-20 Lakh</option><option>20-50 Lakh</option><option>50 Lakh - 1 Crore</option><option>Above 1 Crore</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Working With</label>
                <select value={form.workingWith} onChange={(e) => u('workingWith', e.target.value)} className="input-styled"><option value="">Select</option><option>Private</option><option>Government</option><option>Business</option><option>Self-Employed</option><option>Not Working</option></select></div>
            </div>
          </div>

          {/* Location & Lifestyle */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg gradient-text flex items-center gap-2"><Utensils className="w-5 h-5" /> Location & Lifestyle</h2>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-sm font-medium mb-1 block">City</label><input type="text" value={form.city} onChange={(e) => u('city', e.target.value)} className="input-styled" /></div>
              <div><label className="text-sm font-medium mb-1 block">State</label>
                <select value={form.state} onChange={(e) => u('state', e.target.value)} className="input-styled"><option value="">Select</option>{STATES.map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label className="text-sm font-medium mb-1 block">Country</label><input type="text" value={form.country || 'India'} onChange={(e) => u('country', e.target.value)} className="input-styled" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-sm font-medium mb-1 block">Diet</label>
                <select value={form.diet} onChange={(e) => u('diet', e.target.value)} className="input-styled"><option value="">Select</option>{DIETS.map(d=><option key={d}>{d}</option>)}</select></div>
              <div><label className="text-sm font-medium mb-1 block">Smoking</label>
                <select value={form.smoking} onChange={(e) => u('smoking', e.target.value)} className="input-styled"><option>No</option><option>Occasionally</option><option>Yes</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Drinking</label>
                <select value={form.drinking} onChange={(e) => u('drinking', e.target.value)} className="input-styled"><option>No</option><option>Occasionally</option><option>Yes</option></select></div>
            </div>
          </div>

          {/* About & Interests */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg gradient-text flex items-center gap-2"><Sparkles className="w-5 h-5" /> About & Interests</h2>
            <div><label className="text-sm font-medium mb-1 block">About Yourself</label>
              <textarea value={form.bio} onChange={(e) => u('bio', e.target.value)} rows={4} placeholder="Tell about yourself, your values, and what you're looking for..." className="input-styled !h-auto resize-none" /></div>
            <div>
              <label className="text-sm font-medium mb-1 block">Interests</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())} placeholder="Add interest..." className="input-styled flex-1" />
                <button type="button" onClick={addInterest} className="button-secondary !px-4"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.interests || []).map((i) => (
                  <span key={i} className="badge-primary flex items-center gap-1.5 cursor-pointer" onClick={() => u('interests', (form.interests || []).filter((x) => x !== i))}>{i}<X className="w-3 h-3" /></span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="button-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
            </button>
            {profile && <button type="button" onClick={() => { setEditing(false); setForm({ ...form, ...profile }); }} className="button-secondary flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>}
          </div>
        </form>
      </div>
    );
  }

  // Profile View
  const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <div className="glass-card rounded-2xl p-6 mt-4">
      <h2 className="font-display font-semibold text-lg mb-4 gradient-text flex items-center gap-2"><Icon className="w-5 h-5" /> {title}</h2>
      {children}
    </div>
  );

  const Field = ({ label, value }: { label: string; value?: string | number }) => (
    value ? <div><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium text-sm">{value}</p></div> : null
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header Card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="h-32 gradient-bg relative"><div className="absolute inset-0 bg-black/10" /></div>
        <div className="px-8 pb-8 -mt-12 relative">
          <div className="w-24 h-24 rounded-3xl gradient-bg flex items-center justify-center border-4 border-background shadow-lg mb-4">
            <UserCircle className="w-12 h-12 text-white" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">{profile?.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {profile?.age} years</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile?.city || profile?.state || profile?.location || 'India'}</span>
                {profile?.religion && <span className="badge-primary">{profile.religion}</span>}
                {profile?.psychologyScore && <span className="badge-primary flex items-center gap-1"><Brain className="w-3 h-3" /> {profile.psychologyScore.overall}% Psych</span>}
              </div>
            </div>
            <button onClick={() => setEditing(true)} className="button-secondary flex items-center gap-2"><Edit3 className="w-4 h-4" /> Edit</button>
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <div className="glass-card rounded-2xl p-6 mt-4">
          <h2 className="font-display font-semibold text-lg mb-2 gradient-text">About</h2>
          <p className="text-foreground/80 leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Personal */}
      <Section icon={UserCircle} title="Personal Details">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Gender" value={profile?.gender === 'male' ? 'Male' : 'Female'} />
          <Field label="Date of Birth" value={profile?.dateOfBirth} />
          <Field label="Height" value={profile?.height} />
          <Field label="Complexion" value={profile?.complexion} />
          <Field label="Body Type" value={profile?.bodyType} />
          <Field label="Phone" value={profile?.phone} />
        </div>
      </Section>

      {/* Religion */}
      <Section icon={Heart} title="Religion & Community">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Religion" value={profile?.religion} />
          <Field label="Mother Tongue" value={profile?.motherTongue} />
          <Field label="Caste" value={profile?.caste} />
          <Field label="Sub-Caste" value={profile?.subCaste} />
          <Field label="Gothra" value={profile?.gothra} />
          <Field label="Manglik" value={profile?.manglik} />
          <Field label="Rashi" value={profile?.rashi} />
          <Field label="Nakshatra" value={profile?.nakshatra} />
        </div>
      </Section>

      {/* Family */}
      <Section icon={Users} title="Family Details">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Family Type" value={profile?.familyType} />
          <Field label="Family Status" value={profile?.familyStatus} />
          <Field label="Family Values" value={profile?.familyValues} />
          <Field label="Father's Occupation" value={profile?.fatherOccupation} />
          <Field label="Mother's Occupation" value={profile?.motherOccupation} />
          <Field label="Siblings" value={profile?.siblings} />
        </div>
      </Section>

      {/* Education */}
      <Section icon={GraduationCap} title="Education & Career">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Education" value={profile?.education} />
          <Field label="Detail" value={profile?.educationDetail} />
          <Field label="Occupation" value={profile?.occupation} />
          <Field label="Company" value={profile?.company} />
          <Field label="Annual Income" value={profile?.annualIncome} />
          <Field label="Working With" value={profile?.workingWith} />
        </div>
      </Section>

      {/* Lifestyle */}
      <Section icon={Utensils} title="Lifestyle">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="City" value={profile?.city} />
          <Field label="State" value={profile?.state} />
          <Field label="Country" value={profile?.country} />
          <Field label="Diet" value={profile?.diet} />
          <Field label="Smoking" value={profile?.smoking} />
          <Field label="Drinking" value={profile?.drinking} />
        </div>
      </Section>

      {/* Interests */}
      {profile?.interests && profile.interests.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mt-4">
          <h2 className="font-display font-semibold text-lg mb-3 gradient-text">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => <span key={i} className="badge-primary flex items-center gap-1.5"><Heart className="w-3 h-3" /> {i}</span>)}
          </div>
        </div>
      )}

      {/* Psychology Score */}
      {profile?.psychologyScore && (
        <Section icon={Brain} title="Psychology Profile">
          <div className="text-center mb-4">
            <div className="w-20 h-20 mx-auto rounded-full gradient-bg flex items-center justify-center mb-2">
              <span className="text-2xl font-display font-bold text-white">{profile.psychologyScore.overall}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Overall Score</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Emotional Stability', value: profile.psychologyScore.dimensions.emotionalStability, color: 'bg-emerald-500' },
              { label: 'Openness', value: profile.psychologyScore.dimensions.openness, color: 'bg-blue-500' },
              { label: 'Agreeableness', value: profile.psychologyScore.dimensions.agreeableness, color: 'bg-purple-500' },
              { label: 'Conscientiousness', value: profile.psychologyScore.dimensions.conscientiousness, color: 'bg-amber-500' },
              { label: 'Extroversion', value: profile.psychologyScore.dimensions.extroversion, color: 'bg-rose-500' },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium">{d.label}</span><span className="text-muted-foreground">{d.value}%</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.value}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Attachment</p><p className="font-medium text-sm capitalize">{profile.psychologyScore.dimensions.attachmentStyle}</p></div>
            <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Communication</p><p className="font-medium text-sm capitalize">{profile.psychologyScore.dimensions.communicationStyle}</p></div>
            <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Conflict Resolution</p><p className="font-medium text-sm capitalize">{profile.psychologyScore.dimensions.conflictResolution}</p></div>
            <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Love Language</p><p className="font-medium text-sm capitalize">{profile.psychologyScore.dimensions.loveLanguage}</p></div>
          </div>
        </Section>
      )}
    </div>
  );
}
