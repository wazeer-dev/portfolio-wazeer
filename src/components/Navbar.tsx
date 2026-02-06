"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: "HOME", href: "/", label: "■ HOME" },
        { name: "WORK", href: "/work", label: "WORK" },
        { name: "CONTACT", href: "/contact", label: "CONTACT" },
        { name: "INFO", href: "/about", label: "INFO" },
    ];

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 px-8 py-8 flex justify-between items-start text-[10px] md:text-xs font-bold tracking-widest text-[#888] mix-blend-difference pointer-events-none select-none">
                {/* Left: Brand */}
                <div className="uppercase pointer-events-auto animate-fade-in-down delay-0">
                    <Link href="/" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                        WAZEER T.
                    </Link>
                </div>

                {/* Center-Right: Navigation (Desktop) */}
                <div className="absolute left-[60%] flex flex-col space-y-1 text-left hidden md:flex pointer-events-auto animate-fade-in-down delay-100">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "transition-colors duration-300",
                                    isActive ? "text-white" : "hover:text-white"
                                )}
                            >
                                {link.name === "HOME" ? `■ ${link.name}` : link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Right: Year */}
                <div className="animate-fade-in-down delay-200">[2026]</div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden pointer-events-auto animate-fade-in-down delay-300">
                    <button onClick={toggleMenu} className="text-white mix-blend-normal hover:text-[#d4af37] transition-colors uppercase font-black tracking-widest text-xs">
                        {isMenuOpen ? "CLOSE" : "MENU"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden",
                isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div className="flex flex-col space-y-8 text-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-4xl font-black text-white hover:text-[#d4af37] transition-colors tracking-tighter"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

export default memo(Navbar);
