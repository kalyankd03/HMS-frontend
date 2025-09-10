# Claude Code Commands - HMS Frontend

This file contains useful commands and configurations for working with this Next.js + React Native Web HMS Frontend project in Claude Code.

## Architecture Overview

This project uses **React Native Web** with **Next.js** to maximize code reuse between web and mobile platforms while maintaining SEO optimization and performance benefits.

### Technology Stack
- **Next.js 14+** - Web framework with App Router, SSR, and SEO optimization
- **React Native Web** - Universal component system for web + mobile code reuse
- **TypeScript** - Type safety and developer experience
- **Zustand** - Lightweight state management
- **Tailwind CSS** - Utility-first CSS (legacy, being migrated)
- **React Native StyleSheet** - Universal styling system

### Platform Strategy
- **Web**: Next.js + React Native Web (SEO-friendly, performant)
- **Mobile**: React Native (70-90% code reuse from web)
- **Shared**: Business logic, state management, API layer, core components

## Development Commands

### Package Management
```bash
# Install dependencies
pnpm install

# Add new dependency
pnpm add <package-name>

# Add dev dependency
pnpm add -D <package-name>

# Remove dependency
pnpm remove <package-name>

# Update dependencies
pnpm update
```

### Development Server
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality
```bash
# TypeScript type checking
pnpm type-check

# ESLint linting
pnpm lint

# Fix ESLint issues
pnpm lint --fix
```

## Project Structure Commands

### File Creation Patterns
```bash
# Create new UI component
touch src/components/ui/<ComponentName>.tsx

# Create new page
touch src/app/<page-name>/page.tsx

# Create new API utility
touch src/lib/<utility-name>.ts

# Create new custom hook
touch src/lib/hooks/use<HookName>.ts
```

### Universal Architecture File Structure
```
src/
├── app/                      # Next.js App Router (web-only)
│   ├── (pages)/             # Route groups
│   ├── globals.css          # Global styles + RNW setup
│   ├── layout.tsx           # Root layout with SEO
│   └── page.tsx             # Home page
├── components/
│   ├── shared/              # Universal components (web + mobile)
│   │   ├── Button.tsx       # TouchableOpacity-based
│   │   ├── Text.tsx         # RN Text component
│   │   ├── View.tsx         # RN View component
│   │   ├── TextInput.tsx    # RN TextInput component
│   │   └── index.ts         # Barrel exports
│   ├── platform/            # Platform-specific components
│   │   ├── web/             # Web-only components
│   │   └── native/          # Mobile-only components
│   └── ui/                  # Legacy HTML/CSS components (migrating out)
├── lib/
│   ├── api.ts               # Universal API client
│   ├── store.ts             # Zustand state management
│   ├── types.ts             # Shared TypeScript interfaces
│   ├── utils.ts             # Universal helper functions
│   ├── theme.ts             # Universal theme system
│   └── hooks/               # Custom React hooks
└── styles/
    ├── theme.ts             # React Native StyleSheet themes
    └── universal.ts         # Shared style constants
```

### Component Categories
- **Shared Components**: `src/components/shared/` - Universal (web + mobile)
- **Platform Components**: `src/components/platform/` - Platform-specific
- **Legacy Components**: `src/components/ui/` - Being migrated to shared/
- **Pages**: `src/app/` - Next.js App Router pages (web SEO)
- **API Layer**: `src/lib/api.ts` - Universal backend client
- **State Management**: `src/lib/store.ts` - Zustand stores
- **Type Definitions**: `src/lib/types.ts` - Shared interfaces
- **Utilities**: `src/lib/utils.ts` - Universal helpers
- **Hooks**: `src/lib/hooks/` - Custom React hooks

## Environment Setup

### Environment File Setup
```bash
# Copy sample environment file
cp env.local.sample .env.local

# Edit environment variables
# NEXT_PUBLIC_AUTH_URL=http://localhost:3001
```

