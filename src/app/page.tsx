import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
      <main className="flex flex-col items-center w-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
        <Hero />
        <About />
        <Projects />
        <Contact />
        <footer className="py-8 text-sm text-zinc-500">
          © {new Date().getFullYear()} Saransh Halwai
        </footer>
      </main>
  );
}
