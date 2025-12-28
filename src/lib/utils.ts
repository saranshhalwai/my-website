import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(useGSAP, ScrollSmoother, ScrollTrigger);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
