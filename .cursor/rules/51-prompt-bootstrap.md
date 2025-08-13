# Step 1 — Bootstrap Frontend Repo (root files)

> Create:
> - package.json { "type":"module"; scripts: dev, build, start, lint; deps: next@14, react, react-dom, tailwindcss, zustand, classnames; devDeps: typescript, @types/react, @types/node, postcss, autoprefixer, eslint, eslint-config-next }
> - next.config.mjs → reactStrictMode: true; experimental: { appDir: true }
> - tsconfig.json → ES2022 target, "moduleResolution":"Bundler", "strict":true, "noEmit":true, "jsx":"preserve"
> - postcss.config.js → tailwindcss + autoprefixer
> - tailwind.config.js → content: ./src/**/*.{js,ts,jsx,tsx}
> - .env.local.sample with:
>   NEXT_PUBLIC_AUTH_URL=http://localhost:3001
> - next-env.d.ts (standard)
> Output only file contents with paths.
