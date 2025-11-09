import Typewriter from "@/components/Typewriter";

export default function Hero() {
  return (
      <section className="h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4 animate-on-scroll opacity-0 translate-y-6">
          <Typewriter text={"Hey, I’m"} className="inline-block" />
          <span className="text-teal-400"> Saransh Halwai</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl animate-on-scroll opacity-0 translate-y-6">
          CSE student at IIT Indore exploring machine learning, systems, and whatever
          else breaks first.
        </p>
      </section>
  );
}
