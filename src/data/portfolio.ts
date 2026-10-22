// Portfolio content preserved from the original site.

export interface Project {
  name: string;
  desc: string;
  link?: string;
  demo?: string;
  tags: string[];
  details: string[];
}

export const projects: Project[] = [
  {
    name: "OpenLeaf",
    desc: "High-concurrency collaborative LaTeX editor built as an open alternative to Overleaf with on-the-fly PDF compilation.",
    demo: "https://openleaf.saranshhalwai.me",
    link: "https://github.com/saranshhalwai/openleaf-frontend",
    tags: [
      "Cloudflare Workers",
      "Google Cloud",
      "LaTeX Engine",
      "React",
      "TypeScript",
      "Tailwind CSS",
    ],
    details: [
      "Engineered an independent Overleaf alternative to overcome free-tier platform restrictions and enable unrestricted collaborative document authoring.",
      "Architected a serverless frontend edge-deployed on Cloudflare Workers, interfacing with a containerized Google Cloud backend engine executing secure LaTeX PDF compilation routines on demand.",
      "Designed real-time compilation pipelines optimized for sub-second document previews with multi-user collaborative synchronization.",
    ],
  },
  {
    name: "CP-Games",
    desc: "A real-time, multiplayer gaming arena and competitive programming strategy wrapper layered on top of the Codeforces API.",
    link: "https://github.com/legendxanurag/CP-Games",
    demo: "https://cp-games.vercel.app",
    tags: [
      "Next.js",
      "React 19",
      "Pusher WebSockets",
      "Prisma ORM",
      "Neon PostgreSQL",
      "Framer Motion",
      "Radix UI",
    ],
    details: [
      "Architected a real-time multiplayer competitive programming platform by integrating the Codeforces API, expanding an open-source engine with complex game modes (Ticket to Ride, Tug of War).",
      "Synchronized multiplayer game state and board mutations in real-time by implementing full-duplex WebSocket connections via Pusher within a Next.js frontend.",
      "Designed a highly normalized relational database schema using Prisma ORM and deployed a serverless PostgreSQL (Neon) database instance to manage concurrent user sessions, game progression metrics, and API polling rate constraints.",
    ],
  },
  {
    name: "BeatChain",
    desc: "Interoperable, intermediary-free music streaming platform powered by on-chain micro-payments and decentralized content routing.",
    link: "https://github.com/saranshhalwai/Decentralised_music_streaming",
    demo: "https://decentralised-music-streaming.vercel.app",
    tags: [
      "Solidity",
      "Hardhat",
      "Ethers.js",
      "OpenZeppelin",
      "Next.js",
      "Pinata IPFS",
      "Tailwind CSS",
    ],
    details: [
      "Architected a full-stack Web3 music streaming platform on the Ethereum Sepolia testnet, using Next.js with ethers.js and Pinata IPFS for immutable, decentralized storage of audio assets and metadata.",
      "Engineered a custom suite of OpenZeppelin-secured Solidity smart contracts to coordinate instant ETH tips, ERC-721 collectibles embedded with ERC-2981 standard royalty parameters, and an ERC-20 tokenized governance network for decentralized copyright dispute claims.",
      "Optimized EVM compilation and gas efficiency by replacing standard string require checks with custom error structures (saving ~8,000 gas on deployment) and utilizing low-level calldata pointers to minimize expensive memory allocation routines during track ingestion.",
    ],
  },
  {
    name: "Smart Supply Chain Optimisation",
    desc: "Production-grade logistics routing and vehicle assignment engine driven by Graph ML and Reinforcement Learning.",
    link: "https://github.com/godofwar1007/Supply-chain-optimization-using-Graph-ML-and-RL",
    tags: [
      "Python",
      "PyTorch",
      "FastAPI",
      "WebSockets",
      "Google Cloud Run",
      "Vertex AI",
      "Leaflet.js",
    ],
    details: [
      "Architected a supply chain simulation environment mapping 40 Indian logistics hubs, engineering a custom stochastic anomaly engine to inject real-time weather and traffic disruptions.",
      "Trained an end-to-end Heterogeneous Graph Transformer (HGT) and Proximal Policy Optimization (PPO) agent using a 3-phase curriculum, outperforming static greedy baselines in high-volatility scenarios.",
      "Deployed the real-time simulation engine to Google Cloud Run, streaming graph state via WebSockets to a React/Leaflet dashboard, and integrating Vertex AI (Gemini 2.5 Flash) to generate natural-language routing explanations.",
    ],
  },
  {
    name: "IITIbot",
    desc: "A resilient, multi-agent Corrective RAG (CRAG) pipeline designed for low-hallucination institutional knowledge retrieval.",
    link: "https://github.com/abhinavpatel271/IITI_BOT",
    tags: [
      "Python",
      "Pathway",
      "Docker",
      "FastAPI",
      "React",
      "Render",
      "Vercel",
      "LLMs",
    ],
    details: [
      "Engineered a dynamic, multi-agent RAG chatbot utilizing the Pathway framework's Rust-based engine, indexing unstructured data scraped from ~150 institutional websites and PDFs.",
      "Architected a Corrective RAG (CRAG) pipeline featuring specialized LLM routing and sub-query generation agents to process complex, multi-step queries.",
      "Implemented an automated Critique Agent to evaluate answer relevancy, automatically forcing document re-retrieval and answer regeneration if the confidence score fell below 0.80.",
      "Containerized the agentic backend via Docker, deploying the REST API on Render and a React-based frontend on Vercel.",
    ],
  },
  {
    name: "CGanga Data Visualiser",
    desc: "Enterprise-grade full-stack Geographic Information System (GIS) built for state-wide groundwater telemetry mapping.",
    link: "https://github.com/saranshhalwai/Cgangafrontend",
    tags: [
      "React",
      "TypeScript",
      "Leaflet.js",
      "FastAPI",
      "PostgreSQL",
      "PostGIS",
      "asyncpg",
      "Shapely",
    ],
    details: [
      "Engineered a full-stack Geographic Information System (GIS) to visualize state-wide groundwater telemetry data and complex river basin topologies.",
      "Developed a high-performance React/TypeScript mapping interface utilizing Leaflet.js, optimizing the rendering of extensive GeoJSON FeatureCollections (continuous LineStrings and multi-vertex Polygons) with dynamic layer toggling.",
      "Implemented a secure JWT-based Role-Based Access Control (RBAC) mechanism protecting admin-only FastAPI endpoints that process the ingestion and coordinate transformation of zipped Shapefiles into EPSG:4326 PostGIS database tables.",
    ],
  },
];

export const skillCategories = [
  {
    title: "Languages",

    skills: [
      "C / C++",
      "Python",
      "TypeScript",
      "JavaScript",
      "Solidity",
      "SQL",
      "HTML / CSS",
    ],
  },
  {
    title: "AI & Machine Learning",

    skills: [
      "PyTorch",
      "Graph ML (HGT)",
      "Reinforcement Learning (PPO)",
      "Corrective RAG (CRAG)",
      "Multi-Agent Systems",
      "Vertex AI",
    ],
  },
  {
    title: "Systems & Backend",

    skills: [
      "FastAPI",
      "Next.js 16 / React 19",
      "Node.js",
      "WebSockets / Pusher",
      "Linux Systems",
      "RESTful APIs",
    ],
  },
  {
    title: "Cloud & Databases",

    skills: [
      "PostgreSQL / PostGIS",
      "Cloudflare Workers",
      "Google Cloud (Run / Vertex)",
      "Prisma ORM",
      "Docker",
      "Git / GitHub",
    ],
  },
];
