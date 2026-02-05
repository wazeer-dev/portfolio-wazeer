"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import Magnetic from "@/components/animations/Magnetic";

export default function Navbar() {
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

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white focus:outline-none z-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    )}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-300 md:hidden pointer-events-auto",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-2xl font-bold text-white hover:text-orange-500 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}
                <Link
                    href="/hire"
                    className="bg-orange-600 text-white text-xl font-bold px-8 py-3 rounded-full hover:bg-orange-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    Hire Me
                </Link>
            </div>
        </div>
    );
}
