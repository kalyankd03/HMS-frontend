# HMS Frontend

Hospital Management System Frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Environment setup:**
   ```bash
   cp env.local.sample .env.local
   ```
   
   Update `.env.local` with your HMS auth-service URL:
   ```
   NEXT_PUBLIC_AUTH_URL=http://localhost:3001
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

### ✅ Authentication
- **Login/Register**: Combined form with role selection
- **JWT Storage**: Persistent sessions using localStorage
- **Protected Routes**: Automatic redirects for unauthenticated users
- **Profile Management**: User profile display and management

### ✅ Mobile WebView Ready
- **Safe Areas**: iOS notch support with `env(safe-area-inset-*)`
- **Touch UX**: ≥44px tap targets, optimized touch interactions
- **Input Handling**: ≥16px font size to prevent iOS zoom
- **Responsive Design**: 320px mobile to desktop breakpoints

### ✅ Dashboard
- **User Profile**: Display user information and role
- **Quick Stats**: Sample metrics and KPIs
- **Quick Actions**: Navigation to key features
- **Recent Activity**: Activity timeline

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_AUTH_URL` | HMS auth-service backend URL | `http://localhost:3001` |

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Native fetch API
- **Build Tool**: Next.js built-in bundler

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with mobile viewport
│   ├── page.tsx           # Login/Register page
│   ├── dashboard/         # Protected dashboard
│   └── globals.css        # Global styles with mobile utilities
├── lib/                   # Core utilities
│   ├── api.ts            # Backend API client
│   ├── store.ts          # Zustand auth store
│   └── types.ts          # TypeScript interfaces
```

## Mobile WebView Notes

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

## Troubleshooting

### CORS Issues
Ensure your HMS auth-service backend is configured to allow requests from your frontend origin:
```javascript
// Backend CORS config
{
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: false
}
```

### HTTPS in Production
- Always use HTTPS in production
- Update `NEXT_PUBLIC_AUTH_URL` to use HTTPS
- Ensure SSL certificates are properly configured

### Mobile Testing
- Test in actual WebView containers (React Native, Capacitor)
- Verify safe area handling on notched devices
- Check touch target sizes (minimum 44px)

## API Integration

The frontend integrates with the HMS auth-service backend:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `GET /auth/me` - Get user profile (requires Bearer token)

### Error Handling
API errors follow the standard format:
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # TypeScript check
npm run lint            # ESLint check

# Production
npm run build           # Build for production
npm run start           # Start production server
```

## Contributing

1. Follow the established TypeScript and React patterns
2. Use Tailwind CSS utilities for styling
3. Maintain mobile-first responsive design
4. Include proper accessibility attributes
5. Test in both browser and WebView environments