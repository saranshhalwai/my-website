import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

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
		tags: ["Cloudflare Workers", "Google Cloud", "LaTeX Engine", "React", "TypeScript", "Tailwind CSS"],
		details: [
			"Engineered an independent Overleaf alternative to overcome free-tier platform restrictions and enable unrestricted collaborative document authoring.",
			"Architected a serverless frontend edge-deployed on Cloudflare Workers, interfacing with a containerized Google Cloud backend engine executing secure LaTeX PDF compilation routines on demand.",
			"Designed real-time compilation pipelines optimized for sub-second document previews, with multi-user collaborative synchronization currently in active development."
		]
	},
	{
		name: "CP-Games",
		desc: "A real-time, multiplayer gaming arena and competitive programming strategy wrapper layered on top of the Codeforces API.",
		link: "https://github.com/legendxanurag/CP-Games",
		demo: "https://cp-games.vercel.app",
		tags: ["Next.js", "React 19", "Pusher WebSockets", "Prisma ORM", "Neon PostgreSQL", "Framer Motion", "Radix UI"],
		details: [
			"Architected a real-time multiplayer competitive programming platform by integrating the Codeforces API, expanding an open-source engine with complex game modes (Ticket to Ride, Tug of War).",
			"Synchronized multiplayer game state and board mutations in real-time by implementing full-duplex WebSocket connections via Pusher within a Next.js frontend.",
			"Designed a highly normalized relational database schema using Prisma ORM and deployed a serverless PostgreSQL (Neon) database instance to manage concurrent user sessions, game progression metrics, and API polling rate constraints."
		]
	},
	{
		name: "BeatChain",
		desc: "Interoperable, intermediary-free music streaming platform powered by on-chain micro-payments and decentralized content routing.",
		link: "https://github.com/saranshhalwai/Decentralised_music_streaming",
		demo: "https://decentralised-music-streaming.vercel.app",
		tags: ["Solidity", "Hardhat", "Ethers.js", "OpenZeppelin", "Next.js", "Pinata IPFS", "Tailwind CSS"],
		details: [
			"Architected a full-stack Web3 music streaming platform on the Ethereum Sepolia testnet, using Next.js with ethers.js and Pinata IPFS for immutable, decentralized storage of audio assets and metadata.",
			"Engineered a custom suite of OpenZeppelin-secured Solidity smart contracts to coordinate instant ETH tips, ERC-721 collectibles embedded with ERC-2981 standard royalty parameters, and an ERC-20 tokenized governance network for decentralized copyright dispute claims.",
			"Optimized EVM compilation and gas efficiency by replacing standard string require checks with custom error structures (saving ~8,000 gas on deployment) and utilizing low-level calldata pointers to minimize expensive memory allocation routines during track ingestion."
		]
	},
	{
		name: "Smart Supply Chain Optimisation",
		desc: "Production-grade logistics routing and vehicle assignment engine driven by Graph ML and Reinforcement Learning.",
		link: "https://github.com/godofwar1007/Supply-chain-optimization-using-Graph-ML-and-RL",
		tags: ["Python", "PyTorch", "FastAPI", "WebSockets", "Google Cloud Run", "Vertex AI", "Leaflet.js"],
		details: [
			"Architected a supply chain simulation environment mapping 40 Indian logistics hubs, engineering a custom stochastic anomaly engine to inject real-time weather and traffic disruptions.",
			"Trained an end-to-end Heterogeneous Graph Transformer (HGT) and Proximal Policy Optimization (PPO) agent using a 3-phase curriculum, outperforming static greedy baselines in high-volatility scenarios.",
			"Deployed the real-time simulation engine to Google Cloud Run, streaming graph state via WebSockets to a React/Leaflet dashboard, and integrating Vertex AI (Gemini 2.5 Flash) to generate natural-language routing explanations."
		]
	},
	{
		name: "IITIbot",
		desc: "A resilient, multi-agent Corrective RAG (CRAG) pipeline designed for low-hallucination institutional knowledge retrieval.",
		link: "https://github.com/abhinavpatel271/IITI_BOT",
		tags: ["Python", "Pathway", "Docker", "FastAPI", "React", "Render", "Vercel", "LLMs"],
		details: [
			"Engineered a dynamic, multi-agent RAG chatbot utilizing the Pathway framework's Rust-based engine, indexing unstructured data scraped from ~150 institutional websites and PDFs.",
			"Architected a Corrective RAG (CRAG) pipeline featuring specialized LLM routing and sub-query generation agents to process complex, multi-step queries.",
			"Implemented an automated Critique Agent to evaluate answer relevancy, automatically forcing document re-retrieval and answer regeneration if the confidence score fell below 0.80.",
			"Containerized the agentic backend via Docker, deploying the REST API on Render and a React-based frontend on Vercel."
		]
	},
	{
		name: "CGanga Data Visualiser",
		desc: "Enterprise-grade full-stack Geographic Information System (GIS) built for state-wide groundwater telemetry mapping.",
		link: "https://github.com/saranshhalwai/Cgangafrontend",
		tags: ["React", "TypeScript", "Leaflet.js", "FastAPI", "PostgreSQL", "PostGIS", "asyncpg", "Shapely"],
		details: [
			"Engineered a full-stack Geographic Information System (GIS) to visualize state-wide groundwater telemetry data and complex river basin topologies.",
			"Developed a high-performance React/TypeScript mapping interface utilizing Leaflet.js, optimizing the rendering of extensive GeoJSON FeatureCollections (continuous LineStrings and multi-vertex Polygons) with dynamic layer toggling.",
			"Implemented a secure JWT-based Role-Based Access Control (RBAC) mechanism protecting admin-only FastAPI endpoints that process the ingestion and coordinate transformation of zipped Shapefiles into EPSG:4326 PostGIS database tables."
		]
	}
];

