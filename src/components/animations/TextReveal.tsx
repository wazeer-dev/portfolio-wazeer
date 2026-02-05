"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export default function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = container.current;
        if (!el) return;

        gsap.fromTo(el,
            { y: "100%", opacity: 0 },
            {
                y: "0%",
                opacity: 1,
                duration: 1.5,
                ease: "power4.out",
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%", // Start animating when top of element hits 90% viewport height
                }
            }
        );
    }, [delay]);

    return (
        <div className={`overflow-hidden ${className}`}>
            <div ref={container} className="translate-y-full opacity-0">
                {children}
            </div>
        </div>
    );
}
