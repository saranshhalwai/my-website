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
		desc: "An API build using FastAPI with tiering and rate-limiting, using PostgreSQL and Redis",
		link: "https://github.com/saranshhalwai/KalpiC",
	},
];

export default function Projects() {
	return (
		<section id="projects" className="py-32 px-6 max-w-5xl text-center">
			<h2 className="text-6xl font-serif font-medium mb-10 translate-y-6">
				Projects
			</h2>
			<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
				{projects.map((proj, i) => (
					<Card
						key={i}
						className="border border-zinc-200 dark:border-zinc-800"
					>
						<CardHeader className="font-sans font-medium text-3xl">
							{proj.name}
						</CardHeader>
						<CardContent className="font-sans text-lg text-zinc-600 dark:text-zinc-400">
							{proj.desc}
						</CardContent>
						<CardFooter>
							<a
								href={proj.link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-indigo-500 hover:underline font-mono"
							>
								GitHub →
							</a>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
}
