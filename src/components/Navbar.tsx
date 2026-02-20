"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ModeToggle } from "@/components/mode-toggle";

const links = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${scrolled
                ? "bg-white/70 dark:bg-black/50 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <a href="#" className="text-xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity">
                Saransh Halwai
            </a>
            <nav className="flex items-center gap-6">
                {links.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="text-sm font-sans font-medium text-zinc-600 hover:text-indigo-500 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors"
                    >
                        {link.name}
                    </a>
                ))}
                <ModeToggle />
            </nav>
        </motion.header>
    );
}
