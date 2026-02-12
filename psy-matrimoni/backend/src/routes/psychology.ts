import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';
import { readFileStore, writeFileStore, PsychologyScore } from '../utils/fileStore.js';

const router = Router();

// Get assessment questions
router.get('/questions', authMiddleware, async (_req, res) => {
  try {
    const store = await readFileStore();
    res.json({ questions: store.assessmentQuestions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Failed to get questions' });
  }
});

// Book a psychology session
router.post('/sessions/book', authMiddleware, async (req, res) => {
  try {
    const { scheduledAt, psychologistName } = req.body;
    const store = await readFileStore();

    // Check if user already has a pending session
    const existing = store.psychologySessions.find(
      (s) => s.userId === req.userId && ['booked', 'in_progress'].includes(s.status)
    );
    if (existing) {
      return res.status(400).json({ message: 'You already have an active session' });
    }

    const session = {
      id: uuidv4(),
      userId: req.userId!,
      type: 'individual' as const,
      status: 'booked' as const,
      scheduledAt: scheduledAt || new Date(Date.now() + 86400000).toISOString(),
      psychologistName: psychologistName || 'Dr. Priya Sharma',
      psychologistId: 'psy-default',
      createdAt: new Date().toISOString(),
    };

    store.psychologySessions.push(session);

    // Update profile psychology status
    const profile = store.profiles.find((p) => p.userId === req.userId);
    if (profile) {
      profile.psychologyStatus = 'session_booked';
    }

    await writeFileStore(store);
    res.status(201).json({ session });
  } catch (error) {
    console.error('Book session error:', error);
    res.status(500).json({ message: 'Failed to book session' });
  }
});

// Get user's psychology sessions
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();
    const sessions = store.psychologySessions.filter((s) => s.userId === req.userId);
    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Failed to get sessions' });
  }
});

// Submit assessment responses (self-assessment questionnaire)
router.post('/assessment', authMiddleware, async (req, res) => {
  try {
    const { responses } = req.body;
    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({ message: 'Assessment responses required' });
    }

    const store = await readFileStore();

    // Find active session or create one
    let session = store.psychologySessions.find(
      (s) => s.userId === req.userId && ['booked', 'in_progress'].includes(s.status)
    );

    if (!session) {
      session = {
        id: uuidv4(),
        userId: req.userId!,
        type: 'individual',
        status: 'in_progress',
        scheduledAt: new Date().toISOString(),
        psychologistName: 'Dr. Priya Sharma',
        psychologistId: 'psy-default',
        assessmentResponses: responses,
        createdAt: new Date().toISOString(),
      };
      store.psychologySessions.push(session);
    } else {
      session.assessmentResponses = responses;
      session.status = 'in_progress';
    }

    // Auto-score based on responses
    const score = calculatePsychologyScore(responses, store.assessmentQuestions);
    session.score = score;
    session.status = 'completed';
    session.completedAt = new Date().toISOString();

    // Update profile
    const profile = store.profiles.find((p) => p.userId === req.userId);
    if (profile) {
      profile.psychologyStatus = 'scored';
      profile.psychologyScore = score;
      profile.updatedAt = new Date().toISOString();
    }

    await writeFileStore(store);
    res.json({ session, score });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ message: 'Failed to submit assessment' });
  }
});

// Get psychology score for a user
router.get('/score', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();
    const profile = store.profiles.find((p) => p.userId === req.userId);

    if (!profile?.psychologyScore) {
      return res.json({ score: null, status: profile?.psychologyStatus || 'not_started' });
    }

    res.json({ score: profile.psychologyScore, status: profile.psychologyStatus });
  } catch (error) {
    console.error('Get score error:', error);
    res.status(500).json({ message: 'Failed to get score' });
  }
});

// Get compatibility with another user
router.get('/compatibility/:profileId', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();
    const myProfile = store.profiles.find((p) => p.userId === req.userId);
    const theirProfile = store.profiles.find((p) => p.id === req.params.profileId);

    if (!myProfile?.psychologyScore || !theirProfile?.psychologyScore) {
      return res.json({
        compatible: false,
        message: 'Both profiles need completed psychology assessments',
        report: null,
      });
    }

    const report = calculateCompatibility(myProfile, theirProfile);
    res.json({ compatible: true, report });
  } catch (error) {
    console.error('Get compatibility error:', error);
    res.status(500).json({ message: 'Failed to calculate compatibility' });
  }
});

// Request joint session
router.post('/joint-session', authMiddleware, async (req, res) => {
  try {
    const { partnerId } = req.body;
    if (!partnerId) {
      return res.status(400).json({ message: 'Partner ID required' });
    }

    const store = await readFileStore();

    // Check existing
    const existing = store.jointSessions.find(
      (j) =>
        ((j.requesterId === req.userId && j.partnerId === partnerId) ||
          (j.requesterId === partnerId && j.partnerId === req.userId)) &&
        ['requested', 'accepted', 'booked'].includes(j.status)
    );
    if (existing) {
      return res.status(400).json({ message: 'Joint session already exists' });
    }

    const jointSession = {
      id: uuidv4(),
      requesterId: req.userId!,
      partnerId,
      status: 'requested' as const,
      createdAt: new Date().toISOString(),
    };

    store.jointSessions.push(jointSession);
    await writeFileStore(store);
    res.status(201).json({ jointSession });
  } catch (error) {
    console.error('Joint session error:', error);
    res.status(500).json({ message: 'Failed to request joint session' });
  }
});

