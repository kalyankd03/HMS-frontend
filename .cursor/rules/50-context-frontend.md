# HMS Frontend — Project Context

## System Overview
- **Frontend**: Next.js 14 + TypeScript + Tailwind (this repo)
- **Backend**: HMS auth-service (separate `HMS-app` repo)
- **Integration**: REST API over HTTPS with JWT authentication
- **Target**: Mobile WebView + responsive web browser

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode, no any/unknown) [[memory:6006429]][[memory:6006420]]
- **Styling**: Tailwind CSS (mobile-first)
- **State**: Zustand (client state management)
- **HTTP**: Native fetch API (no axios)
- **Logging**: Structured logging patterns from HMS-app [[memory:6014318]]

## Backend API Contract
- **Base URL**: `NEXT_PUBLIC_AUTH_URL` (default: http://localhost:3001)
- **Authentication**: 
  - `POST /auth/login` → `{ user, token }` | `{ error: { code, message } }`
  - `GET /auth/me` (Bearer token) → user profile
- **Error Format**: `{ error: { code: string, message: string, details?: any } }`

## Mobile WebView Requirements
- **Viewport**: `viewportFit: 'cover'` for notched devices
- **Safe Areas**: CSS `env(safe-area-inset-*)` utilities  
- **Touch UX**: ≥44px tap targets, `touch-action: manipulation`
- **Inputs**: ≥16px font size (prevents iOS zoom)
- **Text**: `-webkit-text-size-adjust: 100%`
- **External Links**: Bridge helper for native navigation
- **Storage**: localStorage (no cookies for WebView compatibility)
- **CORS**: Backend allows frontend origin

## MVP Scope
- **Core Flow**: Login → JWT storage → profile fetch → Dashboard
- **Features**: Login form, dashboard page, logout, session persistence
- **Security**: JWT-based auth, no PHI storage, HIPAA-compliant logging

## Development Constraints
- **File Output**: Only generate requested files with full paths
- **Type Safety**: Explicit types everywhere, runtime validation
- **Security**: No secrets in code, generic error messages
- **Performance**: Minimal bundle size, server components by default

## Acceptance Criteria
- ✅ Valid login redirects to Dashboard with user profile
- ✅ Invalid login shows specific API error message
- ✅ Session persists across browser refresh
- ✅ Works in React Native WebView, WKWebView, Capacitor
- ✅ Responsive design from 320px mobile to desktop
- ✅ Passes accessibility and performance audits
