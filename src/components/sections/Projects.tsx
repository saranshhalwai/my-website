import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

const projects = [
	{
		name: "IITIbot",
		desc: "Multi-agent RAG chatbot able to answer complex queries about IIT Indore",
		link: "https://github.com/abhinavpatel271/IITI_BOT",
	},
	{
		name: "Financial Analysis API",
		desc: "An API build using FastAPI with tiering and rate-limiting, using PostgreSQL and Redis",
		link: "https://github.com/saranshhalwai/KalpiC",
	},
	{
		name: "CGanga Website",
		desc: "Made a website that could display 4000+ points on a realtime map with subsecond latency, along with user uploaded data.",
		link: "https://github.com/saranshhalwai/CGangaFrontend",
	},
];

export default function Projects() {
	return (
		<section id="projects" className="py-32 px-6 max-w-5xl text-center">
			<h2 className="text-3xl font-semibold mb-10 translate-y-6">
				Projects
			</h2>
			<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
				{projects.map((proj, i) => (
					<Card
						key={i}
						className="border border-zinc-200 dark:border-zinc-800"
					>
						<CardHeader className="font-semibold text-lg">
							{proj.name}
						</CardHeader>
						<CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
							{proj.desc}
						</CardContent>
						<CardFooter>
							<a
								href={proj.link}
								target="_blank"
								rel="noopener noreferrer"
								className="text-teal-500 hover:underline"
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