// Get joint sessions for user
router.get('/joint-sessions', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();
    const sessions = store.jointSessions.filter(
      (j) => j.requesterId === req.userId || j.partnerId === req.userId
    );

    // Attach profile info
    const sessionsWithProfiles = sessions.map((j) => {
      const requester = store.profiles.find((p) => p.userId === j.requesterId);
      const partner = store.profiles.find((p) => p.userId === j.partnerId);
      return { ...j, requesterProfile: requester, partnerProfile: partner };
    });

    res.json({ jointSessions: sessionsWithProfiles });
  } catch (error) {
    console.error('Get joint sessions error:', error);
    res.status(500).json({ message: 'Failed to get joint sessions' });
  }
});

// ── Scoring Algorithm ──────────────────────────────────────────
function calculatePsychologyScore(responses: Record<string, any>, questions: any[]): PsychologyScore {
  let emotionalStability = 70;
  let openness = 70;
  let agreeableness = 70;
  let conscientiousness = 70;
  let extroversion = 70;

  // Process each response
  for (const [questionId, answer] of Object.entries(responses)) {
    const q = questions.find((question: any) => question.id === questionId);
    if (!q) continue;

    if (q.type === 'scale') {
      const val = Number(answer) || 5;
      const normalized = (val / 10) * 100;
      switch (q.dimension) {
        case 'emotionalStability': emotionalStability = (emotionalStability + normalized) / 2; break;
        case 'openness': openness = (openness + normalized) / 2; break;
        case 'agreeableness': agreeableness = (agreeableness + normalized) / 2; break;
        case 'conscientiousness': conscientiousness = (conscientiousness + normalized) / 2; break;
        case 'extroversion': extroversion = (extroversion + normalized) / 2; break;
      }
    } else if (q.type === 'choice' && q.options) {
      const idx = q.options.indexOf(answer);
      if (idx >= 0) {
        const scores = [90, 75, 55, 40]; // First option = most positive
        const val = scores[idx] || 60;
        switch (q.dimension) {
          case 'emotionalStability': emotionalStability = (emotionalStability + val) / 2; break;
          case 'openness': openness = (openness + val) / 2; break;
          case 'agreeableness': agreeableness = (agreeableness + val) / 2; break;
          case 'conscientiousness': conscientiousness = (conscientiousness + val) / 2; break;
          case 'extroversion': extroversion = (extroversion + val) / 2; break;
          case 'communicationStyle': break; // handled separately
          case 'attachmentStyle': emotionalStability = (emotionalStability + val) / 2; break;
        }
      }
    }
  }

  // Determine communication style
  const cmResponse = responses['cm1'];
  let communicationStyle = 'assertive';
  if (cmResponse === 'Cool down first, then talk') communicationStyle = 'reflective';
  else if (cmResponse === 'Write my thoughts down') communicationStyle = 'written';
  else if (cmResponse === 'Prefer to let things settle naturally') communicationStyle = 'passive';

  // Determine love language
  const llResponse = responses['cm2'];
  let loveLanguage = 'quality_time';
  if (Array.isArray(llResponse) && llResponse.length > 0) {
    const llMap: Record<string, string> = {
      'Words of affirmation': 'words',
      'Physical touch': 'touch',
      'Acts of service': 'service',
      'Gift giving': 'gifts',
      'Quality time': 'time',
    };
    loveLanguage = llMap[llResponse[0]] || 'time';
  }

  // Determine attachment style
  const atResponse = responses['at2'];
  let attachmentStyle = 'secure';
  if (atResponse === 'I understand but feel anxious') attachmentStyle = 'anxious';
  else if (atResponse === 'I worry about the relationship') attachmentStyle = 'fearful';
  else if (atResponse === 'I also prefer my own space') attachmentStyle = 'avoidant';

  // Determine conflict resolution
  const crResponse = responses['cm1'];
  let conflictResolution = 'collaborative';
  if (crResponse === 'Cool down first, then talk') conflictResolution = 'compromising';
  else if (crResponse === 'Write my thoughts down') conflictResolution = 'accommodating';
  else if (crResponse === 'Prefer to let things settle naturally') conflictResolution = 'avoiding';

  // Determine values
  const valResponse = responses['vl1'];
  const values = Array.isArray(valResponse) ? valResponse.slice(0, 3) : ['Family & relationships'];

  const overall = Math.round(
    (emotionalStability * 0.25 + openness * 0.15 + agreeableness * 0.2 + conscientiousness * 0.2 + extroversion * 0.2)
  );

  return {
    overall,
    dimensions: {
      emotionalStability: Math.round(emotionalStability),
      openness: Math.round(openness),
      agreeableness: Math.round(agreeableness),
      conscientiousness: Math.round(conscientiousness),
      extroversion: Math.round(extroversion),
      attachmentStyle,
      communicationStyle,
      conflictResolution,
      loveLanguage,
      values,
    },
    assessedAt: new Date().toISOString(),
  };
}

