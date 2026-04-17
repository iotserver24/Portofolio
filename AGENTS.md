## Learned User Preferences
- Prefer Bun for JS/TS package management; if Bun fails, use pnpm, and avoid npm.
- When asked to make changes, edit files directly (don’t just describe).
- Explain what you’re doing and summarize what changed after edits.

## Learned Workspace Facts
- This workspace is a Next.js (App Router) portfolio project that builds on Vercel and uses TypeScript checks during `next build`.
- The desktop-style OS shell includes a Terminal app; AI answers use `/api/terminal-ai`, which requires `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) in server/Vercel environment.
- For dark OS UI (e.g. mobile lock screen controls), prefer inline SVG icons using `currentColor` over `<img>` links to `/public` SVGs so strokes stay visible on dark backgrounds.
- The OS includes a Music app; track metadata lives in `src/apps/music/tracks.ts` (supports posters and direct `audioUrl` links for in-app playback).
