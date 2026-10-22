# Portfolio Website

Personal portfolio of Saransh Halwai, built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

An editorial portfolio in warm paper, charcoal ink, and vermilion. Features an audio-reactive WebGL copper-ribbon sculpture, a GSAP scroll sequence in the hero, a word-by-word reading reveal, cascading skill lists, animated project disclosures, staged contact entrances, magnetic controls, and a moving typography strip. The floating music player restores the original three-track playlist, track attributions, local audio uploads, volume and seek controls, and a full-screen visualizer. Also includes responsive navigation, expandable project details, a GitHub contribution graph, and direct contact links. Original portfolio content is preserved in `src/data/portfolio.ts` and the page sections. Typography is self-hosted; motion respects reduced-motion preferences.

## Development

Install dependencies with `bun install`, then start the development server with `bun run dev`.

Open [http://localhost:3000](http://localhost:3000) in your browser.

- `bun run build`: Build for production.
- `bun run start`: Start the production server.
- `bun run lint`: Run ESLint.
- `bunx tsc --noEmit`: Typecheck the project.
