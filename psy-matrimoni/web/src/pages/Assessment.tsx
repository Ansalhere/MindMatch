import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { psychologyService, type AssessmentQuestion, type PsychologyScore } from '@/services/api';
import { useNotificationStore } from '@/store';
import { Brain, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Loader2, Award, Heart, MessageCircle, Shield, Star } from 'lucide-react';

export default function Assessment() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<PsychologyScore | null>(null);
  const [completed, setCompleted] = useState(false);
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check if already scored
      try {
        const scoreRes = await psychologyService.getScore();
        if (scoreRes.score) {
          setScore(scoreRes.score);
          setCompleted(true);
          setLoading(false);
          return;
        }
      } catch {}

      const data = await psychologyService.getQuestions();
      setQuestions(data.questions || []);
    } catch (error) {
      addNotification('Failed to load assessment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: any) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await psychologyService.submitAssessment(responses);
      setScore(res.score);
      setCompleted(true);
      addNotification('Assessment complete! Your psychology profile is ready 🧠', 'success');
    } catch (error: any) {
      addNotification(error.response?.data?.message || 'Failed to submit assessment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Show completed score
  if (completed && score) {
    const dims = [
      { label: 'Emotional Stability', value: score.dimensions.emotionalStability, color: 'bg-emerald-500', icon: Shield },
      { label: 'Openness', value: score.dimensions.openness, color: 'bg-blue-500', icon: Sparkles },
      { label: 'Agreeableness', value: score.dimensions.agreeableness, color: 'bg-purple-500', icon: Heart },
      { label: 'Conscientiousness', value: score.dimensions.conscientiousness, color: 'bg-amber-500', icon: Star },
      { label: 'Extroversion', value: score.dimensions.extroversion, color: 'bg-rose-500', icon: MessageCircle },
    ];

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="gradient-bg p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/20 flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">Your Psychology Profile</h1>
            <p className="text-white/70">Assessment completed successfully</p>
          </div>

          <div className="p-8">
            {/* Overall Score */}
            <div className="text-center mb-8">
              <div className="w-28 h-28 mx-auto rounded-full gradient-bg flex items-center justify-center mb-3">
                <span className="text-3xl font-display font-bold text-white">{score.overall}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Overall Psychology Score</p>
            </div>

            {/* Dimensions */}
            <div className="space-y-4 mb-8">
              {dims.map((dim) => (
                <div key={dim.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <dim.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{dim.label}</span>
                    </div>
                    <span className="text-muted-foreground font-medium">{dim.value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${dim.color} transition-all duration-1000`} style={{ width: `${dim.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Traits */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Attachment Style</p>
                <p className="font-semibold text-sm capitalize">{score.dimensions.attachmentStyle}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Communication</p>
                <p className="font-semibold text-sm capitalize">{score.dimensions.communicationStyle}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Conflict Resolution</p>
                <p className="font-semibold text-sm capitalize">{score.dimensions.conflictResolution}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Love Language</p>
                <p className="font-semibold text-sm capitalize">{score.dimensions.loveLanguage}</p>
              </div>
            </div>

            {score.psychologistNotes && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Psychologist's Note</span>
                </div>
                <p className="text-sm text-muted-foreground">{score.psychologistNotes}</p>
              </div>
            )}

            <button onClick={() => navigate('/matches')} className="button-primary w-full flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" /> View Your Matches
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Assessment flow
  const q = questions[currentQ];
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;
  const answered = Object.keys(responses).length;
  const allAnswered = answered === questions.length;

  if (!q) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-3">No Assessment Available</h2>
        <p className="text-muted-foreground">Please book a psychology session first from your dashboard.</p>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    emotional_stability: 'from-emerald-500 to-teal-500',
    openness: 'from-blue-500 to-cyan-500',
    communication: 'from-purple-500 to-violet-500',
    values: 'from-amber-500 to-orange-500',
    relationship: 'from-rose-500 to-pink-500',
    lifestyle: 'from-indigo-500 to-blue-500',
    attachment: 'from-pink-500 to-rose-500',
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Question {currentQ + 1} of {questions.length}</span>
          <span className="text-muted-foreground">{answered} answered</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full gradient-bg transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className={`bg-gradient-to-br ${categoryColors[q.category] || 'from-primary to-secondary'} p-6`}>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-white/80" />
            <span className="text-sm text-white/80 font-medium capitalize">{q.category.replace('_', ' ')}</span>
          </div>
          <h2 className="text-xl font-display font-bold text-white">{q.question}</h2>
        </div>

        <div className="p-6 space-y-3">
          {q.type === 'scale' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">Rate from 1 (Strongly Disagree) to 5 (Strongly Agree)</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(q.id, val)}
                    className={`flex-1 py-4 rounded-xl text-lg font-bold transition-all ${
                      responses[q.id] === val
                        ? 'gradient-bg text-white shadow-lg scale-105'
                        : 'glass-card hover:bg-muted/80'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>
          )}

          {q.type === 'choice' && q.options && (
            <div className="space-y-2">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(q.id, option)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    responses[q.id] === option
                      ? 'gradient-bg text-white shadow-lg'
                      : 'glass-card hover:bg-muted/80'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              value={responses[q.id] || ''}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              rows={4}
              placeholder="Type your answer..."
              className="input-styled !h-auto resize-none"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {currentQ > 0 && (
          <button onClick={() => setCurrentQ(currentQ - 1)} className="button-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
        )}
        <div className="flex-1" />
        {currentQ < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ(currentQ + 1)}
            disabled={!responses[q.id]}
            className="button-primary flex items-center gap-2 disabled:opacity-50"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="button-primary flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <><CheckCircle className="w-4 h-4" /> Submit Assessment</>
            )}
          </button>
        )}
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-1.5 justify-center mt-6">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentQ ? 'gradient-bg scale-125' : responses[questions[i].id] ? 'bg-emerald-500' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
