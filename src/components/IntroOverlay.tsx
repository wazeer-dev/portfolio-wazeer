"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface IntroOverlayProps {
    onEnter: () => void;
    isLoading?: boolean;
}

export default function IntroOverlay({ onEnter, isLoading = false }: IntroOverlayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
        if (isLoading) return;
        // Play Sound
        const audio = new Audio("/ncprime-keyboard-typing-one-short-1-292590.mp3");
        audio.volume = 0.5;
        audio.play().catch((e) => console.error("Audio play failed", e));

        const tl = gsap.timeline({
            onComplete: () => {
                onEnter();
            }
        });

        // 1. Button Feedback
        tl.to(buttonRef.current, {
            scale: 0.9,
            duration: 0.1,
            ease: "power1.out"
        })
            .to(buttonRef.current, {
                opacity: 0,
                scale: 1.5, // Explode effect
                filter: "blur(10px)",
                duration: 0.4,
                ease: "power2.in"
            });

        // 2. Title Exit
        tl.to(titleRef.current, {
            y: -50,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            stagger: 0.1
        }, "-=0.3");

        // 3. Container Wipe/Fade
        tl.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
        }, "-=0.2");
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
            <div className="flex flex-col items-center">
                <h1
                    ref={titleRef}
                    className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-12 text-center mix-blend-difference"
                >
                    WAZEER T
                </h1>

                {/* Cyber/Terminal Button Design */}
                <button
                    ref={buttonRef}
                    onClick={handleClick}
                    disabled={isLoading}
                    className={cn(
                        "group relative px-8 py-4 bg-transparent overflow-hidden rounded-md transition-all duration-300",
                        isLoading ? "opacity-50 cursor-wait" : "hover:scale-105 active:scale-95 cursor-pointer"
                    )}
                >
                    {/* Border Gradient/Glow */}
                    <div className={cn(
                        "absolute inset-0 border rounded-md transition-colors duration-300",
                        isLoading ? "border-white/10" : "border-white/20 group-hover:border-orange-500/50"
                    )} />

                    {/* Fill Effect */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Text Content */}
                    <div className="relative flex items-center space-x-3">
                        <span className={cn("w-1.5 h-1.5 rounded-full", isLoading ? "bg-gray-500" : "bg-orange-500 animate-pulse")} />
                        <span className={cn(
                            "text-sm md:text-base font-mono font-bold tracking-[0.2em] transition-colors duration-300",
                            isLoading ? "text-gray-500" : "text-white group-hover:text-orange-500"
                        )}>
                            {isLoading ? "SYSTEM LOADING..." : "INITIALIZE SYSTEM"}
                        </span>
                        <span className={cn("w-1.5 h-1.5 rounded-full", isLoading ? "bg-gray-500" : "bg-orange-500 animate-pulse")} />
                    </div>

                    {/* Scanline Effect (Optional subtle detail) */}
                    {!isLoading && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:animate-scan" />}
                </button>
            </div>
        </div>
    );
}
