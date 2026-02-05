"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio instance
        const audio = new Audio("/bg-music.mp3");
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        // Attempt to play immediately
        const playAudio = () => {
            audio.play().catch((err) => {
                // Autoplay failed - expected behavior in most browsers without interaction
                // We wait for the first interaction
            });
        };

        playAudio();

        // Fallback: Play on first interaction if autoplay was blocked
        const handleInteraction = () => {
            audio.play().then(() => {
                // Cleanup listener once playing
                document.removeEventListener("click", handleInteraction);
                document.removeEventListener("keydown", handleInteraction);
            }).catch(() => { });
        };

        document.addEventListener("click", handleInteraction);
        document.addEventListener("keydown", handleInteraction);

        return () => {
            audio.pause();
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("keydown", handleInteraction);
        };
    }, []);

    return null;
}
