# Portfolio Website

This repository contains the personal portfolio site of **Saransh Halwai** (B.Tech in Computer Science & Engineering @ IIT Indore, Incoming Developer Intern @ Samsung R&D Institute India).

Built with **Next.js 16**, **React 19 (TypeScript)**, and **Tailwind CSS v4**.

## Features

- **Next.js 16 + React 19 (App Router)**: Fast, server-first modern architecture with dynamic OpenGraph card generation.
- **Custom WebGL GLSL Shader Hero**: Real-time fragment shader background rendering fluid, interactive light and dark mode visuals with mouse reactivity.
- **Audio-Reactive Music Player**: Built-in Web Audio API frequency analyser connected live to shader uniforms (bass, mid, treble, energy). Includes tracks from NCS (*Alan Walker - Fade*, *Cartoon & Jéja - On & On*, *Elektronomia - Sky High*) with license attributions, custom audio upload, and full-screen visualizer mode.
- **Experience & Education Highlights**: Showcase of current studies at IIT Indore and upcoming Developer Internship at Samsung R&D Institute India (SRIB).
- **Categorized Technical Skills**: Glassmorphic cards for Languages, AI & ML, Systems & Backend, and Cloud & Databases.
- **Selected Projects**:
  - **OpenLeaf**: Collaborative LaTeX editor with serverless Cloudflare Workers frontend and GCloud PDF compilation engine.
  - **CP-Games**: Real-time multiplayer competitive programming platform integrated with the Codeforces API (Pusher WebSockets, Prisma, Neon PostgreSQL).
  - **BeatChain**: Decentralized music streaming platform with smart contract micro-payments and IPFS storage.
  - **Smart Supply Chain Optimisation**: Logistics routing engine using Heterogeneous Graph Transformers (HGT) and Reinforcement Learning (PPO).
  - **IITIbot**: Multi-agent Corrective RAG (CRAG) institutional knowledge engine.
  - **CGanga Data Visualiser**: Full-stack GIS mapping platform for state-wide groundwater telemetry (FastAPI, PostGIS).
- **Responsive Navigation**: Glassmorphic fixed navbar with animated mobile slide-down drawer.
- **Enhanced Contact UX**: One-click email copying with Sonner toast feedback and direct links to GitHub, LinkedIn, and LeetCode.
- **Search & Social SEO**: Schema.org JSON-LD Person structured data and edge-rendered OpenGraph previews.

## Quick Start

1. **Install dependencies**
```bash
bun install # or npm install
```

2. **Run the dev server**
```bash
bun run dev # or npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

- Start Dev Server: `bun run dev`
- Build for Production: `bun run build`
- Start Production Server: `bun run start`
- Run ESLint: `bun run lint`
- Typecheck Project: `npx tsc --noEmit`
