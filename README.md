# Portofolio (v5)

A Next.js (App Router) portfolio with a desktop-style UI/experience.

## Tech stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **ESLint**

## Requirements

- **Node.js**: 18+ (recommended: latest LTS)
- **Package manager**: **Bun** (preferred) or **pnpm** (fallback). Avoid npm in this repo.

## Getting started

Install dependencies:

```bash
bun install
```

If Bun fails for any reason:

```bash
pnpm install
```

Run the dev server:

```bash
bun run dev
```

Then open `http://localhost:3000`.

## Scripts

- **dev**:

```bash
bun run dev
```

- **build**:

```bash
bun run build
```

- **start**:

```bash
bun run start
```

- **lint**:

```bash
bun run lint
```

## Routes

This project uses the App Router under `src/app/`:

- `/` (home)
- `/about`
- `/projects`
- `/experience`
- `/activity`
- `/contact`
- `/donate`

## Project structure (high level)

- `src/app/`: Next.js App Router pages, layout, and global styles
- `src/components/os/`: “desktop OS” UI (dock, windows, menu bar, etc.)
- `src/apps/`: app-like pages/views used by the OS shell
- `src/assets/`: static assets used by UI

## Terminal + AI

There’s a **Terminal** app inside the OS UI.

- **Open it**: from the Dock, desktop icons, or `/?app=terminal`
- **Try commands**: `help`, `projects`, `open contact`, `clear`
- **Ask AI**: `ai how can I contact you?`

### Configure AI (Vercel / local)

1. Copy env template:

```bash
cp .env.example .env.local
```

1. Set `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`).
1. If you use an **OpenAI-compatible** (unofficial) provider, also set `OPENAI_BASE_URL` (must include `/v1`).

## Deployment (Vercel)

This repo is set up to deploy on Vercel.

- **Build command**: `bun run build`
- **Output**: standard Next.js build output
- **Note**: `vercel.json` currently contains a rewrite that routes all paths to `/`. If you expect direct navigation to routes like `/about` or `/projects`, make sure this behavior is intentional for your setup.

## TypeScript

`next build` runs TypeScript checks. If you see missing typings errors during CI/Vercel builds, ensure dev typings (like `@types/node`) are installed.

## Docker deployment

Build and run the production image with Docker BuildKit:

```sh
docker build -t portfolio .
docker run --rm -p 3000:3000 --env-file .env portfolio
```

Open `http://localhost:3000` (or `/new` for the animated portfolio). The `.env` file is not copied into the image; pass environment variables at runtime. The terminal AI endpoint needs `OPENAI_API_KEY` and optionally `OPENAI_MODEL`. If those features are not needed, omit `--env-file .env`.

The build uses Bun's frozen lockfile, caches dependencies and Next.js build data, and runs Next.js's standalone server as a non-root user. Docker layer and BuildKit cache reuse make subsequent builds faster when the same builder is used.
