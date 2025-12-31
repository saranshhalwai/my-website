"use client"

import Typewriter from "@/components/Typewriter";
import { motion } from "motion/react";
import ShaderHeroBackground from "@/components/HeroBackground";

export default function Hero() {
  return (
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center text-center px-4">

        {/* Shader background */}
        <ShaderHeroBackground />

        {/* Fade / contrast overlay */}
        <div
            aria-hidden
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.15) 20%, var(--background) 100%)",
            }}
        />

        {/* Hero content */}
        <div className="relative z-20">
          <h1 className="text-9xl mb-4">
            <Typewriter
                text={"Hey, I’m"}
                className="inline-block font-serif font-light italic"
                speed={150}
            />
            <br />
            <motion.span
                initial={{ color: "#ffffff" }}
                animate={{ color: "#6366f1" }} // indigo-500
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="font-normal font-serif"
            >
              Saransh Halwai
            </motion.span>
          </h1>
        </div>
      </section>
  );
}
