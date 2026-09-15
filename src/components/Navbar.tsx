"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X } from "lucide-react";

const links = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled || mobileOpen
                ? "bg-white/80 dark:bg-black/70 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <a href="#" className="text-xl font-serif font-semibold text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity">
                    Saransh Halwai
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
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

                {/* Mobile Navigation Trigger & Toggle */}
                <div className="flex md:hidden items-center gap-3">
                    <ModeToggle />
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        className="p-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Slide-Down Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden border-t border-zinc-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl px-6 py-6 overflow-hidden"
                    >
                        <nav className="flex flex-col gap-4">
                            {links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-base font-sans font-medium text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
