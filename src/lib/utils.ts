import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(useGSAP, ScrollSmoother, ScrollTrigger);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export {gsap, useGSAP};