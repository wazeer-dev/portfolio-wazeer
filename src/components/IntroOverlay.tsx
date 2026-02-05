"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Magnetic from "@/components/animations/Magnetic";

const EarthScene = dynamic(() => import("./EarthScene"), { ssr: false });

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
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
            <EarthScene />

            <div className="flex flex-col items-center relative z-10 grid-bg">
                <h1
                    ref={titleRef}
                    className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-12 text-center mix-blend-difference"
                >
                    WAZEER T
                </h1>

                {/* Magnetic Circular Button */}
                <Magnetic>
                    <button
                        ref={buttonRef}
                        onClick={handleClick}
                        disabled={isLoading}
                        className={cn(
                            "relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md bg-white/5 transition-all duration-500 overflow-hidden group mix-blend-difference",
                            isLoading ? "cursor-wait opacity-50" : "cursor-pointer hover:border-orange-500"
                        )}
                    >
                        {/* Hover Fill */}
                        <div className="absolute inset-0 bg-orange-500 rounded-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />

                        {/* Text Content */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            {isLoading ? (
                                <span className="text-[10px] uppercase font-bold text-neutral-400 animate-pulse">Loading</span>
                            ) : (
                                <>
                                    <span className="text-sm md:text-base font-bold tracking-widest text-white group-hover:text-black transition-colors duration-300">ENTER</span>
                                    <span className="w-1 h-1 bg-white rounded-full group-hover:bg-black transition-colors duration-300" />
                                </>
                            )}
                        </div>
                    </button>
                </Magnetic>
            </div>
        </div>
    );
}
