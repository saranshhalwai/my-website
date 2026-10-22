"use client";

import ShaderField from "./ShaderField";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy, Menu, X } from "lucide-react";

const links = ["About", "Skills", "Projects", "Contact"];

export function Navigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <a href="#home" className="wordmark" aria-label="Saransh Halwai, home">
        sh<span>.</span>
      </a>
      <a className="header-name" href="#home">
        Saransh Halwai
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`}>
            {link}
          </a>
        ))}
      </nav>
      <a className="header-contact" href="mailto:saransh2304@gmail.com">
        Say Hello <ArrowUpRight size={15} />
      </a>
      <button
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {links.map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
            >
              <span>0{i + 1}</span>
              {link}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

export function KineticSculpture() {
  return (
    <div className="sculpture shader-sculpture" aria-hidden="true">
      <ShaderField />
      <span className="sculpture-coordinate coordinate-top">
        SOUND / FORM / FREQUENCY
      </span>
    </div>
  );
}

export function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText("saransh2304@gmail.com");
      setState("copied");
    } catch {
      setState("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2500);
  }
  return (
    <>
      <button className="text-link" onClick={copy}>
        {state === "copied" ? <Check size={16} /> : <Copy size={16} />}
        <span aria-live="polite">
          {state === "copied" ? "Copied!" : "Copy Email"}
        </span>
      </button>
      {state === "error" && (
        <span role="status" className="copy-error">
          Couldn’t copy. Email: saransh2304@gmail.com
        </span>
      )}
    </>
  );
}

export function ScrollCue() {
  return (
    <a href="#about" className="scroll-cue" aria-label="Scroll to About">
      <ArrowDown size={20} />
    </a>
  );
}
