"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

// Called inside MotionDirector's GSAP context and reduced-motion media query.
export function animateSections() {
  const cleanup: (() => void)[] = [];
  let disposed = false;
  const refresh = () => {
    if (!disposed) ScrollTrigger.refresh();
  };
  const labels = gsap.utils.toArray<HTMLElement>(".section-label");
  labels.forEach((label) => {
    gsap.from(label, {
      x: -24,
      autoAlpha: 0,
      duration: 0.7,
      scrollTrigger: {
        trigger: label,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    });
    gsap.from(label.querySelector(".section-index"), {
      scale: 0.5,
      duration: 0.9,
      ease: "back.out(1.6)",
      scrollTrigger: {
        trigger: label,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    });
  });

  gsap.utils
    .toArray<HTMLElement>(".section-heading h2,.about h2")
    .forEach((heading) => {
      gsap.from(heading, {
        y: 65,
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    });

  const introduction = document.querySelector<HTMLElement>(".intro-copy");
  if (introduction) {
    const split = new SplitText(introduction, {
      type: "words",
      tag: "span",
      wordsClass: "reading-word",
    });
    gsap.fromTo(
      split.words,
      { opacity: 0.28 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: introduction,
          start: "top 86%",
          end: "bottom 50%",
          scrub: 0.45,
        },
      },
    );
    cleanup.push(() => split.revert());
  }
  gsap.fromTo(
    ".about h2 em",
    { "--accent-scale": 0 },
    {
      "--accent-scale": 1,
      ease: "power3.out",
      duration: 1.1,
      scrollTrigger: {
        trigger: ".about-layout",
        start: "top 75%",
        toggleActions: "play none none none",
      },
    },
  );
  gsap.from(".body-copy", {
    y: 30,
    autoAlpha: 0,
    duration: 0.9,
    scrollTrigger: {
      trigger: ".body-copy",
      start: "top 88%",
      toggleActions: "play none none none",
    },
  });
  gsap.fromTo(
    ".credentials",
    { "--credential-rule": 0 },
    {
      "--credential-rule": 1,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".credentials",
        start: "top 90%",
        toggleActions: "play none none none",
      },
    },
  );
  gsap.from(".credentials > div", {
    x: 25,
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.16,
    scrollTrigger: {
      trigger: ".credentials",
      start: "top 88%",
      toggleActions: "play none none none",
    },
  });

  gsap.utils.toArray<HTMLElement>(".skill-column").forEach((column, index) => {
    const entrance = gsap.timeline({
      scrollTrigger: {
        trigger: column,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
    entrance
      .from(column, {
        y: 45,
        autoAlpha: 0,
        duration: 0.8,
        delay: (index % 2) * 0.1,
        ease: "power3.out",
      })
      .from(
        column.querySelectorAll("li"),
        {
          x: -16,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.065,
          ease: "power2.out",
        },
        "-=.45",
      )
      .from(
        column.querySelector(".competencies"),
        { autoAlpha: 0, y: 8, duration: 0.5 },
        "-=.25",
      );
  });
  gsap.to(".heading-symbol", {
    rotation: 240,
    ease: "none",
    scrollTrigger: {
      trigger: ".skills",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });

  gsap.utils.toArray<HTMLElement>(".project").forEach((row) => {
    const entrance = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 91%",
        toggleActions: "play none none none",
      },
    });
    entrance
      .fromTo(
        row,
        { "--rule-scale": 0 },
        { "--rule-scale": 1, duration: 0.9, ease: "power3.out" },
      )
      .from(
        row.querySelector(".project-number"),
        { y: 18, autoAlpha: 0, duration: 0.6 },
        0.1,
      )
      .from(
        row.querySelector("h3"),
        {
          y: 35,
          clipPath: "inset(100% 0 0 0)",
          duration: 0.75,
          ease: "power3.out",
        },
        0.12,
      )
      .from(
        row.querySelectorAll(
          ".project-description,.project-details,.project-links",
        ),
        { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 },
        0.3,
      )
      .from(
        row.querySelectorAll(".project-tags > span"),
        { y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.035 },
        0.45,
      );

    // A row responds to both a pointer and focus on its actual controls.
    let hovered = false;
    let focused = false;
    let highlightTween: gsap.core.Tween | null = null;
    let titleTween: gsap.core.Tween | null = null;
    const respond = () => {
      const active = hovered || focused;
      highlightTween = gsap.to(row, {
        "--row-highlight": active ? 1 : 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
      titleTween = gsap.to(row.querySelector("h3"), {
        x: active ? 10 : 0,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        hovered = true;
        respond();
      }
    };
    const leave = () => {
      hovered = false;
      respond();
    };
    const focus = () => {
      focused = true;
      respond();
    };
    const blur = (event: FocusEvent) => {
      if (!row.contains(event.relatedTarget as Node | null)) {
        focused = false;
        respond();
      }
    };
    row.addEventListener("pointerenter", enter);
    row.addEventListener("pointerleave", leave);
    row.addEventListener("focusin", focus);
    row.addEventListener("focusout", blur);
    cleanup.push(() => {
      row.removeEventListener("pointerenter", enter);
      row.removeEventListener("pointerleave", leave);
      row.removeEventListener("focusin", focus);
      row.removeEventListener("focusout", blur);
      highlightTween?.kill();
      titleTween?.kill();
      gsap.set(row, { clearProps: "--row-highlight" });
      gsap.set(row.querySelector("h3"), { clearProps: "transform" });
    });

    const details = row.querySelector<HTMLDetailsElement>("details");
    const summary = details?.querySelector("summary");
    const body = details?.querySelector("ul");
    if (!details || !summary || !body) return;
    let expanded = details.open;
    let disclosure: gsap.core.Tween | null = null;
    const clearBody = () =>
      gsap.set(body, { clearProps: "height,overflow,opacity,marginTop" });
    const toggle = (event: MouseEvent) => {
      event.preventDefault();
      expanded = !expanded;
      disclosure?.kill();
      if (expanded) {
        const wasOpen = details.open;
        details.open = true;
        if (!wasOpen) gsap.set(body, { height: 0, opacity: 0, marginTop: 0 });
        gsap.set(body, { overflow: "hidden" });
        disclosure = gsap.to(body, {
          height: body.scrollHeight,
          opacity: 1,
          marginTop: 20,
          duration: 0.5,
          ease: "power3.out",
          onComplete: () => {
            clearBody();
            refresh();
          },
        });
      } else {
        gsap.set(body, {
          height: body.getBoundingClientRect().height,
          overflow: "hidden",
        });
        disclosure = gsap.to(body, {
          height: 0,
          opacity: 0,
          marginTop: 0,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => {
            details.open = false;
            clearBody();
            refresh();
          },
        });
      }
    };
    summary.addEventListener("click", toggle);
    cleanup.push(() => {
      summary.removeEventListener("click", toggle);
      disclosure?.kill();
      details.open = expanded;
      clearBody();
    });
  });

  gsap.from(".contribution-heading", {
    y: 20,
    autoAlpha: 0,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".contributions",
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
  gsap.from(".contribution-graph", {
    clipPath: "inset(0 100% 0 0)",
    duration: 1.3,
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: ".contribution-graph",
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });

  const contact = gsap.timeline({
    scrollTrigger: {
      trigger: "#contact-title",
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
  contact
    .from(".contact-top", { y: 20, autoAlpha: 0, duration: 0.7 })
    .from(
      "#contact-title",
      { y: 60, autoAlpha: 0, duration: 1, ease: "power3.out" },
      0.1,
    )
    .from(
      "#contact-title em",
      { x: -45, duration: 1.2, ease: "power3.out" },
      0.15,
    )
    .from(
      ".contact-period",
      { scale: 0, duration: 0.6, ease: "back.out(1.6)" },
      0.65,
    );
  gsap.from(".contact-actions > *", {
    y: 25,
    autoAlpha: 0,
    duration: 0.7,
    stagger: 0.12,
    scrollTrigger: {
      trigger: ".contact-actions",
      start: "top 94%",
      toggleActions: "play none none none",
    },
  });
  gsap.fromTo(
    ".contact-bottom",
    { "--contact-rule": 0 },
    {
      "--contact-rule": 1,
      duration: 1.1,
      scrollTrigger: {
        trigger: ".contact-bottom",
        start: "top 96%",
        toggleActions: "play none none none",
      },
    },
  );
  gsap.from(".email-link,.social-links > a", {
    y: 18,
    autoAlpha: 0,
    duration: 0.65,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".contact-bottom",
      start: "top 96%",
      toggleActions: "play none none none",
    },
  });
  gsap.from(".footer > *", {
    y: 12,
    autoAlpha: 0,
    duration: 0.7,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".footer",
      start: "top 99%",
      toggleActions: "play none none none",
    },
  });

  return () => {
    disposed = true;
    cleanup.forEach((dispose) => dispose());
  };
}
