# HMS Frontend - Development Context

## Project Overview

**HMS Frontend** is a Next.js 14 application for the Hospital Management System, built with **React Native Web** architecture for maximum code sharing between web and mobile platforms. It uses shadcn/ui components for enhanced web experience while maintaining React Native Web components for universal compatibility.

## Technology Stack

### Core Framework
- **Framework**: Next.js 14 (App Router) with React Native Web
- **Language**: TypeScript (strict mode, no any/unknown)
- **Architecture**: Universal React Native Web components + shadcn/ui
- **State Management**: Zustand with universal hooks
- **HTTP Client**: Universal API layer with React Native Web fetch

### Styling System
- **Universal Styling**: React Native StyleSheet (primary)
- **Web Enhancement**: Tailwind CSS (legacy, being migrated)
- **Component Library**: shadcn/ui for web-specific components
- **Theme**: Universal theme system for consistent design

### Code Sharing Strategy
- **Universal Components**: React Native Web components (70-90% code reuse)
- **Business Logic**: Shared API layer, state management, utilities
- **Platform-Specific**: Web-only features use shadcn/ui components
- **Mobile-Ready**: All universal components work on React Native

## Architecture

### Universal Architecture Project Structure
```
HMS-frontend/
├── src/
│   ├── app/                      # Next.js App Router (web SEO + routing)
│   │   ├── layout.tsx            # Root layout with React Native Web setup
│   │   ├── page.tsx              # Login page (universal components)
│   │   ├── dashboard/            # Protected dashboard (universal)
│   │   ├── patients/             # Patient management (universal)
│   │   ├── queue/                # Queue management (universal)
│   │   ├── prescription/         # Prescription system (universal)
│   │   └── globals.css           # React Native Web + Tailwind setup
│   ├── components/
│   │   ├── shared/               # Universal components (web + mobile)
│   │   │   ├── AppShell.tsx      # Main app layout (RN Web)
│   │   │   ├── Button.tsx        # TouchableOpacity-based button
│   │   │   ├── Card.tsx          # Universal card component
│   │   │   ├── Text.tsx          # RN Text with variants
│   │   │   ├── TextInput.tsx     # RN TextInput component
│   │   │   ├── View.tsx          # RN View with flex utilities
│   │   │   └── index.ts          # Barrel exports
│   │   ├── ui/                   # shadcn/ui components (web-optimized)
│   │   │   ├── dialog.tsx        # Modal dialogs
│   │   │   ├── dropdown-menu.tsx # Dropdown components
│   │   │   ├── sheet.tsx         # Side sheets
│   │   │   └── ...               # Other shadcn components
│   │   └── platform/             # Platform-specific components
│   │       ├── web/              # Web-only components
│   │       └── native/           # React Native-only components
│   ├── lib/                      # Universal business logic
│   │   ├── api.ts                # Universal API client
│   │   ├── store.ts              # Zustand universal state
│   │   ├── types.ts              # Shared TypeScript interfaces
│   │   ├── utils.ts              # Universal helper functions
│   │   ├── theme.ts              # Universal theme system
│   │   ├── constants.ts          # Shared constants
│   │   └── hooks/                # Universal custom hooks
│   │       ├── useApi.ts         # API state management
│   │       ├── usePatientSearch.ts # Patient search logic
│   │       ├── useFormValidation.ts # Form validation
│   │       └── index.ts          # Hook exports
│   └── types/                    # Additional type definitions
├── public/                       # Static assets
├── components.json               # shadcn/ui configuration
├── next.config.mjs              # React Native Web webpack config
└── .env.local.sample            # Environment template
```

### Component Architecture Layers

1. **Universal Layer**: React Native Web components that work identically on web and mobile
2. **Enhancement Layer**: shadcn/ui components for web-specific features
3. **Platform Layer**: Platform-specific implementations when needed
4. **Business Logic Layer**: Shared hooks, utilities, API calls, and state management

### Backend Integration
- **Auth Service**: HMS auth-service (separate `HMS-app` repo)
- **Base URL**: `NEXT_PUBLIC_AUTH_URL` (default: http://localhost:3001)
- **Authentication**: JWT tokens stored in localStorage
- **API Endpoints**:
  - `POST /auth/login` → `{ user, token }` | `{ error: { code, message } }`
  - `GET /auth/me` (Bearer token) → user profile

## Mobile WebView Compatibility

The application is designed to work seamlessly in mobile WebView environments:

### iOS (WKWebView)
- Uses `viewportFit: 'cover'` for notched devices
- CSS `env(safe-area-inset-*)` for safe areas
- 16px+ input font sizes prevent zoom

### Android (WebView)
- Touch-action optimization for smooth scrolling
- Proper viewport meta tags for consistent rendering

### React Native WebView
- localStorage works out of the box
- No cookie dependencies
- External link handling via bridge (optional)

## Universal Development Guidelines

### React Native Web Component Patterns

#### Universal Component Template
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/lib/theme';

interface ComponentProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary';
  onPress?: () => void;
}

