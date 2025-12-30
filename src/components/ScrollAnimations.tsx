"use client"

import {gsap, useGSAP} from "../lib/utils"
import {ReactNode, useRef} from "react";
type Props = {
  children: ReactNode;
};

export default function ScrollAnimations({children}: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
      () => {
        gsap.utils.toArray<HTMLElement>(".animate-on-scroll").forEach(el => {
          if (el.closest(".animate-stagger")) return;

          gsap.fromTo(el, { autoAlpha: 0, y: 30 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".animate-stagger").forEach(container => {
          gsap.fromTo(container.children, { autoAlpha: 0, y: 30 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        });
      },
      { scope }
  );

  return <div ref={scope}>{children}</div>;
}
