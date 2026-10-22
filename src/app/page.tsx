import Image from "next/image";
import { ArrowUpRight, Download, Github } from "lucide-react";
import {
  CopyEmail,
  KineticSculpture,
  Navigation,
  ScrollCue,
} from "@/components/PortfolioInteractions";
import { projects, skillCategories } from "@/data/portfolio";

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span className="section-index">{number}</span>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <section
          className="hero page-gutter"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-topline">
            <span className="eyebrow">
              Full Stack Developer &amp; Systems Enthusiast
            </span>
            <span className="hero-index" aria-hidden="true">
              PORTFOLIO — 01
            </span>
          </div>
          <div className="hero-composition">
            <p className="hero-greeting">Hey, I’m</p>
            <h1 id="hero-title">
              <span>Saransh</span>
              <span>
                Halwai<span className="name-period">.</span>
              </span>
            </h1>
            <KineticSculpture />
            <div className="hero-status">
              <span className="status-mark" />
              <p>
                Incoming Developer Intern @<br />
                <strong>Samsung R&amp;D (SRIB)</strong>
              </p>
            </div>
          </div>
          <div className="hero-bottom">
            <div className="hero-actions">
              <a className="button-primary" href="#projects">
                View Projects <ArrowUpRight size={19} />
              </a>
              <a className="text-link" href="#contact">
                Contact Me <ArrowUpRight size={17} />
              </a>
            </div>
            <p className="hero-footnote">
              Computer Science &amp; Engineering
              <br />
              <span>IIT Indore</span>
            </p>
            <ScrollCue />
          </div>
        </section>

        <div className="type-marquee" aria-hidden="true">
          <div className="type-marquee-track">
            {[0, 1].map((copy) => (
              <div className="type-marquee-group" key={copy}>
                {[0, 1].map((item) => (
                  <span key={item}>
                    Full Stack Developer <i>✳</i> Systems Enthusiast <i>✳</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <section
          id="about"
          className="about section-space page-gutter"
          aria-labelledby="about-title"
        >
          <SectionLabel number="01">About</SectionLabel>
          <div className="about-layout">
            <h2 id="about-title">
              Who <br />
              am <em>I?</em>
            </h2>
            <div className="about-copy">
              <p className="intro-copy">
                I’m a Computer Science &amp; Engineering undergrad at{" "}
                <strong>IIT Indore</strong> focused on <span>practical AI</span>
                , <span>systems design</span>, and building high-performance
                software.
              </p>
              <p className="body-copy">
                I like learning how things work under the hood — whether it’s
                unraveling the complexities of <strong>neural networks</strong>{" "}
                or diving deep into low-level <strong>operating systems</strong>
                .
              </p>
              <div className="credentials">
                <div>
                  <span className="eyebrow">Experience</span>
                  <h3>Samsung R&amp;D (SRIB)</h3>
                  <p>Incoming Developer Intern</p>
                </div>
                <div>
                  <span className="eyebrow">Education</span>
                  <h3>IIT Indore</h3>
                  <p>B.Tech in Computer Science &amp; Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="skills"
          className="skills section-space page-gutter"
          aria-labelledby="skills-title"
        >
          <SectionLabel number="02">Skills</SectionLabel>
          <div className="section-heading">
            <h2 id="skills-title">
              Skills &amp; <em>Expertise</em>
            </h2>
            <span className="heading-symbol" aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="skills-grid">
            {skillCategories.map((category, i) => (
              <div className="skill-column" key={category.title}>
                <span className="skill-number">0{i + 1} /</span>
                <h3>{category.title}</h3>
                <ul>
                  {category.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <p className="competencies">
                  {category.skills.length} core competencies
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="projects"
          className="projects section-space page-gutter"
          aria-labelledby="projects-title"
        >
          <SectionLabel number="03">Projects</SectionLabel>
          <div className="section-heading">
            <h2 id="projects-title">
              Selected <em>Projects</em>
            </h2>
            <span className="project-count">(0{projects.length})</span>
          </div>
          <div className="project-list">
            {projects.map((project, i) => (
              <article className="project" key={project.name}>
                <span className="project-number">0{i + 1}</span>
                <div className="project-main">
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.desc}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <details className="project-details">
                    <summary>
                      Project details{" "}
                      <span className="details-icon" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <ul>
                      {project.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </details>
                </div>
                <div className="project-links">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} Live Demo`}
                    >
                      Live Demo <ArrowUpRight size={18} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.name} Source Code`}
                    >
                      Source Code <ArrowUpRight size={18} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="contributions page-gutter"
          aria-labelledby="github-title"
        >
          <div className="contribution-heading">
            <h2 id="github-title">
              <Github size={20} />
              GitHub Contributions
            </h2>
            <a
              className="text-link"
              href="https://github.com/saranshhalwai"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="contribution-graph">
            <Image
              unoptimized
              src="https://ghchart.rshah.org/b53b28/saranshhalwai"
              alt="GitHub contribution graph"
              width="1100"
              height="170"
              loading="lazy"
            />
          </div>
        </section>

        <section
          id="contact"
          className="contact page-gutter section-space"
          aria-labelledby="contact-title"
        >
          <SectionLabel number="04">Contact</SectionLabel>
          <div className="contact-top">
            <p>
              Always open to collaborations, system design discussions, or
              sharing memes.
            </p>
          </div>
          <h2 id="contact-title">
            Let&apos;s Build
            <br />
            <em>Something</em>
            <span className="contact-period">.</span>
          </h2>
          <div className="contact-actions">
            <a className="button-primary" href="mailto:saransh2304@gmail.com">
              Say Hello <ArrowUpRight size={19} />
            </a>
            <a className="text-link" href="/Resume.pdf" download>
              <Download size={17} />
              Download Résumé
            </a>
            <CopyEmail />
          </div>
          <div className="contact-bottom">
            <a className="email-link" href="mailto:saransh2304@gmail.com">
              saransh2304@gmail.com
            </a>
            <div className="social-links">
              <a
                href="https://github.com/saranshhalwai"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <ArrowUpRight size={15} />
              </a>
              <a
                href="https://linkedin.com/in/saransh-halwai-478346171"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <ArrowUpRight size={15} />
              </a>
              <a
                href="https://leetcode.com/u/saransh6/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LeetCode <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer page-gutter">
        <a href="#home" className="wordmark" aria-label="Back to top">
          sh<span>.</span>
        </a>
        <p>© {new Date().getFullYear()} Saransh Halwai</p>
        <a href="#home" className="text-link">
          Back to top <ArrowUpRight size={16} />
        </a>
      </footer>
    </>
  );
}
