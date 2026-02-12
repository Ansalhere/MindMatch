import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useNotificationStore } from '@/store';
import { psychologyService, profileService, type PsychologyScore, type PsychologySession, type Profile } from '@/services/api';
import { Heart, UserCircle, Users, MessageCircle, Sparkles, ArrowRight, CheckCircle, AlertCircle, Brain, Target, Calendar, Award, Clock, Star, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [psyScore, setPsyScore] = useState<PsychologyScore | null>(null);
  const [sessions, setSessions] = useState<PsychologySession[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSession, setBookingSession] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [scoreRes, sessionsRes, matchesRes] = await Promise.allSettled([
        psychologyService.getScore(),
        psychologyService.getSessions(),
        profileService.getMatches(),
      ]);
      if (scoreRes.status === 'fulfilled' && scoreRes.value.score) setPsyScore(scoreRes.value.score);
      if (sessionsRes.status === 'fulfilled') setSessions(sessionsRes.value.sessions || []);
      if (matchesRes.status === 'fulfilled') setMatches(matchesRes.value.matches || []);
    } catch {}
    setLoading(false);
  };

  const bookSession = async () => {
    setBookingSession(true);
    try {
      await psychologyService.bookSession();
      addNotification('Psychology session booked! 🧠', 'success');
      loadDashboard();
    } catch (error: any) {
      addNotification(error.response?.data?.message || 'Failed to book session', 'error');
    } finally {
      setBookingSession(false);
    }
  };

  const stats = [
    { icon: Heart, label: 'Matches', value: matches.length.toString(), color: 'from-rose-500 to-pink-500' },
    { icon: Brain, label: 'Psych Score', value: psyScore ? `${psyScore.overall}%` : '—', color: 'from-purple-500 to-violet-500' },
    { icon: Users, label: 'Sessions', value: sessions.length.toString(), color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: 'Profile', value: user?.profileComplete ? 'Complete' : 'Pending', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-bg p-8 md:p-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-medium">Welcome back</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Namaste, {user?.name || 'there'}! 🙏
          </h1>
          <p className="text-white/70 text-lg">Your journey to finding the perfect life partner continues here.</p>
        </div>
      </div>

      {/* Alerts */}
      {!user?.profileComplete && (
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-amber-500 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Complete Your Profile</h3>
            <p className="text-sm text-muted-foreground mb-3">Add your personal, family, and lifestyle details to start receiving compatible matches.</p>
            <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Complete now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {!psyScore && user?.profileComplete && (
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-purple-500 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Take Psychology Assessment</h3>
            <p className="text-sm text-muted-foreground mb-3">Complete our 20-question psychology assessment to unlock deeper compatibility matching.</p>
            <Link to="/assessment" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Start Assessment <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {psyScore && user?.profileComplete && (
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-emerald-500 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Profile & Psychology Complete!</h3>
            <p className="text-sm text-muted-foreground">Your matches are now powered by psychological compatibility.</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 card-hover text-center">
            <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions + Psychology */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/profile" className="glass-card rounded-2xl p-6 card-hover group block">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UserCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold mb-1">My Profile</h3>
          <p className="text-sm text-muted-foreground mb-3">View and edit your matrimonial profile</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium gradient-text">
            View <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link to="/assessment" className="glass-card rounded-2xl p-6 card-hover group block">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold mb-1">Psychology Assessment</h3>
          <p className="text-sm text-muted-foreground mb-3">{psyScore ? 'View your psychology score' : 'Take the 20-question assessment'}</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium gradient-text">
            {psyScore ? 'View Score' : 'Start'} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link to="/matches" className="glass-card rounded-2xl p-6 card-hover group block">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold mb-1">Browse Matches</h3>
          <p className="text-sm text-muted-foreground mb-3">Discover your most compatible profiles</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium gradient-text">
            View <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Psychology Session Booking */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-xl font-bold mb-2">Book a Psychology Session</h2>
            <p className="text-muted-foreground text-sm mb-1">
              Meet with our certified psychologist for a one-on-one session. They'll assess your personality,
              emotional patterns, and relationship expectations for better matching.
            </p>
            <p className="text-xs text-muted-foreground">₹499 per individual session • ₹999 for joint session</p>
          </div>
          <button
            onClick={bookSession}
            disabled={bookingSession}
            className="button-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {bookingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
            Book Session
          </button>
        </div>

        {/* Sessions list */}
        {sessions.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Sessions</h3>
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    session.status === 'completed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                  }`}>
                    {session.status === 'completed' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{session.type} Session</p>
                    <p className="text-xs text-muted-foreground">with {session.psychologistName}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  session.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                  session.status === 'scheduled' ? 'bg-amber-500/10 text-amber-600' :
                  'bg-blue-500/10 text-blue-600'
                }`}>
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Matches Preview */}
      {matches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Top Matches</h2>
            <Link to="/matches" className="text-sm font-medium gradient-text hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {matches.slice(0, 3).map((match) => (
              <div key={match.id} className="glass-card rounded-2xl p-5 card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{match.name}</h3>
                    <p className="text-xs text-muted-foreground">{match.age} yrs • {match.city || match.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {match.religion && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{match.religion}</span>}
                  {match.education && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">{match.education}</span>}
                  {match.matchScore && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">{match.matchScore}% match</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
