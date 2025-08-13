# Security & Privacy (Frontend)

## Authentication & Authorization
- **JWT Storage**: localStorage only (no cookies, compatible with WebView)
- **Token Validation**: Let backend handle JWT verification
- **Session Management**: Auto-logout on token expiry
- **Protected Routes**: Client-side route guards + server-side verification

## Data Protection (HIPAA Compliance)
- **Zero PHI in Frontend**: No patient data stored client-side
- **Minimal Data**: Only store user profile + session token
- **Logging Rules**: No sensitive data in console/logs
- **Memory Management**: Clear sensitive data on logout

## Input Security
- **Form Validation**: 
  - Client-side for UX (immediate feedback)
  - Server-side for security (never trust client)
- **Sanitization**: Escape user inputs displayed in UI
- **Rate Limiting**: Handled by backend auth service

## Transport Security
- **HTTPS Only**: Enforce in production
- **CORS**: Backend configured for frontend origin
- **Headers**: Security headers handled by Next.js
- **API Endpoints**: Always use environment variables

## Mobile WebView Security
- **External Links**: Validate URLs before opening in native app
- **Deep Links**: Sanitize incoming deep link parameters  
- **Storage**: localStorage preferred over cookies for WebView compatibility
- **Bridge Communication**: Validate messages to/from native app

## Error Handling
- **Generic Messages**: Don't expose internal errors to users
- **Logging**: Log errors for debugging without exposing sensitive data
- **Fallbacks**: Graceful degradation on auth failures

## Development vs Production
- **Environment Variables**: 
  - Development: HTTP localhost allowed
  - Production: HTTPS required
- **Debug Info**: Remove console.logs and debug data in production
- **Source Maps**: Exclude in production builds

## Content Security
- **XSS Prevention**: React's built-in escaping + manual validation
- **Dependency Security**: Regular security audits of npm packages
- **Build Security**: Secure CI/CD pipeline, signed releases

## Session Security
- **Automatic Logout**: On token expiry or suspicious activity
- **Refresh Strategy**: Handle token refresh gracefully
- **Multi-tab Support**: Sync auth state across browser tabs
- **Logout Cleanup**: Clear all stored data completely
