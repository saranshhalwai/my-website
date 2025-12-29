"use client"

import Typewriter from "@/components/Typewriter";
import {motion} from "motion/react";
// import HeroBackground from "@/components/HeroBackground";

export default function Hero() {
  return (
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center px-4">
        {/*<HeroBackground />*/}
        <div className="relative z-10 ">
          <h1 className="text-9xl mb-4">
            <Typewriter text={"Hey, I’m"} className="inline-block font-serif font-light italic" speed={150} />
          <br/>
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
