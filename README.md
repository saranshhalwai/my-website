# Portfolio Website

This repository contains my personal portfolio site built with Next.js 16, React 19 (TypeScript), and Tailwind CSS v4.

## Features

- **Next.js 16 + React 19 (App Router)**
- **AI Chatbot Clone**: An embedded AI chatbot powered by LangChain and the Groq API (Llama 3.1 8B) that acts as an AI clone, answering questions based on my GitHub data and portfolio projects.
- **Rate Limiting**: Integrated Upstash Redis to rate-limit the AI chatbot endpoints.
- **Dynamic Context**: Fetches real-time profile and repository data from the GitHub API to provide the LLM with up-to-date context.
- **Advanced Animations**: Powered by Framer Motion and GSAP (ScrollTrigger) for lazy-loaded scroll, fade, slide, and stagger animations.
- **Modern UI Components**: Utilizes Radix UI primitives, Lucide React icons, Sonner for toasts, and Embla Carousel.
- **Typewriter Hero Intro**
- **Dynamic Hero Background**:
  - Fallbacks to `/public/hero.jpg` if present.
  - Client-side in-app image chooser (stores in `localStorage`).

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Environment Variables**
Create a `.env.local` file at the root of the project with the following variables:
```env
GROQ_API_KEY=your_groq_api_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
GITHUB_TOKEN=your_github_personal_access_token
```

3. **Run the dev server**
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## Development Commands

- Start Dev Server: `npm run dev`
- Build for Production: `npm run build`
- Start Production Server: `npm run start`
- Run ESLint: `npm run lint`
- Typecheck Project: `npx tsc --noEmit`

## Architecture Notes

- **AI Chatbot**: Implemented in `src/app/api/chat/route.ts` using `@langchain/groq` and `@ai-sdk/react`. Retrieves GitHub data using `src/lib/github.ts` and leverages Upstash for ratelimiting.
- **Animations**: Managed via Framer Motion and GSAP. `src/components/ScrollAnimations.tsx` lazy-loads GSAP scroll animations on the client.
- **Hero Background**: Logic is located in `src/components/HeroBackground.tsx`. It prefers `localStorage.heroImage`, otherwise falls back to `/hero.jpg`.
- **In-app Image Chooser**: Located in `src/components/ImageChooser.tsx` (client-side only).

## Troubleshooting

- If the hero image does not appear but `/hero.jpg` returns 200 in the Network tab, try a hard refresh (Ctrl+Shift+R) or restart the dev server. Also check `localStorage.getItem('heroImage')` to see if a bad value is set.
- If an uploaded image fails to save via the chooser, it may be too large for browser limits (~5MB) in `localStorage`.
