# Supabase Migration Guide (Future Enhancement)

## Current State
- Using JSON file storage (`backend/data/store.json`)
- Works great for development and small-scale deployment
- No external database dependencies

## Why Migrate to Supabase?
- **Scalability** - Handle thousands of users
- **Real-time** - Live updates without polling
- **Security** - Row Level Security (RLS) policies
- **Features** - Built-in auth, storage, edge functions
- **Performance** - PostgreSQL with optimized queries

## Migration Steps

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Note your:
   - Project URL
   - Service Role Key (secret)
   - anon key

### 2. Create Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Users table (if using Supabase Auth, this might not be needed)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  location TEXT,
  bio TEXT,
  interests TEXT[], -- Array of strings
  photos TEXT[], -- Array of URLs
  psychological_profile JSONB, -- Store assessment results
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_id, recipient_id)
);

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_requests_sender ON public.requests(sender_id);
CREATE INDEX idx_requests_recipient ON public.requests(recipient_id);
CREATE INDEX idx_requests_status ON public.requests(status);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Requests: Users can see requests they're involved in
CREATE POLICY "Users can view requests they're involved in"
  ON public.requests FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create requests"
  ON public.requests FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update request status"
  ON public.requests FOR UPDATE
  USING (auth.uid() = recipient_id);

CREATE POLICY "Senders can delete their own requests"
  ON public.requests FOR DELETE
  USING (auth.uid() = sender_id AND status = 'pending');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3. Update Backend Environment

Add to `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install Supabase Client

```bash
cd backend
npm install @supabase/supabase-js
```

### 5. Create Supabase Client

Create `backend/src/utils/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 6. Update Routes

#### Auth Routes (`backend/src/routes/auth.ts`)

Option A: Use Supabase Auth
```typescript
import { supabase } from '../utils/supabase.js';

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });
  
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  
  res.status(201).json({
    user: data.user,
    token: data.session?.access_token
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    return res.status(401).json({ message: error.message });
  }
  
  res.json({
    user: data.user,
    token: data.session?.access_token
  });
});
```

#### Profile Routes (`backend/src/routes/profiles.ts`)

```typescript
import { supabase } from '../utils/supabase.js';

router.get('/me', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', req.userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // Not found is ok
    return res.status(500).json({ message: error.message });
  }
  
  res.json({ profile: data });
});

router.put('/me', authMiddleware, async (req, res) => {
  const { name, age, gender, location, bio, interests } = req.body;
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      user_id: req.userId,
      name,
      age,
      gender,
      location,
      bio,
      interests
    })
    .select()
    .single();
  
  if (error) {
    return res.status(500).json({ message: error.message });
  }
  
  res.json({ profile: data });
});

router.get('/matches', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('user_id', req.userId);
  
  if (error) {
    return res.status(500).json({ message: error.message });
  }
  
  res.json({ matches: data });
});
```

#### Request Routes (`backend/src/routes/requests.ts`)

```typescript
import { supabase } from '../utils/supabase.js';

router.post('/', authMiddleware, async (req, res) => {
  const { recipientId, message } = req.body;
  
  const { data, error } = await supabase
    .from('requests')
    .insert({
      sender_id: req.userId,
      recipient_id: recipientId,
      status: 'pending',
      message
    })
    .select()
    .single();
  
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  
  res.status(201).json({ request: data });
});

router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      sender_profile:profiles!sender_id(*),
      recipient_profile:profiles!recipient_id(*)
    `)
    .or(`sender_id.eq.${req.userId},recipient_id.eq.${req.userId}`);
  
  if (error) {
    return res.status(500).json({ message: error.message });
  }
  
  res.json({ success: true, requests: data });
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const { status } = req.body;
  
  const { data, error } = await supabase
    .from('requests')
    .update({ status })
    .eq('id', req.params.id)
    .eq('recipient_id', req.userId)
    .select()
    .single();
  
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  
  res.json({ request: data });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabase
    .from('requests')
    .delete()
    .eq('id', req.params.id)
    .eq('sender_id', req.userId);
  
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  
  res.json({ message: 'Request cancelled' });
});
```

### 7. Migrate Existing Data

Create a migration script `backend/scripts/migrate-to-supabase.ts`:

```typescript
import { readFileStore } from '../src/utils/fileStore.js';
import { supabase } from '../src/utils/supabase.js';

async function migrate() {
  const store = await readFileStore();
  
  console.log('Migrating users...');
  for (const user of store.users) {
    // If using Supabase auth, you'll need to use Admin API
    // Or manually recreate users via signup
  }
  
  console.log('Migrating profiles...');
  const { error: profileError } = await supabase
    .from('profiles')
    .insert(store.profiles);
  
  if (profileError) {
    console.error('Profile migration error:', profileError);
  }
  
  console.log('Migrating requests...');
  const { error: requestError } = await supabase
    .from('requests')
    .insert(store.requests);
  
  if (requestError) {
    console.error('Request migration error:', requestError);
  }
  
  console.log('Migration complete!');
}

migrate();
```

### 8. Update Frontend (Optional)

If using Supabase Auth on frontend:

```bash
cd web
npm install @supabase/supabase-js
```

Create `web/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 9. Testing

1. Test authentication flow
2. Test profile CRUD operations
3. Test request creation/acceptance
4. Verify RLS policies work correctly
5. Check performance with concurrent users

### 10. Fallback Strategy

Keep file storage as fallback:

```typescript
// In each route, try Supabase first, fall back to file store
try {
  // Supabase logic
} catch (supabaseError) {
  console.warn('Supabase error, using file store:', supabaseError);
  // File store logic
}
```

## Benefits After Migration

- ✅ Real-time updates (subscriptions)
- ✅ Better performance with indexes
- ✅ Automatic backups
- ✅ Built-in auth system
- ✅ Row-level security
- ✅ Scalable to millions of users
- ✅ File storage for photos
- ✅ Edge functions for business logic

## Migration Checklist

- [ ] Create Supabase project
- [ ] Run SQL schema
- [ ] Add environment variables
- [ ] Install Supabase SDK
- [ ] Update auth routes
- [ ] Update profile routes
- [ ] Update request routes
- [ ] Test all endpoints
- [ ] Migrate existing data
- [ ] Update frontend (optional)
- [ ] Deploy to production
- [ ] Monitor performance

## Cost Estimate

Supabase Pricing:
- **Free Tier**: 500MB database, 1GB file storage, 2GB bandwidth
- **Pro**: $25/month - 8GB database, 100GB storage, 250GB bandwidth
- **Team**: Custom pricing for larger scale

For a small matrimonial site with <10k users, free tier is sufficient!

---

**Note:** Current JSON file storage works perfectly for development and small deployments. Only migrate when you need scalability, real-time features, or advanced querying capabilities.
