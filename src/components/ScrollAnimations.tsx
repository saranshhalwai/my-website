"use client";

import { useEffect } from "react";

// Minimal local types to avoid importing non-existent named types from gsap
type GsapLike = {
  context: (fn: () => void, scope?: Element | Document) => { revert: () => void };
  utils: { toArray: <T = Element>(selector: string) => T[] };
  fromTo: (target: Element | Element[] | string, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => void;
  registerPlugin: (plugin: unknown) => void;
};

export default function ScrollAnimations() {
  useEffect(() => {
    let gsapLib: GsapLike | null = null;
    let ScrollTrigger: unknown = null;
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const mod = await import("gsap");
      // prefer named export but fall back to default
      const modAny = mod as unknown as { gsap?: GsapLike; default?: GsapLike };
      gsapLib = modAny.gsap || modAny.default || (mod as unknown as GsapLike);

      const st = await import("gsap/ScrollTrigger");
      const stAny = st as unknown as { ScrollTrigger?: unknown; default?: unknown };
      ScrollTrigger = stAny.ScrollTrigger || stAny.default || st;

      if (!gsapLib) return;
      // register plugin (cast to unknown to satisfy types)
      gsapLib.registerPlugin(ScrollTrigger as unknown as object);

      // create a context so animations are scoped to this component
      ctx = gsapLib.context(() => {
        // individual targets (default behavior)
        const targets = gsapLib!.utils.toArray<HTMLElement>(".animate-on-scroll");
        targets.forEach((el: HTMLElement) => {
          // skip elements that are inside a stagger container; they'll be handled separately
          if (el.closest(".animate-stagger")) return;

          gsapLib!.fromTo(
            el,
            { autoAlpha: 0, y: 30 },
            {
              duration: 0.8,
              autoAlpha: 1,
              y: 0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });

        // stagger containers: animate direct children with a small stagger
        const staggerContainers = gsapLib!.utils.toArray<HTMLElement>(".animate-stagger");
        staggerContainers.forEach((container: HTMLElement) => {
          const children = Array.from(container.children) as HTMLElement[];
          if (!children.length) return;
          gsapLib!.fromTo(
            children,
            { autoAlpha: 0, y: 30 },
            {
              duration: 0.8,
              autoAlpha: 1,
              y: 0,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: {
                trigger: container,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }, document.body);
    };

    init();

    return () => {
      try {
        if (ctx) ctx.revert();
        // ScrollTrigger may not have kill on the module object; attempt defensively
        const st = ScrollTrigger as unknown as { kill?: () => void };
        if (st && typeof st.kill === "function") {
          st.kill();
        }
      } catch {
        // no-op
      }
    };
  }, []);

  return null;
}
