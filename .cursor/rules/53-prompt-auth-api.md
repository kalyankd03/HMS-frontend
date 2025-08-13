# Step 3 — Auth API Client

> Create src/lib/api.ts:
> - const AUTH = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001'
> - async http(path, opts): fetch JSON; on !ok throw Error(body.error.message || statusText)
> - export async function login(email, password): POST /auth/login
> - export async function me(token): GET /auth/me with Authorization: Bearer <token>
> Output only file contents with paths.
