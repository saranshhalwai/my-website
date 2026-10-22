"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { animateSections } from "./SectionMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function MotionDirector() {
  const progress = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      document.documentElement.classList.add("has-motion");
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .fromTo(
          ".hero-greeting",
          { y: 35, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.85 },
          0.1,
        )
        .fromTo(
          "#hero-title > span",
          { yPercent: 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.4,
            stagger: 0.13,
          },
          0.18,
        )
        .fromTo(
          ".shader-sculpture",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1.8 },
          0.2,
        )
        .fromTo(
          ".hero-status,.hero-bottom > *",
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09 },
          0.8,
        );

      gsap.to(progress.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
      });
      const cleanupSections = animateSections();
      gsap.to(".type-marquee-track", {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      const interactive = gsap.matchMedia();
      interactive.add("(min-width: 900px) and (pointer: fine)", () => {
        const hero = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=80%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        hero
          .to(
            "#hero-title > span:first-child",
            { xPercent: -13, ease: "none" },
            0,
          )
          .to(
            "#hero-title > span:last-child",
            { xPercent: 16, ease: "none" },
            0,
          )
          .to(
            ".shader-sculpture",
            { scale: 1.65, rotate: 35, xPercent: -22, ease: "none" },
            0,
          )
          .to(
            ".hero-greeting,.hero-status",
            { y: -55, autoAlpha: 0, ease: "none" },
            0,
          )
          .to("#hero-title", { autoAlpha: 0.15, ease: "none" }, 0.4);
        const cleanups: (() => void)[] = [];
        gsap.utils
          .toArray<HTMLElement>(
            ".button-primary,.scroll-cue,.project-links a,.record-button",
          )
          .forEach((element) => {
            const x = gsap.quickTo(element, "x", {
                duration: 0.5,
                ease: "power3.out",
              }),
              y = gsap.quickTo(element, "y", {
                duration: 0.5,
                ease: "power3.out",
              });
            const move = (event: PointerEvent) => {
              const r = element.getBoundingClientRect();
              x((event.clientX - r.left - r.width / 2) * 0.18);
              y((event.clientY - r.top - r.height / 2) * 0.22);
            };
            const leave = () => {
              x(0);
              y(0);
            };
            element.addEventListener("pointermove", move);
            element.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              element.removeEventListener("pointermove", move);
              element.removeEventListener("pointerleave", leave);
            });
          });
        return () => cleanups.forEach((cleanup) => cleanup());
      });
      const refresh = () => ScrollTrigger.refresh();
      let active = true;
      document.fonts.ready.then(() => {
        if (active) refresh();
      });
      // Expanding a project's full description changes every later scroll position.
      document.addEventListener("toggle", refresh, true);
      return () => {
        active = false;
        interactive.revert();
        cleanupSections();
        document.removeEventListener("toggle", refresh, true);
        document.documentElement.classList.remove("has-motion");
      };
    });
    return () => media.revert();
  });
  return <div className="reading-progress" ref={progress} aria-hidden="true" />;
}
