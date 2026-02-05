"use client";

import React, { useEffect, useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface InfiniteMarqueeProps {
    items: string[] | React.ReactNode[];
    direction?: "left" | "right";
    speed?: number; // Seconds per item (approx) or time for full loop? Let's use duration multiplier.
    className?: string;
}

function InfiniteMarquee({ items, direction = "left", speed = 5, className = "" }: InfiniteMarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        if (!container || !text) return;

        // Duplicate content to ensure seamless loop
        // We need enough width to cover screen + buffer.
        // A simple way is to use GSAP's horizontalLoop helper logic simplified:
        // Or just a simple tween: move x from 0 to -50% (if duplicated once)

        const contentWidth = text.offsetWidth;

        let ctx = gsap.context(() => {
            const totalWidth = text.scrollWidth;

            // We animate the 'text' container which holds 2 sets of items
            // Move from 0 to -50% of its width
            gsap.to(text, {
                x: direction === "left" ? `-${totalWidth / 2}px` : "0px",
                startAt: { x: direction === "left" ? "0px" : `-${totalWidth / 2}px` },
                ease: "none",
                duration: items.length * speed, // Duration based on item count to allow consistent speed
                repeat: -1,
                // Optional: ScrollTrigger to speed up on scroll
                // scrollTrigger: {
                //     trigger: container,
                //     start: "top bottom",
                //     end: "bottom top",
                //     onUpdate: (self) => {
                //        // Could modify timeScale
                //     }
                // }
            });
        }, container);

        return () => ctx.revert();
    }, [items, direction, speed]);

    return (
        <div ref={containerRef} className={`w-full overflow-hidden whitespace-nowrap overflow-x-hidden ${className}`}>
            <div ref={textRef} className="inline-flex items-center">
                {/* Original Set */}
                {items.map((item, i) => (
                    <div key={`orig-${i}`} className="inline-block mx-8 md:mx-12 opacity-80 hover:opacity-100 transition-opacity">
                        {item}
                    </div>
                ))}

                {/* Duplicate Set for Loop */}
                {items.map((item, i) => (
                    <div key={`dup-${i}`} className="inline-block mx-8 md:mx-12 opacity-80 hover:opacity-100 transition-opacity">
                        {item}
                    </div>
                ))}
                {/* Triplicate Set for huge screens if needed (safer) */}
                {items.map((item, i) => (
                    <div key={`trip-${i}`} className="inline-block mx-8 md:mx-12 opacity-80 hover:opacity-100 transition-opacity">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(InfiniteMarquee);
