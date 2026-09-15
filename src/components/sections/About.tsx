import ScrollAnimations from "@/components/ScrollAnimations";
import { Briefcase, GraduationCap } from "lucide-react";

export default function About() {
  return (
    <ScrollAnimations>
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

          {/* Left Column: Heading */}
          <div className="md:col-span-5 text-left md:text-right">
            <h2 className="text-5xl md:text-7xl font-serif font-medium text-zinc-900 dark:text-zinc-100 leading-tight mb-6">
              Who am I?
            </h2>
            <div className="h-1 w-24 bg-indigo-500 rounded-full md:ml-auto mb-8"></div>
          </div>

          {/* Right Column: Content blocks */}
          <div className="md:col-span-7 space-y-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed">
            <p className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
              I’m a Computer Science & Engineering undergrad at <span className="font-semibold text-zinc-900 dark:text-white">IIT Indore</span> focused on <span className="font-semibold text-indigo-600 dark:text-indigo-400">practical AI</span>, <span className="font-semibold text-indigo-600 dark:text-indigo-400">systems design</span>, and building high-performance software.
            </p>
            <p className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
              I like learning how things work under the hood — whether it’s unraveling the complexities of <span className="text-zinc-900 dark:text-white font-medium">neural networks</span> or diving deep into low-level <span className="text-zinc-900 dark:text-white font-medium">operating systems</span>.
            </p>

            {/* Experience & Education Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                    Experience
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Samsung R&D (SRIB)
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Incoming Developer Intern
                  </p>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-6 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                    Education
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    IIT Indore
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    B.Tech in Computer Science & Engineering
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </ScrollAnimations>
  );
}
