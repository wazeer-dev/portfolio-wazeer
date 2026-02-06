"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import TextReveal from "@/components/animations/TextReveal";

export default function AboutPage() {
    return (
        <main className="min-h-screen w-full relative selection:bg-orange-500 selection:text-white font-sans">
            <Navbar />

            {/* Global Fixed Background Image for the Entire Page */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/IMG_7218 (1).jpg"
                    alt="Profile Background"
                    className="w-full h-full object-cover opacity-50 grayscale contrast-125 block"
                />
                {/* Grain/Noise Overlay */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Header handled globally by Navbar now */}

            {/* Section 1: IN FO Hero (Scrollable) */}
            <section className="relative h-screen w-full overflow-hidden z-10 pointer-events-none">
                {/* Content Layer */}
                <div className="relative w-full h-full flex justify-between items-center px-2 md:px-12 pointer-events-auto">

                    {/* Left Text: IN */}
                    <div className="flex-1 text-left pl-4 md:pl-12">
                        <TextReveal className="p-2">
                            <h1 className="text-[20vw] font-black text-[#e0e0e0] leading-none tracking-tighter select-none mix-blend-overlay whitespace-nowrap">
                                IN
                            </h1>
                        </TextReveal>
                    </div>

                    {/* Center: Chinese Text & Detail */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20">
                        <div className="relative flex flex-col items-center space-y-2">
                            {/* ... (Brackets remain same) ... */}
                            {/* Use reduced size if needed, but keeping center iconic for now. Let's just wrap the whole thing if requested, but "IN FO" was the main oversized element. */}
                            <div className="absolute -top-6 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]" />
                            <div className="absolute -top-6 -right-4 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]" />

                            <span className="text-[#d4af37] font-serif text-4xl md:text-8xl font-bold font-black drop-shadow-2xl opacity-90" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                                簡
                            </span>
                            <span className="text-orange-500/80 font-serif text-4xl md:text-8xl font-bold font-black drop-shadow-2xl opacity-90" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                                介
                            </span>

                            <div className="absolute -bottom-6 -left-4 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]" />
                            <div className="absolute -bottom-6 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]" />
                        </div>
                    </div>

                    {/* Right Text: FO */}
                    <div className="flex-1 text-right pr-4 md:pr-12">
                        <TextReveal delay={0.2} className="p-2">
                            <h1 className="text-[20vw] font-black text-[#e0e0e0] leading-none tracking-tighter select-none mix-blend-overlay whitespace-nowrap">
                                FO
                            </h1>
                        </TextReveal>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest animate-bounce pointer-events-auto z-50 mix-blend-difference">
                    SCROLL
                </div>
            </section>

            {/* Section 2: Bio / Text (Scroll Content) */}
            {/* Added extra margin top to push it well below the fold initially, and transparent background to show image */}
            <section className="relative z-10 w-full min-h-screen py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden mt-0 bg-black/40 backdrop-blur-sm">

                <div className="relative z-10 max-w-7xl mx-auto space-y-6">
                    <TextReveal>
                        <h2 className="text-3xl md:text-7xl lg:text-8xl font-black text-[#e0e0e0] leading-none tracking-tighter uppercase drop-shadow-2xl font-sans">
                            A <span className="text-[#d4af37] inline-block hover:scale-105 transition-transform duration-500 cursor-default">[CREATIVE]</span> PERSPECTIVE SHAPED <br />
                            BY <span className="font-serif italic text-[#d4af37] px-2 font-light tracking-normal hover:tracking-widest transition-all duration-700 cursor-default" style={{ fontFamily: 'var(--font-playfair)' }}>Kasaragod</span> ROOTS AND <br />
                            AN <span className="font-serif italic text-[#d4af37] px-2 font-light tracking-normal hover:tracking-widest transition-all duration-700 cursor-default" style={{ fontFamily: 'var(--font-playfair)' }}>Antigravity</span> VISION
                        </h2>
                    </TextReveal>

                    <div className="overflow-hidden mt-0 md:mt-2">
                        <p className="text-sm md:text-lg font-mono text-[#ccc] max-w-2xl mx-auto leading-relaxed drop-shadow-md mix-blend-screen opacity-80 hover:opacity-100 transition-opacity duration-500">
                            A design approach led by curiosity, emotion, and empathy. <br />
                            All digital experiences created are crafted to be intuitive, <br />
                            fluid, and memorably stylistic.
                        </p>
                    </div>

                    <div className="pt-8 animate-fade-in-up delay-300">
                        <button className="px-8 py-3 bg-[#d4af37] text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300">
                            Read My Story
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
