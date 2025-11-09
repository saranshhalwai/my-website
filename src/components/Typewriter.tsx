"use client";

import { useEffect, useRef } from "react";

type Props = {
  text: string;
  speed?: number; // ms per character
  className?: string;
};

export default function Typewriter({ text, speed = 60, className }: Props) {
  const elRef = useRef<HTMLSpanElement | null>(null);
  const indexRef = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const typedRef = useRef(false);

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;

    const type = () => {
      if (indexRef.current >= text.length) return;
      node.textContent = text.slice(0, indexRef.current + 1);
      indexRef.current += 1;
      setTimeout(type, speed);
    };

    const onIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !typedRef.current) {
          typedRef.current = true;
          type();
        }
      }
    };

    observerRef.current = new IntersectionObserver(onIntersect, { root: null, threshold: 0.1 });
    observerRef.current.observe(node);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [text, speed]);

  return <span ref={elRef} className={className} aria-label={text} />;
}

