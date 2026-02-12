# 🚀 MindMatch Quick Reference

## Start Development
```bash
cd /Users/ansalka/vite-project/psy-matrimoni
chmod +x start.sh && ./start.sh
```

## Access URLs
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5001
- **Health:** http://localhost:5001/health

## Push to GitHub
```bash
cd /Users/ansalka/vite-project/psy-matrimoni
chmod +x push-to-github.sh && ./push-to-github.sh
```

## Key Files

### Frontend
- `web/src/App.tsx` - Routes
- `web/src/store/index.ts` - State (auth, notifications)
- `web/src/services/api.ts` - API client
- `web/src/pages/` - All page components

### Backend
- `backend/src/index.ts` - Server entry
- `backend/src/routes/` - API routes
- `backend/src/middleware/auth.ts` - JWT auth
- `backend/src/utils/fileStore.ts` - Storage
- `backend/.env` - Config

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Profiles
- `GET /api/profiles/me` - My profile
- `PUT /api/profiles/me` - Update profile
- `GET /api/profiles/matches` - Get matches

### Requests
- `POST /api/requests` - Send interest
- `GET /api/requests` - List requests
- `PATCH /api/requests/:id` - Accept/reject
- `DELETE /api/requests/:id` - Cancel

## Commands

### Install
```bash
cd backend && npm install
cd web && npm install
```

### Run Backend
```bash
cd backend && npm run dev
```

### Run Frontend
```bash
cd web && npm run dev
```

### Kill Ports
```bash
lsof -ti:5001 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

## Test Flow
1. Register → `test@example.com` / `test123`
2. Complete Profile → age, gender, location, bio
3. Browse Matches → see other profiles
4. Send Interest → click button
5. Check Requests → manage incoming/outgoing

## Files Created
- ✅ 40+ source files
- ✅ Full frontend (7 pages, components, services)
- ✅ Full backend (3 route files, middleware, utils)
- ✅ Config files (TS, Vite, package.json)
- ✅ Documentation (5 md files)
- ✅ Scripts (start, push, dev)

## Documentation
- `README.md` - Overview
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `SUMMARY.md` - Features
- `CHECKLIST.md` - Testing guide
- `ARCHITECTURE.md` - System design
- `QUICK_REFERENCE.md` - This file

## Troubleshooting
- Port in use: Kill with lsof
- Deps error: Delete node_modules, reinstall
- TS error: Install @types packages
- Auth error: Check .env JWT_SECRET

---
**Ready to run! Just execute `./start.sh` 🎉**
