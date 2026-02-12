# MindMatch Setup and Deployment Instructions

## Status
✅ Frontend complete - All React components, pages, routing, and state management
✅ Backend complete - Express API with auth, profiles, and requests endpoints
✅ File storage - JSON-based persistent storage for development

## Manual Steps Required

### 1. Install Dependencies

Open a fresh terminal and run:

```bash
cd /Users/ansalka/vite-project/psy-matrimoni/backend
npm install

cd ../web
npm install
```

### 2. Test Locally

Start backend (Terminal 1):
```bash
cd /Users/ansalka/vite-project/psy-matrimoni/backend
npm run dev
```

Start frontend (Terminal 2):
```bash
cd /Users/ansalka/vite-project/psy-matrimoni/web
npm run dev
```

### 3. Test the Application

1. Open http://localhost:5173 in your browser
2. Register a new account
3. Complete your profile
4. Browse matches
5. Send interest requests
6. Test accept/reject functionality

### 4. Commit and Push to GitHub

```bash
cd /Users/ansalka/vite-project
git add psy-matrimoni/
git commit -m "Add complete MindMatch matrimonial platform"
git push origin main
```

Or push directly to MindMatch repo:
```bash
cd /Users/ansalka/vite-project
git remote add mindmatch https://github.com/Ansalhere/MindMatch.git
git push mindmatch main
```

## Project Structure

```
psy-matrimoni/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts        # Register/Login
│   │   │   ├── profiles.ts    # Profile CRUD + Matches
│   │   │   └── requests.ts    # Interest requests
│   │   ├── middleware/
│   │   │   └── auth.ts        # JWT middleware
│   │   ├── utils/
│   │   │   └── fileStore.ts   # JSON file storage
│   │   └── index.ts           # Server entry
│   ├── data/                  # Auto-created on first run
│   ├── .env                   # Environment config
│   └── package.json
│
├── web/                       # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx     # Main layout with nav
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Landing page
│   │   │   ├── Login.tsx      # Login form
│   │   │   ├── Register.tsx   # Registration
│   │   │   ├── Dashboard.tsx  # User dashboard
│   │   │   ├── Profile.tsx    # Profile management
│   │   │   ├── Matches.tsx    # Browse matches
│   │   │   └── Requests.tsx   # Manage requests
│   │   ├── services/
│   │   │   └── api.ts         # API client (axios)
│   │   ├── store/
│   │   │   └── index.ts       # Zustand stores (auth, notifications)
│   │   ├── App.tsx            # Routes
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── scripts/
│   └── dev.sh                 # Development startup script
└── README.md                  # Documentation
```

## Features Implemented

### Authentication
- User registration with bcrypt password hashing
- JWT-based login
- Protected routes
- Persistent auth state (localStorage)

### Profiles
- Create/update profile (name, age, gender, location, bio, interests)
- View other profiles
- Profile completion tracking

### Matching
- Basic matching algorithm (returns all profiles except self)
- Ready to extend with psychological compatibility scoring

### Interest Requests
- Send interest to matches
- View incoming requests
- Accept/reject incoming requests
- Cancel outgoing requests
- Real-time status updates

### UI/UX
- Responsive design
- Toast notifications
- Loading states
- Form validation
- Routing with protected routes

## Next Steps (Optional Enhancements)

1. **Add Supabase Integration**
   - Replace file storage with Supabase Postgres
   - Use SQL migrations from conversation history

2. **Enhanced Matching**
   - Implement psychological profiling
   - Personality trait analysis
   - Compatibility scoring algorithm

3. **Real-time Features**
   - WebSocket for live notifications
   - Real-time chat messaging

4. **Testing**
   - Add Jest/Vitest unit tests
   - Playwright E2E tests
   - CI/CD pipeline

5. **Deployment**
   - Frontend: Vercel/Netlify
   - Backend: Railway/Render/Fly.io
   - Database: Supabase

## Troubleshooting

**Port already in use:**
```bash
# Kill processes on port 5001 or 5173
lsof -ti:5001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**Module not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Ensure all dependencies are installed
npm install --save-dev @types/node @types/express @types/react
```

## Environment Variables

Backend (.env):
```
PORT=5001
JWT_SECRET=your-secret-key-here
```

Optional Supabase:
```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
