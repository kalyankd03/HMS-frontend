# Architecture (HMS Frontend)

## Stack Overview
- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with mobile-first approach  
- **State**: Zustand for client state (auth, user session)
- **API**: Native fetch with typed interfaces
- **Backend**: HMS auth-service (separate repo at `HMS-app`)

## Frontend Structure
```
HMS-frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout (mobile viewport)
│   │   ├── page.tsx         # Login page (/)
│   │   ├── dashboard/       # Protected dashboard
│   │   └── globals.css      # Tailwind + mobile styles
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base components (Button, Input, Card)
│   │   └── forms/          # Form components
│   ├── lib/                # Core utilities
│   │   ├── api.ts          # Backend API client
│   │   ├── store.ts        # Zustand state management
│   │   ├── types.ts        # Shared TypeScript types
│   │   └── utils.ts        # Helper functions
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── .env.local.sample       # Environment template
```

## Backend Integration
- **Auth Service**: `NEXT_PUBLIC_AUTH_URL` (default: http://localhost:3001)
- **Endpoints**: 
  - `POST /auth/login` → `{ user, token }` | `{ error: { code, message } }`
  - `GET /auth/me` (Bearer token) → user profile
- **Authentication**: JWT tokens stored in localStorage
- **CORS**: Backend configured for frontend origin

## Mobile WebView Strategy
- **Viewport**: `viewportFit: 'cover'` for notched devices
- **Safe Areas**: CSS `env(safe-area-inset-*)` utilities
- **Touch UX**: Larger tap targets, touch-action optimization
- **Inputs**: ≥16px font size to prevent zoom on iOS
- **External Links**: Bridge helper for native app navigation
- **Persistence**: localStorage for tokens (no cookies needed)

## Data Flow
1. **Login**: Email/password → API → store JWT + user data
2. **Session**: Auto-restore from localStorage on app load  
3. **Protected Routes**: Check auth state, redirect if needed
4. **Logout**: Clear state + localStorage

## Security Considerations
- **No PHI in logs**: Follow HMS-app logging patterns
- **Token Security**: JWT-only, no sensitive data in localStorage beyond tokens
- **HTTPS**: Required in production
- **Input Validation**: Client-side validation + server-side verification
- **Error Handling**: Generic error messages, no system details exposed
