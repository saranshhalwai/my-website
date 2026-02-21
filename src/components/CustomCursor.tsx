"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring physics for smooth cursor lagging effect
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Check if device supports hover (ignores touch devices like phones)
        if (window.matchMedia("(pointer: coarse)").matches) return;

        // Use a small timeout to avoid synchronous state update warning and ensure client-side execution
        const timer = setTimeout(() => setIsVisible(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16); // Center the 32px cursor
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if we are hovering over an interactive element
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [isVisible, cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 z-[100] w-8 h-8 rounded-full pointer-events-none mix-blend-difference hidden md:block"
            style={{
                x: smoothX,
                y: smoothY,
                backgroundColor: "white",
            }}
            animate={{
                scale: isHovering ? 2.5 : 1,
                opacity: isHovering ? 0.8 : 1,
            }}
            transition={{
                scale: { type: "spring", stiffness: 300, damping: 20 },
            }}
        />
    );
}
