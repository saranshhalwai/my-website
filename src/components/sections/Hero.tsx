"use client"

import Typewriter from "@/components/Typewriter";
import { motion, useScroll, useTransform } from "motion/react";
import ShaderHeroBackground from "@/components/HeroBackground";
import MagneticWrapper from "@/components/MagneticWrapper";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center text-center px-4">

      {/* Shader background */}
      <ShaderHeroBackground />

      {/* Fade / contrast overlay */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {/* Dark mode subtle dimming for text contrast (invisible in light mode) */}
        <div className="absolute inset-0 hidden dark:block bg-black/10" />
        {/* Universal fade to background to blend into the next section */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, var(--background) 100%)",
          }}
        />
      </div>

      {/* Hero content - Parallax wrapped */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 text-zinc-900 dark:text-white"
      >
        <h1 className="text-6xl md:text-9xl mb-4 leading-tight">
          <Typewriter
            text={"Hey, I’m"}
            className="inline-block font-serif font-light italic"
            speed={150}
          />
          <br />
          <motion.span
            initial={{ color: "var(--foreground)", textShadow: "0px 0px 0px rgba(99, 102, 241, 0)" }}
            animate={{ color: "#6366f1", textShadow: "0px 4px 24px rgba(99, 102, 241, 0.5)" }} // indigo-500 with glow
            transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
            className="font-normal font-serif inline-block mt-2"
          >
            Saransh Halwai
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-lg md:text-2xl text-zinc-700 dark:text-zinc-100 font-sans max-w-2xl mx-auto mb-10"
        >
          Full Stack Developer & Systems Enthusiast
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex items-center justify-center gap-4"
        >
          <MagneticWrapper>
            <a href="#projects" className="inline-block px-6 py-3 md:px-8 md:py-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors font-sans shadow-lg shadow-indigo-500/30">
              View Projects
            </a>
          </MagneticWrapper>
          <MagneticWrapper>
            <a href="#contact" className="inline-block px-6 py-3 md:px-8 md:py-4 rounded-full bg-zinc-900/10 dark:bg-white/10 hover:bg-zinc-900/20 dark:hover:bg-white/20 text-zinc-900 dark:text-white backdrop-blur-md transition-colors font-medium font-sans border border-zinc-900/20 dark:border-white/20 shadow-lg shadow-black/5 dark:shadow-black/20">
              Contact Me
            </a>
          </MagneticWrapper>
        </motion.div>
      </motion.div>
    </section>
  );
}
