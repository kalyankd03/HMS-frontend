# React Native Web Migration Guide

This guide explains how to migrate your existing HMS Frontend components to use React Native Web for maximum code reuse between web and mobile platforms.

## Architecture Overview

```
src/
├── components/
│   ├── shared/           # Universal components (RNW compatible)
│   ├── platform/         # Platform-specific components
│   │   ├── web/          # Web-only components
│   │   └── native/       # React Native-only components
│   └── ui/               # Existing UI components (gradually migrate)
├── lib/
│   ├── styles/           # Universal styles using StyleSheet
│   └── utils/            # Platform utilities
```

## Component Migration Process

### 1. Shared Components (Universal)

Use these for components that work identically on web and mobile:

**Before (HTML/CSS):**
```tsx
// src/components/ui/button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      className={cn("px-4 py-2 bg-blue-600 text-white rounded", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

**After (React Native Web):**
```tsx
// src/components/shared/Button.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outline';
}

export function Button({ children, onPress, variant = 'default' }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant]]}
      onPress={onPress}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  default: {
    backgroundColor: '#3b82f6',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
```

### 2. Platform-Specific Components

For components that need different implementations:

**Web Version:**
```tsx
// src/components/platform/web/Navigation.web.tsx
import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="flex space-x-4">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/patients">Patients</Link>
    </nav>
  );
}
```

**Mobile Version:**
```tsx
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
      <TouchableOpacity onPress={() => navigation.navigate('Patients')}>
        <Text>Patients</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 3. Universal Export Pattern

```tsx
// src/components/platform/Navigation.tsx
export { Navigation } from './web/Navigation.web';
// On React Native, this would import from './native/Navigation.native'
```

## Key Migration Points

### Replace HTML elements with React Native components:
- `<div>` → `<View>`
- `<span>`, `<p>`, `<h1>` → `<Text>`
- `<button>` → `<TouchableOpacity>` + `<Text>`
- `<input>` → `<TextInput>`
- `<img>` → `<Image>`

### Replace CSS with StyleSheet:
- Tailwind classes → StyleSheet objects
- CSS properties → React Native style properties
- Responsive design → Dimensions API or Flexbox

### Replace event handlers:
- `onClick` → `onPress`
- `onChange` → `onChangeText` (for inputs)
- `onSubmit` → handle in `onPress`

### Replace navigation:
- Next.js `Link` → React Navigation (mobile) or keep Link (web)
- `router.push()` → `navigation.navigate()`

## Styling Strategy

### Universal Styles with StyleSheet:
```tsx
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  responsive: {
    width: width > 768 ? 300 : '100%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
});
```

### Theme Integration:
```tsx
// src/lib/theme.ts
export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#ffffff',
    text: '#111827',
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
};
```

## Gradual Migration Strategy

1. **Start with leaf components** (buttons, text, inputs)
2. **Create shared component library** in `src/components/shared/`
3. **Migrate container components** (cards, modals, forms)
4. **Migrate page layouts** gradually
5. **Keep existing components** until migration is complete
6. **Test thoroughly** on both web and mobile

## Benefits

- **Code Reuse**: 70-90% component sharing between web and mobile
- **Consistent UI**: Same components render identically across platforms
- **Faster Development**: Write once, deploy everywhere
- **Easier Maintenance**: Single source of truth for business logic
- **Better Performance**: Native performance on mobile, optimized web performance

## Next Steps

1. Install and configure React Native Web ✅
2. Create shared component library ✅
3. Migrate critical components (Button, Text, View) ✅
4. Create platform-specific wrappers for navigation/routing
5. Migrate forms and input handling
6. Set up mobile app project (React Native CLI or Expo)
7. Share business logic and state management (Zustand works great!)

## File Extensions for Platform-Specific Code

- `.web.tsx` - Web only
- `.native.tsx` - React Native only  
- `.tsx` - Universal (both platforms)

The bundler will automatically pick the right file for each platform.