function calculateCompatibility(profileA: any, profileB: any) {
  const scoreA = profileA.psychologyScore;
  const scoreB = profileB.psychologyScore;

  if (!scoreA?.dimensions || !scoreB?.dimensions) {
    return { overallScore: 0, breakdown: {}, strengths: [], challenges: [], psychologistRecommendation: '' };
  }

  const dimA = scoreA.dimensions;
  const dimB = scoreB.dimensions;

  // Calculate dimension compatibility (closer scores = more compatible for some, complementary for others)
  const emotionalCompat = 100 - Math.abs(dimA.emotionalStability - dimB.emotionalStability);
  const valuesAlignment = calculateValuesOverlap(dimA.values || [], dimB.values || []);
  const communicationCompat = dimA.communicationStyle === dimB.communicationStyle ? 90 :
    (dimA.communicationStyle === 'assertive' && dimB.communicationStyle === 'reflective') ? 80 : 65;
  const loveLanguageCompat = dimA.loveLanguage === dimB.loveLanguage ? 95 : 60;

  // Lifestyle compatibility from profile data
  const dietCompat = profileA.diet === profileB.diet ? 100 : 60;
  const familyCompat = profileA.familyValues === profileB.familyValues ? 95 :
    (profileA.familyValues === 'moderate' || profileB.familyValues === 'moderate') ? 75 : 50;

  const psychologicalMatch = Math.round(
    (emotionalCompat * 0.3 + (100 - Math.abs(dimA.openness - dimB.openness)) * 0.2 +
      (100 - Math.abs(dimA.agreeableness - dimB.agreeableness)) * 0.25 +
      (100 - Math.abs(dimA.conscientiousness - dimB.conscientiousness)) * 0.25)
  );

  const lifestyleCompat = Math.round((dietCompat + (100 - Math.abs(dimA.extroversion - dimB.extroversion))) / 2);

  const overallScore = Math.round(
    psychologicalMatch * 0.3 + valuesAlignment * 0.2 + communicationCompat * 0.15 +
    lifestyleCompat * 0.15 + familyCompat * 0.1 + emotionalCompat * 0.1
  );

  // Generate strengths and challenges
  const strengths: string[] = [];
  const challenges: string[] = [];

  if (psychologicalMatch >= 75) strengths.push('Strong psychological compatibility');
  if (valuesAlignment >= 70) strengths.push('Shared core values and life priorities');
  if (communicationCompat >= 80) strengths.push('Compatible communication styles');
  if (emotionalCompat >= 80) strengths.push('Similar emotional maturity levels');
  if (familyCompat >= 80) strengths.push('Aligned family values and expectations');
  if (loveLanguageCompat >= 80) strengths.push('Compatible love languages');

  if (psychologicalMatch < 60) challenges.push('Personality differences may need extra understanding');
  if (valuesAlignment < 50) challenges.push('Different core values — requires open dialogue');
  if (communicationCompat < 65) challenges.push('Communication styles differ — practice active listening');
  if (emotionalCompat < 60) challenges.push('Emotional expression styles differ');
  if (dimA.attachmentStyle !== dimB.attachmentStyle) challenges.push('Different attachment styles — be mindful of each other\'s needs');

  if (strengths.length === 0) strengths.push('Both partners show willingness to grow together');
  if (challenges.length === 0) challenges.push('No major challenges identified');

  let recommendation = '';
  if (overallScore >= 80) recommendation = 'Excellent match! This pairing shows strong compatibility across multiple dimensions. A joint counseling session would further strengthen the foundation.';
  else if (overallScore >= 65) recommendation = 'Good compatibility with some areas for growth. A joint session with our psychologist can help bridge any differences and build a stronger bond.';
  else if (overallScore >= 50) recommendation = 'Moderate compatibility. There are areas that need mutual effort. We recommend a detailed joint counseling session before proceeding.';
  else recommendation = 'There are significant differences that need attention. We strongly recommend a professional joint session to explore if these can be bridged effectively.';

  return {
    overallScore,
    breakdown: {
      psychologicalMatch,
      valuesAlignment: Math.round(valuesAlignment),
      communicationCompat: Math.round(communicationCompat),
      lifestyleCompat,
      familyCompat: Math.round(familyCompat),
      emotionalCompat: Math.round(emotionalCompat),
    },
    strengths,
    challenges,
    psychologistRecommendation: recommendation,
    generatedAt: new Date().toISOString(),
  };
}

function calculateValuesOverlap(valuesA: string[], valuesB: string[]): number {
  if (!valuesA.length || !valuesB.length) return 50;
  const overlap = valuesA.filter((v) => valuesB.includes(v)).length;
  const total = Math.max(valuesA.length, valuesB.length);
  return Math.round((overlap / total) * 100);
}

export default router;
