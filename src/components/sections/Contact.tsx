import { Button } from "@/components/ui/button"
import { Download, Mail, Github, Linkedin, ArrowUpRight } from "lucide-react"
import ScrollAnimations from "@/components/ScrollAnimations";
import MagneticWrapper from "@/components/MagneticWrapper";

export default function Contact() {
  return (
    <ScrollAnimations>
      <section id="contact" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="bg-indigo-600 dark:bg-indigo-900/40 backdrop-blur-xl rounded-[3rem] p-12 md:p-24 text-center border border-indigo-500/20 shadow-2xl overflow-hidden relative">

          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-serif font-medium text-white mb-6">
              Let&apos;s Build Something
            </h2>

            <p className="text-indigo-100 text-xl md:text-2xl font-sans mb-12 max-w-2xl mx-auto">
              Always open to collaborations, system design discussions, or sharing memes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <MagneticWrapper>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-zinc-100 px-8 py-6 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-xl shadow-indigo-900/20"
                >
                  <a href="/Resume.pdf" download>
                    <Download className="mr-2 h-5 w-5" />
                    Download Résumé
                  </a>
                </Button>
              </MagneticWrapper>

              <MagneticWrapper>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-full text-lg font-semibold transition-all hover:scale-105 backdrop-blur-sm"
                >
                  <a href="mailto:saransh2304@gmail.com">
                    <Mail className="mr-2 h-5 w-5" />
                    Say Hello
                  </a>
                </Button>
              </MagneticWrapper>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-4 text-indigo-100 font-sans">
              <a
                href="https://github.com/saranshhalwai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
              >
                <Github size={18} />
                <span>GitHub</span>
                <ArrowUpRight size={14} className="opacity-50" />
              </a>
              <a
                href="https://linkedin.com/in/saransh-halwai-478346171"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
                <ArrowUpRight size={14} className="opacity-50" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimations>
  );
}
