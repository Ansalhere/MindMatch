# MindMatch - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                    http://localhost:5173                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │ Components │  │   Store    │            │
│  │            │  │            │  │            │            │
│  │ - Home     │  │ - Layout   │  │ - Auth     │            │
│  │ - Login    │  │            │  │ - Notif    │            │
│  │ - Register │  │            │  │            │            │
│  │ - Dashboard│  │            │  └────────────┘            │
│  │ - Profile  │  │            │                             │
│  │ - Matches  │  │            │  ┌────────────┐            │
│  │ - Requests │  │            │  │   Routes   │            │
│  └────────────┘  └────────────┘  │            │            │
│                                   │ - Public   │            │
│  ┌────────────────────────────┐  │ - Protected│            │
│  │    API Client (Axios)      │  │            │            │
│  │                            │  └────────────┘            │
│  │ - Auth Service             │                             │
│  │ - Profile Service          │                             │
│  │ - Request Service          │                             │
│  └────────────────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls (proxy /api → :5001)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Express Backend (Node.js + TypeScript)          │
│                    http://localhost:5001                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Routes                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │ /api/auth    │  │/api/profiles │  │/api/requests│ │ │
│  │  │              │  │              │  │             │ │ │
│  │  │ POST/register│  │ GET/me       │  │ POST/       │ │ │
│  │  │ POST/login   │  │ PUT/me       │  │ GET/        │ │ │
│  │  │              │  │ GET/:id      │  │ PATCH/:id   │ │ │
│  │  │              │  │ GET/matches  │  │ DELETE/:id  │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌──────────────────────────┴────────────────────────────┐  │
│  │              Middleware                                │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  JWT Authentication Middleware                   │ │  │
│  │  │  - Verify token                                  │ │  │
│  │  │  - Extract userId                                │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Utilities                               │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │  File Store (fileStore.ts)                     │ │   │
│  │  │  - readFileStore()                             │ │   │
│  │  │  - writeFileStore()                            │ │   │
│  │  │  - JSON persistence                            │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Read/Write JSON
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    File System Storage                       │
│                  backend/data/store.json                     │
│                                                              │
│  {                                                           │
│    "users": [...],      ← User accounts (email, password)   │
│    "profiles": [...],   ← User profiles (bio, interests)    │
│    "requests": [...]    ← Interest requests                 │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘

## Data Flow Examples

### 1. User Registration Flow
```
Browser → Register Form
   ↓
React (Register.tsx) → authService.register()
   ↓
POST /api/auth/register → backend/routes/auth.ts
   ↓
bcrypt.hash(password) → Create user object
   ↓
writeFileStore() → Save to store.json
   ↓
jwt.sign() → Generate token
   ↓
Response { user, token } → Frontend
   ↓
useAuthStore.setAuth() → Save to localStorage
   ↓
Navigate to Dashboard ✓
```

### 2. Send Interest Request Flow
```
Browser → Matches Page → Click "Send Interest"
   ↓
React (Matches.tsx) → requestService.createRequest(recipientId)
   ↓
POST /api/requests → backend/routes/requests.ts
   ↓
authMiddleware → Verify JWT token
   ↓
readFileStore() → Check existing requests
   ↓
Create request object { senderId, recipientId, status: 'pending' }
   ↓
writeFileStore() → Save to store.json
   ↓
Response { request } → Frontend
   ↓
Toast notification "Interest sent!" ✓
```

### 3. View Requests Flow
```
Browser → Requests Page
   ↓
React (Requests.tsx) → requestService.listRequests()
   ↓
GET /api/requests → backend/routes/requests.ts
   ↓
authMiddleware → Verify JWT token
   ↓
readFileStore() → Load all requests
   ↓
Filter by userId (incoming + outgoing)
   ↓
Attach profile info (sender + recipient)
   ↓
Response { requests } → Frontend
   ↓
Display in two sections: Incoming / Outgoing ✓
```

## Authentication Flow

```
┌──────────┐                           ┌──────────┐
│  Client  │                           │  Server  │
└──────────┘                           └──────────┘
      │                                      │
      │  POST /api/auth/login               │
      │  { email, password }                │
      ├────────────────────────────────────>│
      │                                      │
      │                         ┌────────────┴────────────┐
      │                         │ 1. Find user by email    │
      │                         │ 2. Compare password hash │
      │                         │ 3. Generate JWT token    │
      │                         └────────────┬────────────┘
      │                                      │
      │         { user, token }              │
      │<────────────────────────────────────┤
      │                                      │
      ├─────────────────────┐                │
      │ Store in localStorage│               │
      │ - Auth state         │               │
      │ - JWT token          │               │
      └─────────────────────┘                │
      │                                      │
      │  GET /api/profiles/me               │
      │  Header: Authorization: Bearer JWT   │
      ├────────────────────────────────────>│
      │                                      │
      │                         ┌────────────┴────────────┐
      │                         │ 1. Verify JWT signature  │
      │                         │ 2. Extract userId        │
      │                         │ 3. Fetch user profile    │
      │                         └────────────┬────────────┘
      │                                      │
      │              { profile }             │
      │<────────────────────────────────────┤
      │                                      │
```

## Component Hierarchy

```
App.tsx
├── Router
│   ├── Home.tsx (public)
│   ├── Login.tsx (public)
│   ├── Register.tsx (public)
│   └── Layout.tsx (protected)
│       ├── Navbar
│       │   ├── Dashboard link
│       │   ├── Profile link
│       │   ├── Matches link
│       │   ├── Requests link
│       │   └── Logout button
│       ├── NotificationCenter
│       │   └── Toast messages
│       └── Outlet
│           ├── Dashboard.tsx
│           ├── Profile.tsx
│           │   └── ProfileForm
│           ├── Matches.tsx
│           │   └── MatchCard[]
│           └── Requests.tsx
│               ├── IncomingRequests
│               │   └── RequestCard[]
│               └── OutgoingRequests
│                   └── RequestCard[]
```

## State Management (Zustand)

```
┌────────────────────────────────────────────────┐
│               useAuthStore                     │
│  ┌──────────────────────────────────────────┐ │
│  │ State:                                   │ │
│  │  - user: { id, email, name }             │ │
│  │  - token: string                         │ │
│  │                                          │ │
│  │ Actions:                                 │ │
│  │  - setAuth(user, token)                  │ │
│  │  - logout()                              │ │
│  │                                          │ │
│  │ Persistence: localStorage                │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│          useNotificationStore                  │
│  ┌──────────────────────────────────────────┐ │
│  │ State:                                   │ │
│  │  - notifications: Notification[]         │ │
│  │                                          │ │
│  │ Actions:                                 │ │
│  │  - addNotification(msg, type)            │ │
│  │  - removeNotification(id)                │ │
│  │                                          │ │
│  │ Auto-remove: 5 seconds                   │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

## Database Schema (JSON Store)

```json
{
  "users": [
    {
      "id": "uuid",
      "email": "string",
      "password": "bcrypt-hash",
      "name": "string",
      "createdAt": "ISO-8601"
    }
  ],
  "profiles": [
    {
      "id": "uuid",
      "userId": "uuid-ref",
      "name": "string",
      "age": "number",
      "gender": "string",
      "location": "string",
      "bio": "string",
      "interests": ["string"],
      "photos": ["string"],
      "createdAt": "ISO-8601"
    }
  ],
  "requests": [
    {
      "id": "uuid",
      "senderId": "uuid-ref",
      "recipientId": "uuid-ref",
      "status": "pending|accepted|rejected",
      "message": "string",
      "createdAt": "ISO-8601"
    }
  ]
}
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│            Frontend Stack               │
├─────────────────────────────────────────┤
│ React 18         - UI library           │
│ TypeScript       - Type safety          │
│ Vite             - Build tool           │
│ React Router     - Routing              │
│ Zustand          - State management     │
│ Axios            - HTTP client          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            Backend Stack                │
├─────────────────────────────────────────┤
│ Node.js          - Runtime              │
│ Express          - Web framework        │
│ TypeScript       - Type safety          │
│ JWT              - Authentication       │
│ bcrypt           - Password hashing     │
│ uuid             - ID generation        │
│ CORS             - Cross-origin         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            Development                  │
├─────────────────────────────────────────┤
│ tsx              - TS execution         │
│ Vite             - HMR & dev server     │
│ ESLint           - Code linting         │
└─────────────────────────────────────────┘
```

## Security Features

```
┌───────────────────────────────────────────────┐
│           Security Measures                   │
├───────────────────────────────────────────────┤
│ ✓ Password Hashing (bcrypt, 10 rounds)       │
│ ✓ JWT Tokens (7-day expiration)              │
│ ✓ Protected API Routes                       │
│ ✓ Auth Middleware                            │
│ ✓ CORS Configuration                         │
│ ✓ Input Validation                           │
│ ✓ Environment Variables                      │
│ ✓ Token in Authorization Header              │
│ ✓ Secure localStorage                        │
└───────────────────────────────────────────────┘
```

## Port Configuration

```
┌──────────────────────────────────────┐
│         Development Ports            │
├──────────────────────────────────────┤
│ Frontend:  http://localhost:5173    │
│ Backend:   http://localhost:5001    │
│ Health:    http://localhost:5001/health │
└──────────────────────────────────────┘
```

This architecture provides a solid foundation for the matrimonial platform with room to scale!
