"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroBackground() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem("heroImage");
        if (saved) {
          setSrc(saved);
          return;
        }
        // fallback to public/hero.jpg if present
        setSrc("/hero.jpg");
      } catch {
        setSrc("/hero.jpg");
      }
    };

    read();

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.src) setSrc(detail.src);
      else {
        const saved = localStorage.getItem("heroImage");
        setSrc(saved || "/hero.jpg");
      }
    };

    window.addEventListener("heroImageChanged", handler as EventListener);
    return () => window.removeEventListener("heroImageChanged", handler as EventListener);
  }, []);

  if (!src) return null;

  const isDataUrl = src.startsWith("data:");

  return (
    <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0">
        {isDataUrl ? (
          <img
            src={src}
            alt="hero background"
            className="w-full h-full object-cover opacity-70 dark:opacity-40"
            style={{ filter: "brightness(0.85) saturate(0.95)" }}
          />
        ) : (
          <Image
            src={src}
            alt="hero background"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-70 dark:opacity-40"
            style={{ objectPosition: "center" }}
          />
        )}

        {/* fade into the site's background color (respects light/dark via --background) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, var(--background) 85%)",
          }}
        />
      </div>
    </div>
  );
}
