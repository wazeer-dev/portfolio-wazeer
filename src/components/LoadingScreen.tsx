"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = "hidden";

        // Animation sequence
        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
                document.body.style.overflow = ""; // Restore scrolling
            }
        });

        // Initial state
        tl.to(".loading-text", {
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        })
            .to(".loading-container", {
                opacity: 0,
                duration: 1.5,
                delay: 1.5, // Keep visible for a moment
                ease: "power2.inOut",
                pointerEvents: "none"
            });

        return () => {
            gsap.killTweensOf(".loading-container");
            document.body.style.overflow = "";
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="loading-container fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/IMG_7218 (1).jpg"
                    alt="Loading Background"
                    className="w-full h-full object-cover opacity-60 grayscale contrast-125 scale-105 animate-pulse-slow"
                    style={{ objectPosition: "50% 25%" }}
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 z-[1] bg-[url('/noise.png')] opacity-30 mix-blend-overlay pointer-events-none" />

            {/* Content using flex-col to stack vertically like the About/Footer style */}
            <div className="relative z-10 flex flex-col items-center space-y-4 mix-blend-difference px-4">

                {/* Chinese Text with Corners */}
                <div className="loading-text opacity-0 relative flex flex-col items-center space-y-2 my-6">
                    {/* Corners */}
                    <div className="absolute -top-6 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]" />
                    <div className="absolute -top-6 -right-4 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]" />
                    <div className="absolute -bottom-6 -left-4 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]" />
                    <div className="absolute -bottom-6 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]" />

                    {/* Vertical Characters - Exact Match to About Page */}
                    <span className="text-white font-serif text-4xl md:text-8xl font-bold font-black drop-shadow-2xl opacity-90" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                        簡
                    </span>
                    <span className="text-gray-300 font-serif text-4xl md:text-8xl font-bold font-black drop-shadow-2xl opacity-90" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                        介
                    </span>
                </div>

                {/* English Text */}
                <div className="loading-text opacity-0 flex items-center space-x-4">
                    <span className="h-[1px] w-12 bg-white/50" />
                    <span className="text-sm md:text-xl font-mono text-white tracking-[0.5em] uppercase">
                        Loading
                    </span>
                    <span className="h-[1px] w-12 bg-white/50" />
                </div>

                {/* Progress/Decorative Element (Optional) */}
                <div className="loading-text opacity-0 mt-8">
                    <div className="w-1 h-12 bg-[#d4af37]/80 animate-pulse" />
                </div>

            </div>
        </div>
    );
}
