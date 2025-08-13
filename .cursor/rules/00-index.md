# Cursor Rule Index (HMS Frontend • Next.js + TypeScript + Tailwind)

## How to use
- Read rules in order. Run each **Prompt Step** separately in Cursor.
- Keep outputs small; avoid bulk generation.
- All code: **Next.js 14** + **App Router** + **TypeScript** + **Tailwind CSS** + **Zustand**.
- Backend: HMS auth-service (separate repo). Mobile: WebView-ready.

## Order
1) **Context** (understand the system)
   - 01-architecture.md
   - 02-code-style.md  
   - 03-security.md
   - 49-shared-types.md
   - 50-context-frontend.md

2) **Bootstrap** (foundational setup)
   - 51-prompt-bootstrap.md
   - 52-prompt-config-mobile.md

3) **Core Features** (auth & state)
   - 53-prompt-auth-api.md
   - 54-prompt-store.md
   - 55-prompt-login-page.md
   - 56-prompt-dashboard-page.md

4) **Mobile & UX** (enhancements)
   - 57-prompt-mobile-bridge.md
   - 58-prompt-accessibility-ux.md
   - 59-prompt-pwa-optional.md

5) **Documentation**
   - 60-prompt-readme.md

## Key Constraints
- **Mobile WebView ready**: safe areas, ≥16px inputs, touch UX
- **Strong typing**: TypeScript everywhere, no `any`/`unknown`
- **Structured logging**: use shared patterns from HMS-app
- **Security**: JWT tokens, no PHI in logs, CORS-ready
- **Minimal scope**: Login → Dashboard MVP only
