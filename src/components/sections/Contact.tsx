import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function Contact() {
  return (
      <section
          id="contact"
          className="py-32 px-6 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-6xl font-serif font-medium mb-6 translate-y-6">
          Get In Touch
        </h2>

        <p className="text-zinc-600 text-lg dark:text-zinc-400 mb-10 font-sans translate-y-6">
          Always open to collaborations, discussions, or memes.
        </p>

        {/* Resume */}
        <div className="mb-1 text-lg translate-y-6">
          <Button
              asChild
              className="
            bg-indigo-600 text-white
            hover:bg-indigo-500
            focus-visible:ring-2 focus-visible:ring-indigo-500
            transition p-2
          "
          >
            <a
                href="/Resume.pdf"
                download
            >
              <Download className="mr-2 h-4 w-4 text-lg" />
              Download Résumé
            </a>
          </Button>
        </div>

        {/* Socials */}
        <div className="flex font-sans justify-center gap-6 text-sm translate-y-6">
          <a
              href="mailto:saransh2304@gmail.com"
              className="text-indigo-500 hover:underline text-lg"
          >
            Email
          </a>
          <a
              href="https://github.com/saranshhalwai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline text-lg"
          >
            GitHub
          </a>
          <a
              href="https://linkedin.com/in/saransh-halwai-478346171"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline text-lg"
          >
            LinkedIn
          </a>
        </div>
      </section>
  )
}
