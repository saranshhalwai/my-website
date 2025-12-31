import ScrollAnimations from "@/components/ScrollAnimations";

export default function About() {
  return (
      <ScrollAnimations>
      <section id="about" className="py-32 px-6 max-w-3xl text-center">
        <h2 className="text-6xl font-serif font-medium mb-6 animate-on-scroll">About Me</h2>
        <p className="text-lg text-zinc-600 font-sans dark:text-zinc-400 animate-on-scroll">
          I’m a Computer Science undergrad focused on practical AI, systems design,
          and building things that don’t crash (often). I like learning how things
          work under the hood — whether it’s neural networks or operating systems.
        </p>
      </section>
      </ScrollAnimations>
  );
}
