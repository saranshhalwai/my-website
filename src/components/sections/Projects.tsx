import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

const projects = [
	{
		name: "IITIbot",
		desc: "Multi-agent RAG chatbot able to answer complex queries about IIT Indore, leveraging advanced retrieval techniques for accurate and context-aware responses. Won bronze medal in IITISoC",
		link: "https://github.com/abhinavpatel271/IITI_BOT",
		tags: ["Python", "Pathway", "RAG", "LLM"]
	},
	{
		name: "CGanga Website",
		desc: "A high-performance interactive platform that renders 4000+ geographical points on a real-time 3D map with sub-second latency.",
		link: "https://github.com/saranshhalwai/CGangaFrontend",
		tags: ["React", "PostgreSQL", "FastAPI", "GIS"]
	},
	{
		name: "CP Games",
		desc: "A website to make learning and practising Competitive Programming fun and interactive.",
		link: "https://bingo-cp-modified.vercel.app/",
		tags: ["Next.js", "Tailwind CSS", "React"]
	},
	{
		name: "Financial Analysis API",
		desc: "An API built using FastAPI with multi-tier user plans, robust rate-limiting, and deep analytics. Backend powered by PostgreSQL and Redis caching.",
		link: "https://github.com/saranshhalwai/KalpiC",
		tags: ["FastAPI", "PostgreSQL", "Redis", "Docker"]
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

			<div className="grid gap-10 lg:grid-cols-3 text-left">
				{projects.map((proj, i) => (
					<Card
						key={i}
						className="border border-zinc-200 dark:border-white/10 flex flex-col transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-3xl group overflow-hidden"
					>
						{/* Subtle top decoration */}
						<div className="h-2 w-full bg-gradient-to-r from-indigo-400 to-indigo-600"></div>

						<CardHeader className="pt-8 font-sans font-semibold text-3xl text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
							{proj.name}
						</CardHeader>

						<CardContent className="font-sans text-lg text-zinc-600 dark:text-zinc-300 flex-grow leading-relaxed">
							{proj.desc}

							{/* Badges */}
							<div className="flex flex-wrap gap-2 mt-6">
								{proj.tags.map((tag, j) => (
									<span key={j} className="px-3 py-1 text-sm font-medium bg-zinc-100 dark:bg-black/30 text-zinc-600 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-white/5">
										{tag}
									</span>
								))}
							</div>
						</CardContent>

						<CardFooter className="pb-8">
							<a
								href={proj.link}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold font-sans group/link transition-colors"
							>
								View Project
								<span className="ml-2 group-hover/link:translate-x-2 transition-transform">→</span>
							</a>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
}
