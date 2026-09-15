import ScrollAnimations from "@/components/ScrollAnimations";
import { Code2, BrainCircuit, Server, Database } from "lucide-react";

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["C / C++", "Python", "TypeScript", "JavaScript", "Solidity", "SQL", "HTML / CSS"],
  },
  {
    title: "AI & Machine Learning",
    icon: BrainCircuit,
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
    icon: Server,
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
    icon: Database,
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

export default function Skills() {
  return (
    <ScrollAnimations>
      <section id="skills" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-serif font-medium text-zinc-900 dark:text-zinc-100">
            Skills & Expertise
          </h2>
          <div className="h-1 w-24 bg-indigo-500 rounded-full mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-sans font-bold text-zinc-900 dark:text-zinc-100">
                      {cat.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 text-xs font-medium bg-zinc-100/80 dark:bg-black/40 text-zinc-700 dark:text-zinc-300 rounded-xl border border-zinc-200/80 dark:border-white/5 transition-colors hover:border-indigo-400 dark:hover:border-indigo-500/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                  {cat.skills.length} core competencies
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </ScrollAnimations>
  );
}
