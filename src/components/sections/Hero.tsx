import Typewriter from "@/components/Typewriter";
// import HeroBackground from "@/components/HeroBackground";

export default function Hero() {
  return (
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center px-4">
        {/*<HeroBackground />*/}
        <div className="relative z-10 ">
          <h1 className="text-9xl mb-4 translate-y-6">
            <Typewriter text={"Hey, I’m"} className="inline-block font-serif font-light italic" />
            <br/>
            <span className="font-serif text-indigo-500 font-normal"> Saransh Halwai</span>
          </h1>
        </div>
      </section>
  );
}
