# Claude Agents Quick Guide — HMS Frontend

This is the concise, actionable guide for Claude/Cursor when working on HMS Frontend. For architecture, ownership, and rules of the monorepo, refer to `agents.md` (canonical).

## Scope
- Use this file for commands, scaffolding patterns, and implementation checklists.
- Use `agents.md` for structure, responsibilities, and where code belongs.

## Monorepo Commands

### Workspace Management
```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm -w build

# Type check across workspace
pnpm -w type-check

# Lint across workspace
pnpm -w lint
```

### App-Specific Commands
```bash
# Web app (Next.js)
pnpm --filter @hms/web dev
pnpm --filter @hms/web build
pnpm --filter @hms/web start

# Mobile app (Expo/React Native)
pnpm --filter @hms/mobile dev  # (expo start)
pnpm --filter @hms/mobile android
pnpm --filter @hms/mobile ios

# Package development
pnpm --filter @hms/ui-primitives build
pnpm --filter @hms/core build
```

## File Scaffolding Patterns

### Web Page (Next.js App Router)
```bash
mkdir -p apps/web/src/app/<route>
cat > apps/web/src/app/<route>/page.tsx <<'TS'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
}

export default function Page() {
  return (
    <div>
      <h1>Page Content</h1>
    </div>
  )
}
TS
```

### Universal Primitive (ui-primitives)
```bash
mkdir -p packages/ui-primitives/src/components
cat > packages/ui-primitives/src/components/Button.tsx <<'TS'
import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

export type ButtonVariant = 'default' | 'outline'
export interface ButtonProps {
  children: React.ReactNode
  onPress?: () => void
  variant?: ButtonVariant
}

export function Button({ children, onPress, variant = 'default' }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.base, styles[variant]]}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 6, 
    alignItems: 'center',
    minHeight: 44, // Touch target
  },
  default: { backgroundColor: '#3b82f6' },
  outline: { 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: '#3b82f6' 
  },
  text: { color: '#fff', fontSize: 14, fontWeight: '500' },
})
TS
```

### Web-Only Component (ui-web)
```bash
mkdir -p packages/ui-web/src/components
cat > packages/ui-web/src/components/DataTable.tsx <<'TS'
'use client'
import React from 'react'
import { Button } from '@hms/ui-primitives'
// Import shadcn/ui components as needed
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface DataTableProps<T> {
  data: T[]
  columns: Array<{ key: keyof T; label: string }>
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      {/* Use shadcn/ui Table components here */}
      <div>DataTable implementation</div>
    </div>
  )
}
TS
```

### Shared Types/Schemas (core)
```bash
mkdir -p packages/core/src/schemas
cat > packages/core/src/schemas/user.ts <<'TS'
import { z } from 'zod'

export const UserSchema = z.object({
  userId: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'doctor', 'frontdesk', 'labtech', 'pharmacist']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type User = z.infer<typeof UserSchema>

export const CreateUserSchema = UserSchema.omit({ 
  userId: true, 
  createdAt: true, 
  updatedAt: true 
})

export type CreateUser = z.infer<typeof CreateUserSchema>
TS
```

### API Client (api-client)
```bash
mkdir -p packages/api-client/src/auth
cat > packages/api-client/src/auth/client.ts <<'TS'
import { User, UserSchema } from '@hms/core/schemas'

const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001'

export class AuthClient {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Login failed')
    }
    
    const data = await response.json()
    return {
      user: UserSchema.parse(data.user),
      token: data.token,
    }
  }
  
  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    
    if (!response.ok) {
      throw new Error('Failed to get user profile')
    }
    
    const data = await response.json()
    return UserSchema.parse(data)
  }
}

export const authClient = new AuthClient()
TS
```

## Cross-Platform Conventions

### File Naming
- `Component.tsx` (universal)
- `Component.web.tsx` (web-specific)
- `Component.native.tsx` (mobile-specific)

### Platform Resolution
```typescript
// packages/ui-primitives/src/components/Navigation.tsx
export { Navigation } from './Navigation.web'
// On React Native, bundler picks ./Navigation.native

// packages/ui-primitives/src/components/Navigation.web.tsx
import Link from 'next/link'
import { View, Text } from 'react-native'

export function Navigation() {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Link href="/dashboard">
        <Text>Dashboard</Text>
      </Link>
    </View>
  )
}

// packages/ui-primitives/src/components/Navigation.native.tsx
import { View, TouchableOpacity, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export function Navigation() {
  const navigation = useNavigation()
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text>Dashboard</Text>
      </TouchableOpacity>
    </View>
  )
}
```

### Styling Conventions
```typescript
// ui-primitives: Use StyleSheet (cross-platform)
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    minHeight: 44, // Touch target
  },
})

// ui-web: Can use Tailwind + shadcn/ui
<div className="bg-white p-4 rounded-lg min-h-11">
  <Button>Click me</Button>
</div>
```

## API Usage Patterns

### Import from packages
```typescript
// Always import from published packages
import { User, UserSchema } from '@hms/core'
import { authClient } from '@hms/api-client'
import { Button, Text } from '@hms/ui-primitives'
import { DataTable } from '@hms/ui-web' // web apps only
```

### Error Handling
```typescript
// Consistent error handling across apps
try {
  const user = await authClient.getMe(token)
  // Handle success
} catch (error) {
  // Log without PHI
  console.error('Failed to fetch user:', error.message)
  // Show user-friendly message
  setError('Unable to load profile. Please try again.')
}
```

## Environment Setup

### Web App (.env.local)
```bash
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_PATIENT_URL=http://localhost:3002
```

### Mobile App (app.config.ts)
```typescript
export default {
  expo: {
    name: 'HMS Mobile',
    slug: 'hms-mobile',
    extra: {
      authUrl: process.env.AUTH_URL || 'http://localhost:3001',
      patientUrl: process.env.PATIENT_URL || 'http://localhost:3002',
    },
  },
}
```

## Component Checklists

### Universal Component (ui-primitives)
- [ ] Uses React Native primitives (View, Text, TouchableOpacity)
- [ ] StyleSheet for styling, no CSS classes
- [ ] Accessible (touch targets ≥44px, proper roles)
- [ ] Explicit TypeScript types, no any/unknown
- [ ] Works identically on web and mobile
- [ ] Composes design tokens when available

### Web Component (ui-web)
- [ ] Lives in `packages/ui-web`
- [ ] Composes shadcn/ui components as needed
- [ ] Can use Tailwind classes within this package
- [ ] Doesn't leak web-specific patterns to ui-primitives
- [ ] Provides TypeScript exports

### App Screen/Page
- [ ] Imports from packages, not relative paths to other apps
- [ ] Handles loading and error states
- [ ] Uses appropriate navigation (Link for web, navigation for mobile)
- [ ] Includes proper metadata (web) or screen options (mobile)

## Troubleshooting

### Common Issues
- **CORS/Auth**: Verify environment variables and backend CORS config
- **Import errors**: Check package exports and file extensions
- **Styling issues**: Ensure StyleSheet usage in primitives, Tailwind only in web
- **Platform resolution**: Verify `.web.tsx` and `.native.tsx` extensions
- **Build errors**: Check TypeScript types and package dependencies

### Debug Commands
```bash
# Check workspace dependencies
pnpm -w list --depth=0

# Verify package builds
pnpm --filter @hms/core build
pnpm --filter @hms/ui-primitives build

# Clear caches
pnpm store prune
rm -rf node_modules/.cache
```

---

**Key Principle**: This file focuses on execution patterns. See `agents.md` for architectural decisions and package responsibilities.