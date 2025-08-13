# Step 4 — Session Store (Zustand)

> Create src/lib/store.ts:
> - type User = { user_id:number; name:string; email:string; role_id:number }
> - state: { token:string|null; user:User|null }
> - actions: setToken, setUser, logout; persist token to localStorage if window exists
> Output only file contents with paths.
