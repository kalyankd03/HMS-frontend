## HMS Frontend — Agents Guide (Canonical)

This document is the single source of truth for how agents and contributors should understand and work within the HMS Frontend. It supersedes prior scattered docs (CONTEXT.md, older CLAUDE notes).

### Monorepo Layout (target)
```
hms-frontend/
├─ apps/
│  ├─ web/                         # Next.js app (admin/front desk)
│  │  ├─ app/                      # routes (dashboard, marketing, api)
│  │  ├─ components/               # app-level wrappers
│  │  ├─ styles/                   # tailwind, globals.css
│  │  └─ next.config.mjs
│  └─ mobile/                      # Expo / React Native app
│     ├─ app/                      # expo-router screens
│     ├─ components/               # app-level wrappers
│     ├─ assets/                   
│     ├─ app.config.ts / app.json
│     └─ metro.config.js           # configure to resolve @hms/* pkgs
│
├─ packages/
│  ├─ core/                        # shared TS types, zod schemas, RBAC, utils
│  ├─ api-client/                  # generated OpenAPI/tRPC client
│  ├─ ui-primitives/               # ★ cross-platform atoms (Tamagui / RN Web)
│  │  ├─ components/               # Button, Input, Stack, Text
│  │  ├─ theme/                    # tokens (colors, spacing, typography)
│  │  └─ index.ts
│  ├─ ui-web/                      # web-only (shadcn/ui components)
│  │  ├─ components/               # tables, modals, popovers, etc.
│  │  └─ index.ts
│  └─ config/                      # tsconfig/eslint/tailwind presets, tokens
│
├─ package.json                    # workspace scripts
├─ pnpm-workspace.yaml
└─ tsconfig.base.json              # root TS settings
```

### Monorepo Rules
- **pnpm workspaces** for dependency and build orchestration.
- **Tech stack**: **Next.js (web)** + **Expo/React Native (mobile)**.
- **Shared packages**: core types/schemas, API clients, and **ui-primitives**.

### Goals
- **Share logic and primitives** where possible.
- **Keep platform-specific UI separate**.
- **Web** uses full **shadcn/ui** where it adds value; **mobile** uses native experiences.

### What goes where
- **apps/web**: Next.js App Router, SEO, shadcn/ui usage, web routing, server components as needed.
- **apps/mobile**: Expo + `expo-router`, native navigation, native modules.
- **packages/core**: Type-safe domain models, zod schemas, RBAC helpers, constants, pure utilities.
- **packages/api-client**: Single, generated client for backend services. Never hand-roll clients per app.
- **packages/ui-primitives**: Cross-platform atoms (Button, Text, Input, Stack) built on RN Web/Tamagui; no Tailwind classes here.
- **packages/ui-web**: Web-only components (tables, dialogs, popovers) based on shadcn/ui, composed from primitives when possible.
- **packages/config**: Centralized TypeScript, ESLint, Tailwind presets and design tokens.

### Sharing strategy
- **Universal first**: Put reusable logic in `core` and `api-client`; put visual primitives in `ui-primitives`.
- **Enhance on web**: Use `ui-web` for complex web-only UI (e.g., DataTable) that wraps or composes primitives.
- **Platform splits**: If behavior diverges, use `.web.tsx` / `.native.tsx` or app-level components.

### Conventions
- **TypeScript**: strict, explicit types; avoid `any`/`unknown`.
- **File naming**: `Component.tsx` (universal), `Component.web.tsx`, `Component.native.tsx`.
- **Styling**: primitives use RN StyleSheet or Tamagui; web-only can use Tailwind/shadcn styles in `ui-web`.
- **Accessibility**: touch targets ≥44px; proper roles/labels; semantic headings on web.
- **Security**: no PHI in logs; tokens handled via secure storage (web: localStorage; mobile: SecureStore when used).

### Adding a new feature (quick path)
1. Define types/schemas in `packages/core` (zod + TS types).
2. Add/regen endpoints in `packages/api-client`.
3. Build UI in `packages/ui-primitives` if cross-platform; otherwise in `ui-web` for web-only.
4. Wire screens/pages:
   - Web: `apps/web/app/<route>/page.tsx`
   - Mobile: `apps/mobile/app/(tabs)/<route>.tsx`
5. State: colocated hooks or shared `core` utilities; prefer Zustand stores in app layers only when necessary.

### When to choose shadcn/ui vs primitives
- Use **ui-primitives** for shared, cross-platform atoms and simple molecules.
- Use **ui-web (shadcn/ui)** for rich web experiences (tables, popovers, complex menus, modals).

### Environment
- Web requires `NEXT_PUBLIC_AUTH_URL` and other service URLs.
- Keep secrets out of the repo; use `.env.local` (web) and app config (mobile).

### Source of truth
- Update this file when structure, rules, or conventions change.
- Older docs are deprecated; point all contributors to `agents.md` and the trimmed `CLAUDE.md` for commands.
