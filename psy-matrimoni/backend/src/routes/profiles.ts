import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';
import { readFileStore, writeFileStore, IndianProfile, PartnerPreferences } from '../utils/fileStore.js';

const router = Router();

// Get own profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();
    const profile = store.profiles.find((p) => p.userId === req.userId);
    res.json({ profile: profile || null });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

// Get profile by ID
router.get('/by-id/:id', async (req, res) => {
  try {
    const store = await readFileStore();
    const profile = store.profiles.find((p) => p.id === req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    // Don't expose sensitive data
    const { ...safeProfile } = profile;
    res.json({ profile: safeProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

// Update/create profile — supports partial updates
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();
    let profile = store.profiles.find((p) => p.userId === req.userId);
    const now = new Date().toISOString();

    if (profile) {
      // Merge updates into existing profile
      const updatable = [
        'name', 'age', 'gender', 'dateOfBirth', 'height', 'weight', 'bodyType', 'complexion',
        'phone', 'location', 'city', 'state', 'country',
        'religion', 'caste', 'subCaste', 'gothra', 'motherTongue',
        'manglik', 'rashi', 'nakshatra',
        'familyType', 'familyStatus', 'familyValues', 'fatherOccupation', 'motherOccupation', 'siblings',
        'education', 'educationDetail', 'occupation', 'company', 'annualIncome', 'workingWith',
        'diet', 'smoking', 'drinking',
        'bio', 'interests', 'hobbies',
        'partnerPreferences', 'photos',
      ];

      for (const key of updatable) {
        if (req.body[key] !== undefined) {
          (profile as any)[key] = req.body[key];
        }
      }
      profile.updatedAt = now;

      // Check profile completeness
      profile.profileComplete = isProfileComplete(profile);
    } else {
      // Create new profile with defaults
      const defaultPrefs: PartnerPreferences = {
        ageMin: 21, ageMax: 35,
      };

      profile = {
        id: uuidv4(),
        userId: req.userId!,
        name: req.body.name || '',
        age: req.body.age || 0,
        gender: req.body.gender || 'male',
        dateOfBirth: req.body.dateOfBirth || '',
        height: req.body.height || '',
        phone: req.body.phone || '',
        location: req.body.location || '',
        city: req.body.city || '',
        state: req.body.state || '',
        country: req.body.country || 'India',
        religion: req.body.religion || '',
        motherTongue: req.body.motherTongue || '',
        familyType: req.body.familyType || 'nuclear',
        familyStatus: req.body.familyStatus || 'middle_class',
        familyValues: req.body.familyValues || 'moderate',
        education: req.body.education || '',
        occupation: req.body.occupation || '',
        diet: req.body.diet || 'vegetarian',
        smoking: req.body.smoking || 'no',
        drinking: req.body.drinking || 'no',
        bio: req.body.bio || '',
        interests: req.body.interests || [],
        hobbies: req.body.hobbies || [],
        partnerPreferences: req.body.partnerPreferences || defaultPrefs,
        psychologyStatus: 'not_started',
        photos: req.body.photos || [],
        profileComplete: false,
        createdAt: now,
        updatedAt: now,
      } as IndianProfile;

      profile.profileComplete = isProfileComplete(profile);
      store.profiles.push(profile);
    }

    await writeFileStore(store);
    res.json({ profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get matches — enhanced with Indian matrimonial criteria + psychology scoring
router.get('/matches', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();
    const myProfile = store.profiles.find((p) => p.userId === req.userId);

    if (!myProfile) {
      return res.json({ matches: [] });
    }

    // Get opposite gender profiles
    const targetGender = myProfile.gender === 'male' ? 'female' : 'male';
    let candidates = store.profiles.filter((p) => p.userId !== req.userId && p.gender === targetGender);

    // Score each candidate
    const scored = candidates.map((candidate) => {
      let score = 50; // base score
      const reasons: string[] = [];

      // Religion match
      if (myProfile.religion && candidate.religion === myProfile.religion) {
        score += 10;
        reasons.push('Same religion');
      }

      // Mother tongue
      if (myProfile.motherTongue && candidate.motherTongue === myProfile.motherTongue) {
        score += 5;
        reasons.push('Same mother tongue');
      }

      // Location proximity (same state)
      if (myProfile.state && candidate.state === myProfile.state) {
        score += 5;
        reasons.push('Same state');
      }

      // Age preferences
      const prefs = myProfile.partnerPreferences;
      if (prefs && candidate.age >= prefs.ageMin && candidate.age <= prefs.ageMax) {
        score += 8;
        reasons.push('Age preference match');
      }

      // Diet match
      if (myProfile.diet === candidate.diet) {
        score += 5;
        reasons.push('Same dietary preference');
      }

      // Family values alignment
      if (myProfile.familyValues === candidate.familyValues) {
        score += 7;
        reasons.push('Aligned family values');
      }

      // Psychology compatibility (biggest weight)
      if (myProfile.psychologyScore && candidate.psychologyScore) {
        const psyA = myProfile.psychologyScore.dimensions;
        const psyB = candidate.psychologyScore.dimensions;

        const emotionalCompat = 100 - Math.abs(psyA.emotionalStability - psyB.emotionalStability);
        const valuesOverlap = (psyA.values || []).filter((v: string) => (psyB.values || []).includes(v)).length;

        const psychScore = Math.round(emotionalCompat * 0.5 + valuesOverlap * 15);
        score += Math.min(psychScore * 0.2, 20);

        if (psychScore >= 70) reasons.push('High psychological compatibility');
      }

      // Caste preference
      if (prefs?.caste?.length && candidate.caste && prefs.caste.includes(candidate.caste)) {
        score += 5;
      }

      return {
        ...candidate,
        matchScore: Math.min(Math.round(score), 99),
        matchReasons: reasons,
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ matches: scored });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ message: 'Failed to get matches' });
  }
});

function isProfileComplete(profile: IndianProfile): boolean {
  return !!(
    profile.name &&
    profile.age &&
    profile.gender &&
    profile.phone &&
    profile.city &&
    profile.state &&
    profile.religion &&
    profile.motherTongue &&
    profile.education &&
    profile.occupation &&
    profile.bio
  );
}

export default router;
