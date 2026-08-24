# Luma Web

The web frontend for [Luma](https://github.com/parkjoshua0212/Luma) — an AI-powered 
language conversation practice app. Talks to the Luma backend API to handle auth, 
conversations, and AI-powered chat and grammar correction.

**Backend repo & API docs**: https://github.com/parkjoshua0212/Luma  
**Live API**: https://luma-api-djcb.onrender.com  
**Live app**: https://luma-web-livid.vercel.app

## What it does
- Register / log in (JWT-based, issued by the backend)
- Start a conversation in **formal** or **casual** mode and chat with an AI partner 
  that adapts its tone accordingly
- Inline grammar correction — messages with a mistake show a small lightbulb icon; 
  clicking it reveals the correction and explanation without leaving the chat
- A standalone grammar checker for one-off sentences, separate from any conversation
- Handles backend AI failures gracefully — a temporary Gemini outage shows a clear 
  retry message, and hitting the free-tier's daily quota shows a distinct 
  "try again tomorrow" message rather than a generic error

## Tech Stack
- **React** (Vite) — no meta-framework, kept intentionally simple
- **React Router** for navigation
- **Axios** for API calls, with an interceptor that attaches the JWT automatically
- **Context API** for auth state (no Redux — the app's state is small enough not to need it)
- Custom design system (CSS variables, no UI framework) — dark, warm palette built 
  around the app's actual core feature: distinguishing formal vs. casual tone
- **Hosting**: Vercel, with a rewrite rule (`vercel.json`) so client-side routes 
  (e.g. `/chat/5`) resolve correctly on direct load and refresh, not just in-app navigation

## Running locally

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` — it's pre-filled to point at the live backend, or 
   change `VITE_API_URL` to `http://localhost:3000` if you're running the backend 
   locally too
4. `npm run dev`
5. Open the URL Vite prints (usually `http://localhost:5173`)

## Fixes found during deployment
- **SPA routing 404s on refresh/direct link**: React Router handles routes like 
  `/login` or `/chat/5` entirely client-side — they aren't real files on the server. 
  A refresh or a direct link (rather than in-app navigation) sent a request straight 
  to Vercel's server, which correctly returned 404 since no such file exists. Fixed 
  with a `vercel.json` rewrite rule that serves `index.html` for any unmatched route, 
  letting React Router take over once the page loads.
- **CORS blocked the deployed frontend from calling the API**: the backend's 
  `ALLOWED_ORIGINS` only had `localhost` entries from local development. Added the 
  live Vercel URL once it existed — expected, not a bug, since the backend can't know 
  a frontend's URL before that frontend has been deployed.

## Known limitations
- The JWT is stored in `localStorage`, not an httpOnly cookie. That's a standard, 
  defensible choice for a simple SPA, but it's readable by any JS on the page — 
  worth knowing if this ever needed to harden against XSS specifically.

## What's next
- A React Native version reusing the same API and most of the same auth/API-client logic

## License
MIT