### Required Environment Variables
- `NEXT_PUBLIC_AUTH_URL` - HMS auth-service backend URL

## Git Commands

### Common Git Operations
```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "commit message"

# Push changes
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Management
```bash
# Create new branch
git checkout -b feature/branch-name

# Switch branches
git checkout branch-name

# Merge branch
git merge feature/branch-name
```

## Debugging & Testing

### Development Debugging
```bash
# View logs in development
pnpm dev
# Then check browser console for client-side logs
# Check terminal for server-side logs
```

### Component Testing
```bash
# Test component in isolation
# Create test file: src/components/ui/<Component>.test.tsx
# Use React Testing Library patterns
```

## Mobile WebView Testing

### Local Testing
```bash
# Start dev server on all interfaces
pnpm dev -- --hostname 0.0.0.0

# Access from mobile device using computer's IP
# http://192.168.1.xxx:3000
```

### WebView Compatibility Checks
- Test localStorage persistence
- Verify safe area handling on notched devices
- Check touch target sizes (≥44px)
- Validate input font sizes (≥16px on iOS)

## Code Patterns

### Universal Component Template (React Native Web)
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary';
  style?: ViewStyle;
}

export function Component({ children, variant = 'default', style }: ComponentProps) {
  return (
    <View style={[styles.container, styles[variant], style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  default: {
    backgroundColor: '#f3f4f6',
  },
  primary: {
    backgroundColor: '#3b82f6',
  },
  text: {
    fontSize: 14,
    color: '#111827',
  },
});
```

### Platform-Specific Component Pattern
```typescript
// src/components/platform/Navigation.tsx
export { Navigation } from './web/Navigation.web';
// On React Native, this would import from './native/Navigation.native'

// src/components/platform/web/Navigation.web.tsx
import Link from 'next/link';
import { View, Text } from 'react-native';

export function Navigation() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Link href="/dashboard">
        <Text>Dashboard</Text>
      </Link>
    </View>
  );
}

// src/components/platform/native/Navigation.native.tsx
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Navigation() {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text>Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Legacy HTML/CSS Component (Being Migrated)
```typescript
// OLD PATTERN - being migrated out
interface ComponentProps {
  children: React.ReactNode;
  className?: string;
}

