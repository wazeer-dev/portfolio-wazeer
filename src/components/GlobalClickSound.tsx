"use client";

import { useEffect } from "react";

export default function GlobalClickSound() {
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            // Check if the clicked element is a button or link (or inside one)
            const target = e.target as HTMLElement;
            const clickable = target.closest("button") || target.closest("a");

            if (clickable) {
                const audio = new Audio("/ncprime-keyboard-typing-one-short-1-292590.mp3");
                audio.volume = 0.5;
                audio.currentTime = 0; // Reset just in case (though new instance handles it)
                audio.play().catch(() => { }); // catch autoplay errors
            }
        };

        document.addEventListener("click", handleGlobalClick);

        return () => {
            document.removeEventListener("click", handleGlobalClick);
        };
    }, []);

    return null; // Logic only
}
