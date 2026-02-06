"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function BackgroundMusic() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Initialize audio instance
        const audio = new Audio("/bg-music.mp3");
        audio.loop = true;
        audio.volume = 0.5; // Set volume
        audioRef.current = audio;

        // Attempt to auto-play - usually blocked, but we try
        const attemptPlay = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (err) {
                // Auto-play failed, user interaction required
                setIsPlaying(false);
            }
        };

        attemptPlay();

        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(e => console.error("Play failed:", e));
            setIsPlaying(true);
        }
    };

    return (
        <button
            onClick={togglePlay}
            className="fixed bottom-6 left-6 z-[999] p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-black/80 hover:scale-110 transition-all duration-300 group"
            aria-label="Toggle Background Music"
        >
            {isPlaying ? (
                <Volume2 className="w-5 h-5 group-hover:animate-pulse" />
            ) : (
                <VolumeX className="w-5 h-5" />
            )}

            {/* Tooltip / Label */}
            <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black px-2 py-1 rounded border border-white/10">
                {isPlaying ? "Music On" : "Music Off"}
            </span>
        </button>
    );
}
