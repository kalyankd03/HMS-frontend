# Code Style (Next.js + TypeScript + Tailwind)

## TypeScript Standards [[memory:6006429]][[memory:6006420]]
- **Strict mode**: `"strict": true` in tsconfig.json
- **No any/unknown**: Explicit types for all data structures
- **Interface over type**: Use `interface` for object shapes
- **Consistent naming**: PascalCase components, camelCase functions/vars
- **Export patterns**: Named exports preferred, default for pages/layouts

## Component Patterns
- **File structure**: One component per file, co-locate tests
- **Component types**: 
  ```typescript
  interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
  }
  ```
- **Client components**: Explicit `'use client'` directive when needed
- **Server components**: Default, avoid unnecessary client boundaries

## Styling Guidelines
- **Tailwind classes**: Utility-first approach
- **Mobile-first**: Start with mobile, use `sm:`, `md:`, `lg:` breakpoints
- **Custom CSS**: Minimal, only in `globals.css` for base styles
- **Class organization**: Group by category (layout, styling, responsive)
  ```tsx
  className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md sm:p-8 lg:max-w-md"
  ```

## API & Data Handling
- **Fetch over axios**: Use native `fetch()` API
- **Error handling**: Consistent error shape matching backend
  ```typescript
  interface ApiError {
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
  }
  ```
- **Type guards**: Runtime type checking for API responses
- **Loading states**: Proper loading/error/success UI patterns

## State Management (Zustand)
- **Store structure**: Flat state, avoid deep nesting
- **Actions**: Co-locate with state, clear naming
- **Persistence**: localStorage sync for auth state only
- **TypeScript**: Fully typed store and actions

## Logging & Debugging [[memory:6014318]]
- **Structured logging**: Follow HMS-app patterns with request IDs
- **No PHI**: Never log passwords, tokens, or patient data
- **Development**: `console.log` for dev, remove before commit
- **Production**: Minimal logging, error boundaries for crashes

## File Organization
- **Absolute imports**: Configure path mapping in tsconfig.json
- **Barrel exports**: Use `index.ts` files for clean imports
- **Co-location**: Keep related files together (component + test + types)

## Performance
- **Bundle optimization**: Dynamic imports for non-critical code
- **Image optimization**: Use Next.js Image component
- **Caching**: Leverage Next.js caching strategies
- **Minimal JavaScript**: Server components by default

## Error Handling
- **Error boundaries**: Catch React errors gracefully
- **Form validation**: Client-side + server-side validation
- **User feedback**: Clear error messages, loading indicators
- **Fallbacks**: Graceful degradation for failed requests