export default function Projects() {
	return (
		<section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
			<div className="text-center mb-16">
				<h2 className="text-5xl md:text-7xl font-serif font-medium text-zinc-900 dark:text-zinc-100">
					Selected Projects
				</h2>
				<div className="h-1 w-24 bg-indigo-500 rounded-full mx-auto mt-6"></div>
			</div>

			<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 text-left">
				{projects.map((proj, i) => (
					<Card
						key={i}
						className="border border-zinc-200 dark:border-white/10 flex flex-col transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-3xl group overflow-hidden"
					>
						{/* Subtle top decoration */}
						<div className="h-2 w-full bg-gradient-to-r from-indigo-400 to-indigo-600"></div>

						<CardHeader className="pt-8 font-sans font-semibold text-2xl text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
							{proj.name}
						</CardHeader>

						<CardContent className="font-sans flex-grow flex flex-col justify-between">
							<div>
								<p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-4 leading-relaxed">
									{proj.desc}
								</p>
								<ul className="list-disc pl-5 space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
									{proj.details.map((detail, idx) => (
										<li key={idx}>{detail}</li>
									))}
								</ul>
							</div>

							{/* Badges */}
							<div className="flex flex-wrap gap-1.5 mt-6">
								{proj.tags.map((tag, j) => (
									<span key={j} className="px-2.5 py-0.5 text-[11px] font-medium bg-zinc-100 dark:bg-black/30 text-zinc-600 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-white/5">
										{tag}
									</span>
								))}
							</div>
						</CardContent>

						<CardFooter className="pb-8 pt-4 flex flex-wrap items-center gap-3">
							{proj.demo && (
								<a
									href={proj.demo}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold font-sans text-xs shadow-md shadow-indigo-500/25 transition-all hover:scale-105"
								>
									<ExternalLink size={14} />
									<span>Live Demo</span>
								</a>
							)}
							{proj.link && (
								<a
									href={proj.link}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100/90 hover:bg-zinc-200/90 dark:bg-white/10 dark:hover:bg-white/15 text-zinc-700 dark:text-zinc-200 font-medium font-sans text-xs transition-colors"
								>
									<Github size={14} />
									<span>Source Code</span>
								</a>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
}