export function Component({ children, className }: ComponentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
```

### API Call Pattern
```typescript
async function apiCall() {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Request failed');
    }
    
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

### Zustand Store Pattern
```typescript
interface StoreState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
```

## Universal Styling System

### React Native StyleSheet (Preferred)
```typescript
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Mobile-first responsive design
  container: {
    padding: 16,
    fontSize: 14,
    // Responsive breakpoint
    ...(width > 768 && {
      padding: 24,
      fontSize: 16,
    }),
  },
  
  // Touch-friendly sizing
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },
  
  // Universal button
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Universal input
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    fontSize: 16, // Prevent zoom on iOS
    backgroundColor: '#ffffff',
  },
  
  // Universal card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    padding: 16,
  },
  
  // Safe area handling
  safeArea: {
    paddingTop: 'env(safe-area-inset-top)', // Web
    paddingBottom: 'env(safe-area-inset-bottom)', // Web
    // On React Native, use react-native-safe-area-context
  },
});
```

### Theme System
```typescript
// src/lib/theme.ts
export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    error: '#dc2626',
    success: '#059669',
    warning: '#d97706',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};
```

### Legacy Tailwind CSS (Being Migrated Out)
```css
/* OLD PATTERN - being migrated to StyleSheet */
className="p-4 text-base bg-white rounded-lg shadow-md"
```

## SEO-Friendly Architecture

### Next.js App Router SEO Features
```typescript
// src/app/layout.tsx - Root layout with SEO
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Hospital Management System',
    default: 'Hospital Management System',
  },
  description: 'Comprehensive hospital management and patient care system',
  keywords: ['hospital', 'healthcare', 'patient management', 'medical records'],
  authors: [{ name: 'HMS Team' }],
  openGraph: {
    type: 'website',
    siteName: 'Hospital Management System',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://hms.example.com',
  },
};

// src/app/patients/page.tsx - Page-specific SEO
export const metadata: Metadata = {
  title: 'Patient Management',
  description: 'Register new patients and manage patient records efficiently',
  openGraph: {
    title: 'Patient Management - HMS',
    description: 'Comprehensive patient registration and record management',
  },
};
```

### SEO-Friendly Page Structure
```typescript
// SEO-optimized page with semantic HTML via React Native Web
import { View, Text } from 'react-native';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Hospital management dashboard with real-time analytics',
};

export default function DashboardPage() {
  return (
    <View style={styles.container}>
      {/* Semantic heading structure for SEO */}
      <Text style={styles.h1} accessibilityRole="heading" accessibilityLevel={1}>
        Hospital Dashboard
      </Text>
      
      <View style={styles.section}>
        <Text style={styles.h2} accessibilityRole="heading" accessibilityLevel={2}>
          Today's Statistics
        </Text>
        {/* Content optimized for both SEO and accessibility */}
      </View>
    </View>
  );
}
```

### Structured Data & Analytics
```typescript
// src/app/layout.tsx - Add structured data
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Hospital Management System',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web, iOS, Android',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## React Native Web Best Practices

### Component Migration Priority
1. **Core UI Components** (Button, Text, TextInput, View)
2. **Layout Components** (AppShell, Card, Modal)
3. **Form Components** (Input validation, form handling)
4. **Page Components** (Dashboard, Patients, Queue)
5. **Legacy Cleanup** (Remove HTML/CSS dependencies)

### File Naming Conventions
```
ComponentName.tsx          # Universal component
ComponentName.web.tsx      # Web-specific implementation
ComponentName.native.tsx   # React Native-specific implementation
ComponentName.test.tsx     # Tests (work on both platforms)
ComponentName.stories.tsx  # Storybook stories
```

### Universal Component Checklist
- [ ] Uses React Native components (View, Text, TouchableOpacity)
- [ ] Styles with StyleSheet, not CSS classes
- [ ] Works identically on web and mobile
- [ ] Includes proper accessibility props
- [ ] Has TypeScript interfaces
- [ ] Includes responsive design considerations
- [ ] Follows theme system
- [ ] Has proper error boundaries

## Common Tasks

### Add New Universal Component
1. Create component file in `src/components/shared/`
2. Use React Native components (View, Text, etc.)
3. Style with StyleSheet.create()
4. Add TypeScript interfaces
5. Include accessibility props
6. Export from `src/components/shared/index.ts`
7. Test on both web and mobile

### Add New Page (SEO-Optimized)
1. Create directory in `src/app/`
2. Add `page.tsx` with metadata export
3. Use semantic HTML via React Native Web
4. Include proper heading hierarchy
5. Add structured data if relevant
6. Optimize for Core Web Vitals
7. Add route protection if needed
8. Update navigation components

### Add Platform-Specific Component
1. Create base export in `src/components/platform/ComponentName.tsx`
2. Implement web version in `src/components/platform/web/ComponentName.web.tsx`
3. Implement mobile version in `src/components/platform/native/ComponentName.native.tsx`
4. Use Metro/Webpack resolver to pick correct version
5. Ensure consistent API between platforms

### Add API Integration
1. Add endpoint constants to `src/lib/api.ts`
2. Create typed interfaces in `src/lib/types.ts`
3. Implement API functions with error handling
4. Add loading states to UI components
5. Handle errors gracefully

### Debug Common Issues

#### React Native Web Specific
1. **Component not rendering**: Check if using RN components (View, Text) not HTML (div, span)
2. **Styling issues**: Verify StyleSheet usage, not CSS classes
3. **Platform differences**: Test on both web and mobile simulators
4. **Import errors**: Check file extensions (.web.tsx vs .native.tsx)
5. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`

#### General Issues
1. **CORS errors**: Check backend CORS configuration
2. **TypeScript errors**: Run `pnpm type-check`
3. **Build errors**: Check imports and React Native Web configuration
4. **Mobile WebView issues**: Test in actual WebView environment
5. **State issues**: Check Zustand store and localStorage
6. **SEO issues**: Verify metadata exports and semantic HTML structure

## Security Checklist

### Before Deployment
- [ ] No hardcoded secrets or tokens
- [ ] Environment variables properly configured
- [ ] HTTPS enabled in production
- [ ] No PHI data logged or stored client-side
- [ ] Input validation on all forms
- [ ] Error messages don't expose system details
- [ ] Authentication state properly managed
- [ ] localStorage cleared on logout

## Performance Optimization

### Bundle Size Analysis
```bash
# Analyze bundle size
pnpm build

# Check .next/analyze for bundle analysis (if configured)
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer

# Add to next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

# Run analysis
ANALYZE=true pnpm build
```

### React Native Web Performance
```typescript
// Optimize component rendering
import React, { memo } from 'react';
import { View, Text } from 'react-native';

const OptimizedComponent = memo(({ data }) => {
  return (
    <View style={styles.container}>
      <Text>{data.title}</Text>
    </View>
  );
});

// Use FlatList for large datasets
import { FlatList } from 'react-native';

const LargeList = ({ items }) => (
  <FlatList
    data={items}
    renderItem={({ item }) => <ListItem item={item} />}
    keyExtractor={(item) => item.id}
    removeClippedSubviews={true}
    maxToRenderPerBatch={10}
    windowSize={10}
  />
);

// Optimize StyleSheet usage
const styles = StyleSheet.create({
  // Define styles once, reuse everywhere
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### Code Splitting
```typescript
// Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  priority={true} // for above-fold images
/>
```

## Development Tools & Extensions

### VS Code Extensions for React Native Web
- **ES7+ React/Redux/React-Native snippets** - React Native snippets
- **React Native Tools** - Debugging and IntelliSense for React Native
- **TypeScript Importer** - Auto import management
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Thunder Client** - API testing
- **Auto Rename Tag** - JSX tag management
- **Bracket Pair Colorizer** - Bracket matching
- **GitLens** - Git integration

### React Native Web Development Commands
```bash
# Start Next.js development server
pnpm dev

# Start React Native Metro bundler (for mobile app)
npx react-native start

# Run iOS simulator (when mobile app is ready)
npx react-native run-ios

# Run Android emulator (when mobile app is ready)
npx react-native run-android

# Type checking across platforms
pnpm type-check

# Lint universal codebase
pnpm lint

# Build web production
pnpm build

# Clear all caches
rm -rf .next node_modules/.cache
pnpm install
```

### Testing Strategy
```bash
# Component testing with React Native Testing Library
pnpm add -D @testing-library/react-native
pnpm add -D @testing-library/jest-native

# E2E testing
pnpm add -D detox  # React Native
pnpm add -D playwright  # Web

# Visual regression testing
pnpm add -D @storybook/react-native  # Storybook for RN components
```

### Migration Progress Tracking
```bash
# Track component migration progress
find src/components -name "*.tsx" -exec grep -l "className\|<div\|<span\|<button" {} \;  # Find HTML/CSS components
find src/components/shared -name "*.tsx" | wc -l  # Count universal components
find src/components/ui -name "*.tsx" | wc -l      # Count legacy components

# Bundle size comparison
du -h .next/static/chunks/  # After build, check bundle sizes

# TypeScript coverage
pnpm type-check --noEmit  # Ensure no TS errors across platforms
```

## Summary

This HMS Frontend project is architected for:
- **Maximum code reuse** (70-90%) between web and mobile
- **SEO optimization** via Next.js App Router and semantic HTML
- **Performance** through React Native Web optimizations
- **Developer experience** with TypeScript and universal components
- **Future-proofing** for easy mobile app development

The migration from HTML/CSS to React Native Web provides immediate mobile-readiness while maintaining all Next.js SEO and performance benefits.