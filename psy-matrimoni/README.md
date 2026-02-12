# MindMatch - Psychological Matrimonial Matchmaking

A modern matrimonial platform that uses psychological profiling to find compatible matches.

## Features

- User authentication (register/login)
- Profile management with psychological traits
- Smart matching algorithm
- Interest requests (send/accept/reject)
- Real-time notifications

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Zustand (state management)
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- JWT authentication
- File-based storage (JSON)
- Supabase (optional)

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm/yarn/bun

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ansalhere/MindMatch.git
cd MindMatch
```

2. Install backend dependencies
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. Install frontend dependencies
```bash
cd ../web
npm install
```

### Running Locally

1. Start the backend (from backend directory):
```bash
npm run dev
```
Backend will run on http://localhost:5001

2. Start the frontend (from web directory):
```bash
npm run dev
```
Frontend will run on http://localhost:5173

### Building for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd web
npm run build
npm run preview
```

## Project Structure

```
psy-matrimoni/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/          # Utilities
│   │   └── index.ts        # Entry point
│   ├── data/               # File storage
│   └── package.json
├── web/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand stores
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profiles
- `GET /api/profiles/me` - Get own profile
- `PUT /api/profiles/me` - Update profile
- `GET /api/profiles/:id` - Get profile by ID
- `GET /api/profiles/matches` - Get matches

### Requests
- `POST /api/requests` - Send interest request
- `GET /api/requests` - List all requests
- `PATCH /api/requests/:id` - Accept/reject request
- `DELETE /api/requests/:id` - Cancel request

## License

MIT
