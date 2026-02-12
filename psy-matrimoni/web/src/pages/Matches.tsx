import { useState, useEffect } from 'react';
import { profileService, requestService, psychologyService, type Profile, type CompatibilityReport } from '@/services/api';
import { useNotificationStore } from '@/store';
import { Heart, MapPin, Calendar, Sparkles, UserCircle, Send, Loader2, Brain, GraduationCap, Briefcase, Users, Utensils, Star, CheckCircle, X, ArrowRight } from 'lucide-react';

export default function Matches() {
  const [matches, setMatches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Profile | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityReport | null>(null);
  const [loadingCompat, setLoadingCompat] = useState(false);
  const { addNotification } = useNotificationStore();

  useEffect(() => { loadMatches(); }, []);

  const loadMatches = async () => {
    try {
      const data = await profileService.getMatches();
      setMatches(data.matches || []);
    } catch { addNotification('Failed to load matches', 'error'); }
    finally { setLoading(false); }
  };

  const sendInterest = async (recipientId: string) => {
    setSendingTo(recipientId);
    try {
      await requestService.createRequest(recipientId, 'I would like to connect with you!');
      addNotification('Interest sent! 💝', 'success');
    } catch { addNotification('Failed to send interest', 'error'); }
    finally { setSendingTo(null); }
  };

  const viewCompatibility = async (match: Profile) => {
    setSelectedMatch(match);
    setLoadingCompat(true);
    try {
      const res = await psychologyService.getCompatibility(match.id);
      setCompatibility(res.report);
    } catch {
      setCompatibility(null);
    } finally { setLoadingCompat(false); }
  };

  const requestJointSession = async (partnerId: string) => {
    try {
      await psychologyService.requestJointSession(partnerId);
      addNotification('Joint session requested! Our psychologist will reach out to both of you.', 'success');
    } catch (err: any) {
      addNotification(err.response?.data?.message || 'Failed to request joint session', 'error');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center animate-pulse">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <p className="text-muted-foreground">Finding your matches...</p>
      </div>
    </div>
  );

  // Compatibility Modal
  if (selectedMatch) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button onClick={() => { setSelectedMatch(null); setCompatibility(null); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          ← Back to Matches
        </button>

        {/* Match Profile */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="gradient-bg p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">{selectedMatch.name}</h2>
              <p className="text-white/70 text-sm">{selectedMatch.age} yrs • {selectedMatch.city || selectedMatch.location} • {selectedMatch.religion}</p>
            </div>
            {selectedMatch.matchScore && (
              <div className="ml-auto text-center">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{selectedMatch.matchScore}%</span>
                </div>
                <p className="text-xs text-white/60 mt-1">Match</p>
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {selectedMatch.education && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Education</p><p className="font-medium">{selectedMatch.education}</p></div>}
              {selectedMatch.occupation && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Occupation</p><p className="font-medium">{selectedMatch.occupation}</p></div>}
              {selectedMatch.motherTongue && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Mother Tongue</p><p className="font-medium">{selectedMatch.motherTongue}</p></div>}
              {selectedMatch.height && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Height</p><p className="font-medium">{selectedMatch.height}</p></div>}
              {selectedMatch.familyType && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Family</p><p className="font-medium">{selectedMatch.familyType}</p></div>}
              {selectedMatch.diet && <div className="p-3 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Diet</p><p className="font-medium">{selectedMatch.diet}</p></div>}
            </div>

            {selectedMatch.bio && <p className="text-sm text-foreground/80">{selectedMatch.bio}</p>}

            {selectedMatch.matchReasons && selectedMatch.matchReasons.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Why You Match</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMatch.matchReasons.map((r, i) => <span key={i} className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">{r}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compatibility Report */}
        {loadingCompat ? (
          <div className="glass-card rounded-2xl p-8 mt-4 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Analyzing compatibility...</p>
          </div>
        ) : compatibility ? (
          <div className="glass-card rounded-2xl p-6 mt-4">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg font-bold">Compatibility Report</h3>
              <div className="ml-auto w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                <span className="text-sm font-bold text-white">{compatibility.overallScore}%</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {Object.entries(compatibility.breakdown).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-muted-foreground">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {compatibility.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Strengths</h4>
                <ul className="space-y-1">{compatibility.strengths.map((s, i) => <li key={i} className="text-sm text-foreground/80 flex items-start gap-2"><Star className="w-3 h-3 text-emerald-500 mt-1 flex-shrink-0" />{s}</li>)}</ul>
              </div>
            )}

            {compatibility.challenges.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><X className="w-4 h-4 text-amber-500" /> Challenges</h4>
                <ul className="space-y-1">{compatibility.challenges.map((c, i) => <li key={i} className="text-sm text-foreground/80 flex items-start gap-2"><span className="text-amber-500 mt-1 flex-shrink-0">•</span>{c}</li>)}</ul>
              </div>
            )}

            {compatibility.psychologistRecommendation && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Expert Recommendation:</span> {compatibility.psychologistRecommendation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 mt-4 text-center">
            <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Complete your psychology assessment to see compatibility breakdown.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button onClick={() => sendInterest(selectedMatch.id)} disabled={sendingTo === selectedMatch.id} className="button-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
            {sendingTo === selectedMatch.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Interest</>}
          </button>
          <button onClick={() => requestJointSession(selectedMatch.id)} className="button-secondary flex items-center gap-2">
            <Brain className="w-4 h-4" /> Joint Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Your Matches</h1>
          <p className="text-sm text-muted-foreground">{matches.length} compatible profiles found</p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-rose-500/10 to-purple-500/10 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">No Matches Yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Complete your profile with family, education, and lifestyle details. Take the psychology assessment for deeper matching.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((match) => (
            <div key={match.id} className="glass-card rounded-2xl overflow-hidden card-hover group">
              <div className="h-16 gradient-bg relative">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-0 left-5 translate-y-1/2">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center border-2 border-background shadow-md">
                    <UserCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                {match.matchScore && (
                  <div className="absolute top-2 right-3">
                    <span className="text-xs font-bold bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
                      {match.matchScore}% Match
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 pt-9">
                <h3 className="font-display text-lg font-bold">{match.name}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {match.age} yrs</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {match.city || match.location}</span>
                  {match.religion && <span>{match.religion}</span>}
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {match.education && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 flex items-center gap-1"><GraduationCap className="w-3 h-3" />{match.education}</span>}
                  {match.occupation && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 flex items-center gap-1"><Briefcase className="w-3 h-3" />{match.occupation}</span>}
                  {match.motherTongue && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">{match.motherTongue}</span>}
                </div>

                {match.matchReasons && match.matchReasons.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.matchReasons.slice(0, 2).map((r, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">✓ {r}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button onClick={() => viewCompatibility(match)} className="button-secondary flex-1 flex items-center justify-center gap-1.5 !py-2 text-xs">
                    <Brain className="w-3.5 h-3.5" /> View Details
                  </button>
                  <button onClick={() => sendInterest(match.id)} disabled={sendingTo === match.id} className="button-primary flex-1 flex items-center justify-center gap-1.5 !py-2 text-xs disabled:opacity-50">
                    {sendingTo === match.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Interest</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
