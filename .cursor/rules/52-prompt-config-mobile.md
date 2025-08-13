# Step 2 — Mobile-friendly Layout & Styles

> Add/update:
> - src/app/globals.css
>   - Tailwind base/components/utilities
>   - Utilities: .container (max-w-md), .card, .btn, .btn-secondary, .input (font-size:16px), .label, .error
>   - :root { color-scheme: light dark }; body: -webkit-text-size-adjust:100%, touch-action:manipulation, overscroll-behavior-y:contain
>   - .safe-area { padding via env(safe-area-inset-*) }
>
> - src/app/layout.tsx
>   - export `viewport` = { width:'device-width', initialScale:1, viewportFit:'cover' }
>   - <meta name="format-detection" content="telephone=no,email=no,address=no" />, theme-color, apple-mobile-web-app-capable
>   - Wrap children: <div className="safe-area"><div className="container py-4">{children}</div></div>
>
> Output only file contents with paths.
