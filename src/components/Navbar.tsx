"use client";

import React, { useState, memo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import Magnetic from "@/components/animations/Magnetic";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Work", href: "/work" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <nav className="pointer-events-auto flex items-center justify-between px-6 py-3 w-[90%] max-w-5xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-2xl transition-all duration-300 relative z-50">
                {/* Left: Brand */}
                <Magnetic>
                    <Link href="/" className="inline-block text-white font-bold tracking-wider hover:text-orange-500 transition-colors z-50" onClick={() => setIsOpen(false)}>
                        PORTFOLIO
                    </Link>
                </Magnetic>

                {/* Center: Desktop Links */}
                <div className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-medium text-white/80">
                    {navLinks.map((link) => (
                        <Magnetic key={link.name}>
                            <Link
                                href={link.href}
                                className="inline-block px-4 py-2 hover:text-orange-500 transition-colors"
                            >
                                {link.name}
                            </Link>
                        </Magnetic>
                    ))}
                </div>

                {/* Right: CTA (Desktop) */}
                <div className="hidden md:block">
                    <Magnetic>
                        <Link
                            href="/hire"
                            className="inline-block bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
                        >
                            Hire Me
                        </Link>
                    </Magnetic>
                </div>

                {/* Mobile Menu Toggle (Animated Hamburger) */}
                <button
                    className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 group"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={cn(
                        "w-6 h-0.5 bg-white transition-all duration-300 ease-out",
                        isOpen ? "rotate-45 translate-y-2" : "group-hover:w-8"
                    )} />
                    <span className={cn(
                        "w-6 h-0.5 bg-white transition-all duration-300 ease-out",
                        isOpen ? "opacity-0" : ""
                    )} />
                    <span className={cn(
                        "w-6 h-0.5 bg-white transition-all duration-300 ease-out",
                        isOpen ? "-rotate-45 -translate-y-2" : "group-hover:w-4"
                    )} />
                </button>
            </nav>

            {/* Premium Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden pointer-events-auto",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none delay-200"
            )}>
                {/* Background Grid/Noise */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />

                <div className="flex flex-col space-y-8 text-center relative z-10">
                    {navLinks.map((link, index) => (
                        <div key={link.name} className="overflow-hidden">
                            <Link
                                href={link.href}
                                className={cn(
                                    "block text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter transition-all duration-500 transform",
                                    isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                                )}
                                style={{ transitionDelay: `${index * 100}ms` }}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="text-sm font-mono text-orange-500 block mb-2 tracking-widest opacity-70">0{index + 1}</span>
                                {link.name}
                            </Link>
                        </div>
                    ))}

                    <div className="overflow-hidden pt-8">
                        <Link
                            href="/hire"
                            className={cn(
                                "inline-block px-8 py-4 border border-white/20 rounded-full text-xl font-bold text-white hover:bg-white hover:text-black transition-all duration-500 transform",
                                isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                            )}
                            style={{ transitionDelay: "400ms" }}
                            onClick={() => setIsOpen(false)}
                        >
                            Start Project
                        </Link>
                    </div>
                </div>

                {/* Footer Info */}
                <div className={cn(
                    "absolute bottom-10 left-0 right-0 text-center text-white/30 text-xs font-mono transition-opacity duration-500",
                    isOpen ? "opacity-100 delay-500" : "opacity-0"
                )}>
                    &copy; 2026 WAZEER T.
                </div>
            </div>
        </div>
    );
}

export default memo(Navbar);
