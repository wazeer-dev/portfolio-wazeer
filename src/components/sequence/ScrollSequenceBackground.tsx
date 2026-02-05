"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SEQUENCES } from "@/lib/sequences";

interface ScrollSequenceBackgroundProps {
    sequenceId: string;
}

const getFrameUrl = (i: number, config: (typeof SEQUENCES)[0]) => {
    return `${config.folder}/frame_${String(i).padStart(config.padding, "0")}${config.suffix}.webp`;
};

export default function ScrollSequenceBackground({ sequenceId }: ScrollSequenceBackgroundProps) {
    const sequenceConfig = SEQUENCES.find((s) => s.id === sequenceId) || SEQUENCES[0];
    const containerRef = useRef<HTMLDivElement>(null);

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Store valid URLs
    const validUrlsRef = useRef<string[]>([]);

    // Buffer state
    const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
    const [slot0Src, setSlot0Src] = useState<string>("");
    const [slot1Src, setSlot1Src] = useState<string>("");

    // Refs for animation loop
    const frameRef = useRef(0);

    useEffect(() => {
        // 1. Preload
        let loadedCount = 0;
        const total = sequenceConfig.totalFrames;
        validUrlsRef.current = new Array(total).fill("");

        const initialUrl = getFrameUrl(0, sequenceConfig);
        setSlot0Src(initialUrl);
        setSlot1Src(initialUrl);
        validUrlsRef.current[0] = initialUrl;

        for (let i = 0; i < total; i++) {
            const url = getFrameUrl(i, sequenceConfig);
            const img = new window.Image();

            img.onload = () => {
                validUrlsRef.current[i] = url;
                loadedCount++;
                setLoadProgress(Math.round((loadedCount / total) * 100));
                if (loadedCount === total) {
                    fillGaps();
                    setImagesLoaded(true);
                }
            };

            img.onerror = () => {
                // console.warn(`Frame failed: ${url}, will use fallback.`);
                loadedCount++;
                setLoadProgress(Math.round((loadedCount / total) * 100));
                if (loadedCount === total) {
                    fillGaps();
                    setImagesLoaded(true);
                }
            };

            img.src = url;
        }

        const fillGaps = () => {
            let lastValid = validUrlsRef.current[0] || getFrameUrl(0, sequenceConfig);
            for (let i = 0; i < total; i++) {
                if (!validUrlsRef.current[i]) {
                    validUrlsRef.current[i] = lastValid;
                } else {
                    lastValid = validUrlsRef.current[i];
                }
            }
            setSlot0Src(validUrlsRef.current[0]);
            setSlot1Src(validUrlsRef.current[0]);
        };

    }, [sequenceConfig]);

    useEffect(() => {
        if (!imagesLoaded) return;

        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate progress based on position in viewport
            // Progress 0: Top of element is at Top of viewport (rect.top = 0)
            // Progress 1: Bottom of element is at Top of viewport (rect.bottom = 0 OR rect.top = -rect.height)
            // We also clamp it so it only animates while "scrolling past" effectively?
            // Actually, if we want it to animate while it is *in view*, we typically map:
            // Entering (rect.top < viewportHeight) to Leaving (rect.bottom < 0).

            // User requested: "Progress starts when Home section top hits top of viewport" (rect.top <= 0)
            // "Ends when Home section bottom hits top of viewport" (rect.bottom <= 0).
            // This implies the animation runs strictly as the element leaves the screen upwards.
            // This corresponds to:

            const elementHeight = rect.height;
            const progressraw = -rect.top / elementHeight;
            const progress = Math.max(0, Math.min(1, progressraw));

            const frameIndex = Math.min(
                sequenceConfig.totalFrames - 1,
                Math.floor(progress * (sequenceConfig.totalFrames - 1))
            );

            if (frameIndex !== frameRef.current) {
                frameRef.current = frameIndex;
                const newUrl = validUrlsRef.current[frameIndex];

                if (newUrl) {
                    if (activeSlot === 0) {
                        setSlot1Src(newUrl);
                        setActiveSlot(1);
                    } else {
                        setSlot0Src(newUrl);
                        setActiveSlot(0);
                    }
                }
            }
        };

        let rafId: number;
        const onScroll = () => {
            rafId = requestAnimationFrame(handleScroll);
        };

        window.addEventListener("scroll", onScroll);
        // Trigger once
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafId);
        };
    }, [imagesLoaded, activeSlot, sequenceConfig]);

    return (
        <>
            <div
                ref={containerRef}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                {/* Loader - Only show if not loaded. Maybe scoped to this section? */}
                {/* Showing 12 loaders might be chaotic. 
            For now, we keep the loader local to the component. 
            It will overlay the specific section. */}
                <div
                    className={cn(
                        "absolute inset-0 z-10 flex flex-col items-center justify-center bg-black transition-opacity duration-1000",
                        imagesLoaded ? "opacity-0" : "opacity-100"
                    )}
                >
                    <p className="mb-4 text-orange-500 font-bold text-xs md:text-sm">{sequenceConfig.id} {loadProgress}%</p>
                    <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-100 ease-out"
                            style={{ width: `${loadProgress}%` }}
                        />
                    </div>
                </div>

                {/* Sequence Layers */}
                <div className="absolute inset-0 w-full h-full">
                    <div
                        className={cn(
                            "absolute inset-0 w-full h-full transition-opacity duration-200 ease-linear",
                            activeSlot === 0 ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {slot0Src && (
                            <Image
                                src={slot0Src}
                                alt="Sequence"
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                                unoptimized
                            />
                        )}
                    </div>

                    <div
                        className={cn(
                            "absolute inset-0 w-full h-full transition-opacity duration-200 ease-linear",
                            activeSlot === 1 ? "opacity-100" : "opacity-0"
                        )}
                    >
                        {slot1Src && (
                            <Image
                                src={slot1Src}
                                alt="Sequence"
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                                unoptimized
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
