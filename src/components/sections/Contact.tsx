export default function Contact() {
  return (
      <section id="contact" className="py-32 px-6 max-w-3xl text-center">
        <h2 className="text-3xl font-semibold mb-6 animate-on-scroll opacity-0 translate-y-6">Get In Touch</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 animate-on-scroll opacity-0 translate-y-6">
          Always open to collaborations, discussions, or memes.
        </p>
        <div className="flex justify-center gap-6 translate-y-6">
          <a
              href="mailto:saransh2304@gmail.com"
              className="text-teal-500 hover:underline"
          >
            Email
          </a>
          <a
              href="https://github.com/saranshhalwai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:underline"
          >
            GitHub
          </a>
          <a
              href="https://linkedin.com/in/saransh-halwai-478346171"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:underline"
          >
            LinkedIn
          </a>
        </div>
      </section>
  );
}
