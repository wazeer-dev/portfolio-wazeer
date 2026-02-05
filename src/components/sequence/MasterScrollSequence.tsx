"use client";

import { useEffect, useRef, useState, useMemo } from "react";
// import Image from "next/image"; // No longer needed for sequence
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { SEQUENCES, SequenceConfig } from "@/lib/sequences";
import Footer from "@/components/Footer";
import IntroOverlay from "@/components/IntroOverlay";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";

// Helper to generate URL
const getFrameUrl = (i: number, config: SequenceConfig) => {
    return `${config.folder}/frame_${String(i).padStart(config.padding, "0")}${config.suffix}.webp`;
};

export default function MasterScrollSequence() {
    // State
    const [hasEntered, setHasEntered] = useState(false);
    const [activeSeqIndex, setActiveSeqIndex] = useState(0);
    // const [activeFrameIndex, setActiveFrameIndex] = useState(0); // Managed by ref loop mostly now

    // Display state
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    // Cache for loaded images (SequenceID -> Array of HTMLImageElements)
    const imageCache = useRef<Map<string, HTMLImageElement[]>>(new Map());

    // Process Tracking
    const sequencesLoading = useRef<Set<string>>(new Set());

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    // --- Preloading Logic (Image Object Based) ---
    const preloadSequence = async (index: number) => {
        const config = SEQUENCES[index];
        if (!config) return;
        if (imageCache.current.has(config.id)) return; // Already loaded
        if (sequencesLoading.current.has(config.id)) return; // Currently loading

        sequencesLoading.current.add(config.id);
        setLoadingStatus(`Loading ${config.label}...`);

        const images: HTMLImageElement[] = new Array(config.totalFrames);
        let loaded = 0;
        const total = config.totalFrames;

        return new Promise<void>((resolve) => {
            let resolved = false;

            for (let i = 0; i < total; i++) {
                const url = getFrameUrl(i, config);
                const img = new Image();

                img.onload = () => {
                    loaded++;
                    if (loaded === total && !resolved) {
                        resolved = true;
                        imageCache.current.set(config.id, images);
                        sequencesLoading.current.delete(config.id);
                        setLoadingStatus("");
                        resolve();
                    }
                };
                img.onerror = () => {
                    // Fallback: use previous frame or generic placeholder logic if needed
                    // For now, we just count it as loaded to not block
                    loaded++;
                    if (loaded === total && !resolved) {
                        resolved = true;
                        imageCache.current.set(config.id, images);
                        sequencesLoading.current.delete(config.id);
                        setLoadingStatus("");
                        resolve();
                    }
                };

                // Fire request
                img.src = url;
                // Store ref immediately
                images[i] = img;
            }
        });
    };

    // Preload Initial on Mount & Scroll Restoration
    useEffect(() => {
        // Force scroll to top
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);

        // Aggressively preload first few sequences to ensure smooth start
        const loadInitial = async () => {
            await preloadSequence(0);
            await preloadSequence(1);
            preloadSequence(2);
            preloadSequence(3);
        };
        loadInitial();
    }, []);

    // Factor to slow down scroll
    const SCROLL_FACTOR = 4; // Increased from 3 to 4 for even smoother/slower text playback per frame

    // --- Canvas Drawing Logic ---
    const drawFrame = (seqIndex: number, frameIndex: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const config = SEQUENCES[seqIndex];
        const cachedImages = imageCache.current.get(config.id);

        if (!cachedImages || !cachedImages[frameIndex]) {
            // Fallback: Nearest Neighbor Search
            // If strictly current frame is missing, look backwards for the closest loaded frame
            // This prevents "blinking" or "stuck" empty canvas
            let safeFrameIndex = frameIndex;
            while (safeFrameIndex >= 0) {
                if (cachedImages && cachedImages[safeFrameIndex] && cachedImages[safeFrameIndex].complete) {
                    break;
                }
                safeFrameIndex--;
            }

            if (safeFrameIndex < 0 || !cachedImages || !cachedImages[safeFrameIndex]) {
                return; // Nothing to draw at all
            }

            // Use the safe frame found
            frameIndex = safeFrameIndex;
        }

        const img = cachedImages[frameIndex];

        // Ensure image is actually loaded with data
        if (!img.complete || img.naturalWidth === 0) return;

        // Object-Cover Math for Canvas
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        const targetRatio = cw / ch;
        const imgRatio = iw / ih;

        let sx, sy, sw, sh;

        if (imgRatio > targetRatio) {
            // Image is wider than canvas (crop sides)
            sh = ih;
            sw = ih * targetRatio;
            sx = (iw - sw) / 2;
            sy = 0;
        } else {
            // Image is taller than canvas (crop top/bottom)
            sw = iw;
            sh = iw / targetRatio;
            sx = 0;
            sy = (ih - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    };

    // --- Resize Handler ---
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                // Set logic resolution
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Trigger a redraw of current state if needed (handled by loop)
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Initial
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    // --- Main Loop ---
    useEffect(() => {
        // If we haven't entered, we might not want to process scroll aggressively, 
        // but we still want the hero image to render behind the overlay perhaps?
        // Let's run the loop regardless.

        const loop = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const sequenceHeight = viewportHeight * SCROLL_FACTOR;

            // 1. Determine Sequence
            const rawIndex = Math.floor(scrollY / sequenceHeight);
            const index = Math.max(0, Math.min(SEQUENCES.length - 1, rawIndex));

            // 2. Progress
            const sectionProgress = (scrollY % sequenceHeight) / sequenceHeight;

            // 3. Determine Frame
            const config = SEQUENCES[index];
            const frameIndex = Math.min(
                config.totalFrames - 1,
                Math.floor(sectionProgress * (config.totalFrames - 1))
            );

            // 4. Update State (Low frequency updates)
            if (index !== activeSeqIndex) {
                setActiveSeqIndex(index);
                preloadSequence(index + 1);
                preloadSequence(index + 2); // Increased Buffer: Preload next TWO sequences
            }

            // 5. Draw
            drawFrame(index, frameIndex);

            rafRef.current = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(rafRef.current);
    }, [activeSeqIndex]); // Re-bind if index changes significantly logic-wise, though refs cover most.


    // --- Audio Logic ---
    // Removed duplicate audio logic (Handled globally by BackgroundMusic.tsx)

    // --- Render ---

    // Lock body scroll if not entered
    useEffect(() => {
        if (!hasEntered) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [hasEntered]);

    // --- Text Logic (Reverted to direct Active Sequence) ---
    // We remove the separate textIndex state to prevent sync issues causing invisibility

    // Check if initial sequence is loaded
    const isInitialSequenceLoaded = !sequencesLoading.current.has(SEQUENCES[0].id) && imageCache.current.has(SEQUENCES[0].id);

    return (
        <>

            {/* Intro Gate */}
            {!hasEntered && <IntroOverlay onEnter={() => setHasEntered(true)} isLoading={!isInitialSequenceLoaded} />}

            <div
                ref={containerRef}
                className="relative w-full bg-black leading-none"
                style={{ height: `${SEQUENCES.length * 100 * SCROLL_FACTOR}vh` }}
            >
                {/* Sticky Viewport */}
                <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between md:justify-center items-center">

                    {/* Canvas Background */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full z-0 object-cover"
                    />

                    {/* Text Overlay */}
                    <div
                        className={`relative z-10 pointer-events-none mix-blend-difference px-4 w-full h-full mx-auto transition-all duration-500 ease-in-out
                        max-w-[90%] md:max-w-7xl flex flex-col md:flex-row justify-between md:justify-between items-start md:items-end text-left md:text-right py-24 md:py-0 md:h-auto md:mb-12`}>

                        {/* Label Area (Top on Mobile, Left on Desktop) */}
                        <div className="w-full md:w-1/2 text-left">
                            <h2 className="text-5xl md:text-8xl font-black text-white/90 tracking-tighter drop-shadow-2xl animate-fade-in-up">
                                {SEQUENCES[activeSeqIndex].label}
                            </h2>
                        </div>

                        {/* Description Area (Bottom on Mobile, Right on Desktop) */}
                        {(SEQUENCES[activeSeqIndex].description || SEQUENCES[activeSeqIndex].subtext) && (
                            <div className="flex flex-col w-full md:w-1/2 items-start md:items-end text-right ml-auto">
                                {/* Dynamic Description */}
                                {SEQUENCES[activeSeqIndex].description && (
                                    <p className="text-xl md:text-3xl text-orange-500 font-bold uppercase tracking-wide animate-fade-in-up delay-100 text-left md:text-right">
                                        {SEQUENCES[activeSeqIndex].description}
                                    </p>
                                )}

                                {/* Dynamic Subtext */}
                                {SEQUENCES[activeSeqIndex].subtext && (
                                    <p className="mt-2 text-lg md:text-xl text-white/80 font-medium animate-fade-in-up delay-200 text-left md:text-right">
                                        {SEQUENCES[activeSeqIndex].subtext}
                                    </p>
                                )}

                                {/* Dynamic Button (CTA) */}
                                {SEQUENCES[activeSeqIndex].buttonText && (
                                    <div className={`mt-6 pointer-events-auto animate-fade-in-up delay-300`}>
                                        <button className="px-6 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300 font-bold uppercase tracking-widest text-sm">
                                            {SEQUENCES[activeSeqIndex].buttonText}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Loading Indicator (Small, bottom right) - Optional, maybe hide after enter? */}
                    {loadingStatus && hasEntered && (
                        <div className="absolute bottom-4 right-4 z-50 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded">
                            {loadingStatus}
                        </div>
                    )}
                </div>

                {/* Footer and Slider - Absolute Bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-20">
                    <div className="bg-black py-8 border-t border-white/10">
                        <InfiniteMarquee
                            items={useMemo(() => [
                                "React", "Next.js", "Three.js", "GSAP", "TypeScript", "Node.js", "Firebase", "TailwindCSS", "Framer Motion",
                                "React", "Next.js", "Three.js", "GSAP", "TypeScript", "Node.js", "Firebase", "TailwindCSS", "Framer Motion"
                            ].map(skill => (
                                <span key={skill} className="text-4xl md:text-6xl font-black text-neutral-500 hover:text-orange-500 transition-colors duration-300 uppercase tracking-tighter">
                                    {skill}
                                </span>
                            )), [])}
                            speed={10}
                        />
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
}
