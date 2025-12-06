import Typewriter from "@/components/Typewriter";
import HeroBackground from "@/components/HeroBackground";

export default function Hero() {
  return (
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center px-4">
        <HeroBackground />
        <div className="relative z-10 font-serif">
          <h1 className="text-9xl mb-4 animate-on-scroll opacity-0 translate-y-6">
            <Typewriter text={"Hey, I’m"} className="inline-block font-extralight italic" />
            <br/>
            <span className="font-medium"> Saransh Halwai</span>
          </h1>
        </div>
      </section>
  );
}
