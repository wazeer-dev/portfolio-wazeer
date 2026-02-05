"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { ImageProps } from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps extends Omit<ImageProps, "className"> {
    containerClassName?: string;
    imageClassName?: string;
    speed?: number; // 0 to 1, higher is faster (relative to scroll) or "deeper"
}

export default function ParallaxImage({ containerClassName = "", imageClassName = "", speed = 0.1, ...props }: ParallaxImageProps) {
    const container = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const el = container.current;
        const img = imgRef.current;
        if (!el || !img) return;

        // Parallax logic: Move the image slightly counter to scroll
        gsap.fromTo(img,
            { y: "-10%" },
            {
                y: "10%",
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom", // Start when container enters viewport
                    end: "bottom top",   // End when container leaves viewport
                    scrub: true,         // Link animation progress to scroll bar
                }
            }
        );
    }, [speed]);

    return (
        <div ref={container} className={`overflow-hidden relative ${containerClassName}`}>
            {/* Wrap Image in a div or use ref directly if possible. Next/Image requires tricky ref handling sometimes. */}
            <div ref={imgRef as any} className="w-full h-[120%] -translate-y-[10%] relative">
                <Image
                    {...props}
                    className={`object-cover ${imageClassName}`}
                    fill
                />
            </div>
        </div>
    );
}
