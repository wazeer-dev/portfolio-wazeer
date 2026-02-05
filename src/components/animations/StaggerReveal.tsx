"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StaggerRevealProps {
    children: React.ReactNode;
    className?: string;
    stagger?: number;
    delay?: number;
}

export default function StaggerReveal({ children, className = "", stagger = 0.2, delay = 0 }: StaggerRevealProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = container.current;
        if (!el) return;

        // Select all direct children
        const items = el.children;

        gsap.fromTo(items,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: stagger,
                ease: "power3.out",
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // Start when top of container hits 85% of viewport
                }
            }
        );
    }, [stagger, delay]);

    return (
        <div ref={container} className={className}>
            {/* 
               We render children as-is. 
               The GSAP animation will target these immediate children in the DOM.
            */}
            {children}
        </div>
    );
}
