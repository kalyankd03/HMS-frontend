# Step 7 — WebView Bridge (Optional)

> Create src/lib/mobile.ts:
> - export inNativeWebView(): detect ReactNativeWebView / Capacitor globals
> - export postToHost(data): send to host if available
> - export openExternal(url): try host first, else window.open
>
> Update src/app/dashboard/page.tsx:
> - import { openExternal } from '@/lib/mobile'
> - Add a button: "Help" → openExternal('https://hms.help/guide')
> Output only file contents with paths.