export function UniversalComponent({ children, variant = 'default', onPress }: ComponentProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, styles[variant]]} 
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minHeight: theme.touchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: theme.colors.surface,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  text: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  },
});
```

#### Shared Hook Pattern
```typescript
import { useState, useCallback } from 'react';
import { useApi } from '@/lib/hooks';
import { searchPatients } from '@/lib/api';

export function usePatientSearch() {
  const [query, setQuery] = useState('');
  
  const { 
    data: results, 
    loading, 
    error, 
    execute 
  } = useApi(searchPatients);

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length >= 3) {
      await execute(searchQuery, 10);
    }
  }, [execute]);

  return {
    query,
    results: results?.results || [],
    loading,
    error,
    search,
    setQuery,
  };
}
```

### Code Style & Architecture
- **Components**: React Native Web first, enhance with shadcn/ui when needed
- **Styling**: StyleSheet.create() for universal styles, Tailwind for web-only enhancements
- **TypeScript**: Strict mode, explicit types, shared interfaces
- **State**: Universal Zustand stores with React Native Web compatibility
- **API**: Universal hooks with automatic error handling and retries
- **Navigation**: Next.js App Router for web, React Navigation ready for mobile

### Universal Component Rules
1. **Always use React Native components**: View, Text, TouchableOpacity, TextInput, etc.
2. **StyleSheet for styling**: Never use CSS classes in universal components
3. **Touch-friendly sizing**: Minimum 44px touch targets for accessibility
4. **Responsive design**: Use theme.responsive utilities for breakpoints
5. **Accessibility**: Include proper accessibility props (accessible, accessibilityRole, etc.)
6. **Theme consistency**: Always reference theme constants for colors, spacing, fonts

### Security & Privacy
- **JWT Storage**: localStorage only (WebView compatible)
- **Data Protection**: No PHI stored client-side
- **Input Security**: Client-side validation for UX, server-side for security
- **Transport Security**: HTTPS in production, CORS configured
- **Error Handling**: Generic messages, no internal details exposed

### Logging & Debugging
- **Structured Logging**: Follow HMS-app patterns with request IDs
- **No PHI**: Never log passwords, tokens, or patient data
- **Development**: Console logging allowed, remove before production
- **Production**: Minimal logging, error boundaries for crashes

## Environment Configuration

### Required Environment Variables
```bash
NEXT_PUBLIC_AUTH_URL=http://localhost:3001  # HMS auth-service URL
```

### Development Setup
1. Install dependencies: `pnpm install`
2. Copy environment: `cp env.local.sample .env.local`
3. Start development: `pnpm dev`
4. Open browser: `http://localhost:3000`

## Key Features

### ✅ Authentication
- Login/Register with role selection
- JWT-based session management
- Protected routes with automatic redirects
- Profile management

### ✅ Mobile WebView Ready
- Safe area support for iOS notch
- Touch-optimized UX (≥44px tap targets)
- Responsive design (320px mobile to desktop)
- WebView-compatible storage strategy

### ✅ Dashboard
- User profile display
- Quick stats and metrics
- Navigation to key features
- Recent activity timeline

## Data Models

### Core Types (matching HMS auth-service)
```typescript
interface User {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}

interface Role {
  role_id: number;
  name: 'admin' | 'doctor' | 'frontdesk' | 'labtech' | 'pharmacist';
  description?: string;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

## Commands

### Development
```bash
pnpm dev              # Start Next.js development server with React Native Web
pnpm type-check       # TypeScript validation across universal codebase  
pnpm lint            # ESLint checking for web and universal components

# shadcn/ui component management
pnpm dlx shadcn@latest add <component>    # Add new shadcn components
pnpm dlx shadcn@latest view @shadcn       # View available components
```

### Production & Build
```bash
pnpm build           # Build optimized web bundle with React Native Web
pnpm start           # Start production Next.js server

# Future React Native commands (when mobile app is added)
# npx react-native run-ios     # Run iOS simulator
# npx react-native run-android # Run Android emulator
```

### Universal Development Workflow
```bash
# 1. Create universal component
touch src/components/shared/NewComponent.tsx

# 2. Add to barrel exports
echo "export { NewComponent } from './NewComponent';" >> src/components/shared/index.ts

# 3. Create universal hook
touch src/lib/hooks/useNewFeature.ts

# 4. Test on web
pnpm dev

# 5. Future: Test on mobile simulators
# npx react-native start
```

## Cursor AI Configuration

The project includes comprehensive Cursor AI rules in `.cursor/rules/` for:
- Architecture guidelines
- Code style enforcement
- Security best practices
- Mobile WebView requirements
- TypeScript patterns
- Tailwind CSS usage

## Troubleshooting

### CORS Issues
Ensure HMS auth-service backend allows frontend origin:
```javascript
{
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: false
}
```

### Mobile Testing
- Test in actual WebView containers
- Verify safe area handling on notched devices
- Check touch target sizes (minimum 44px)

### HTTPS in Production
- Always use HTTPS in production
- Update `NEXT_PUBLIC_AUTH_URL` to HTTPS
- Ensure SSL certificates are configured

## Contributing

1. Follow established TypeScript and React patterns
2. Use Tailwind CSS utilities for styling
3. Maintain mobile-first responsive design
4. Include proper accessibility attributes
5. Test in both browser and WebView environments
6. Follow security guidelines for healthcare applications