import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import GithubCalendar from "@/components/sections/Github-calendar";
export default function Home() {
  return (
      <main className="flex flex-col items-center w-full bg-transparent text-zinc-900 dark:text-zinc-100">

        <Hero />
        <About />
        <Skills />
        <Projects />
        <GithubCalendar/>
        <Contact />
        <footer className="py-8 text-sm text-zinc-500">
          © {new Date().getFullYear()} Saransh Halwai
        </footer>
      </main>
  );
}
