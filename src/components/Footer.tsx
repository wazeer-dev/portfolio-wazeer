"use client";

import React, { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Footer() {
    const router = useRouter();

    return (
        <footer className="w-full bg-black py-20 px-6 border-t border-white/10 text-[#e0e0e0] overflow-hidden relative group">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/412951420_301ec47f-fef1-488e-aa7f-4679d1bc4e1c.jpg"
                    alt="Footer Background"
                    className="w-full h-full object-cover opacity-30 blur-sm grayscale hover:grayscale-0 transition-all duration-700 block"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                {/* Left: Call to Action */}
                <div className="flex flex-col space-y-2 max-w-lg">
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                        Let's Create <br />
                        <span className="font-serif italic text-5xl md:text-6xl text-[#d4af37] font-light" style={{ fontFamily: 'var(--font-playfair)' }}>Something</span> Unique.
                    </h3>
                    <p className="pt-6 text-gray-400 font-mono text-sm max-w-xs leading-relaxed">
                        Open for collaborations and freelance projects. <br />
                        Based in Kasaragod, creating worldwide.
                    </p>
                    <a href="mailto:wazeert13@gmail.com" className="inline-block mt-8 text-lg font-bold border-b border-[#d4af37] pb-1 w-max hover:text-[#d4af37] transition-colors">
                        wazeert13@gmail.com
                    </a>
                </div>

                {/* Right: Grid */}
                <div className="flex gap-16 md:gap-32">
                    {/* Socials */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="font-serif italic text-2xl text-[#d4af37]" style={{ fontFamily: 'var(--font-playfair)' }}>Connect</h3>
                        <div className="flex flex-col space-y-2 text-sm font-bold tracking-widest uppercase">
                            <Link href="https://www.linkedin.com/in/waz1r-t-936617385/" target="_blank" className="hover:text-[#d4af37] transition-colors">LinkedIn</Link>
                            <Link href="https://github.com/wazeer-dev" target="_blank" className="hover:text-[#d4af37] transition-colors">GitHub</Link>
                            <Link href="https://www.instagram.com/v4zee_r/" target="_blank" className="hover:text-[#d4af37] transition-colors">Instagram</Link>
                            <Link href="https://wa.me/919497483212" target="_blank" className="hover:text-[#d4af37] transition-colors">WhatsApp</Link>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="font-serif italic text-2xl text-[#d4af37]" style={{ fontFamily: 'var(--font-playfair)' }}>Explore</h3>
                        <div className="flex flex-col space-y-2 text-sm font-bold tracking-widest uppercase">
                            <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
                            <Link href="/work" className="hover:text-[#d4af37] transition-colors">Work</Link>
                            <Link href="/about" className="hover:text-[#d4af37] transition-colors">Info</Link>
                            <Link href="/contact" className="hover:text-[#d4af37] transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Brand & Copyright */}
            <div className="relative z-10 max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-end">
                <div className="flex flex-col">
                    <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-white/5 select-none pointer-events-none">
                        WAZEER
                    </h1>
                </div>

                <div className="flex flex-col items-end pb-4 text-xs font-mono text-gray-600 text-right">
                    <p className="mb-2">Local Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    <p
                        className="cursor-pointer hover:text-white transition-colors"
                        onDoubleClick={() => router.push("/admin")}
                        title="Admin Access"
                    >
                        © 2026 Wazeer T. All Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default memo(Footer);
