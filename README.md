# Luma Web

The web frontend for [Luma](https://github.com/parkjoshua0212/Luma) — an AI-powered 
language conversation practice app. Talks to the Luma backend API to handle auth, 
conversations, and AI-powered chat and grammar correction.

**Backend repo & API docs**: https://github.com/parkjoshua0212/Luma  
**Live API**: https://luma-api-djcb.onrender.com

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

## Running locally

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` — it's pre-filled to point at the live backend, or 
   change `VITE_API_URL` to `http://localhost:3000` if you're running the backend 
   locally too
4. `npm run dev`
5. Open the URL Vite prints (usually `http://localhost:5173`)

## Known limitations
- The JWT is stored in `localStorage`, not an httpOnly cookie. That's a standard, 
  defensible choice for a simple SPA, but it's readable by any JS on the page — 
  worth knowing if this ever needed to harden against XSS specifically.
- Not yet deployed anywhere — currently runs locally against the live backend.

## What's next
- Deploy this (Vercel or Netlify) and update the backend's `ALLOWED_ORIGINS` to match
- A React Native version reusing the same API and most of the same auth/API-client logic

## License
MIT