"use client";

import { useEffect, useRef } from "react";

export default function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; z: number; size: number }[] = [];

        // Configuration
        const STAR_COUNT = 400; // Number of stars
        const SPEED = 2; // Speed of movement

        // Initialize Stars
        const initStars = () => {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * window.innerWidth - window.innerWidth / 2,
                    y: Math.random() * window.innerHeight - window.innerHeight / 2,
                    z: Math.random() * window.innerWidth, // Depth
                    size: Math.random() * 2 // Base size
                });
            }
        };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const render = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            stars.forEach((star) => {
                // Move star towards camera (decrease Z)
                star.z -= SPEED;

                // Reset star if it passes the camera or goes off screen usually
                if (star.z <= 0) {
                    star.z = canvas.width;
                    star.x = Math.random() * canvas.width - cx;
                    star.y = Math.random() * canvas.height - cy;
                }

                // Project 3D position to 2D
                const k = 128.0 / star.z; // Field of view factor
                const px = star.x * k + cx;
                const py = star.y * k + cy;

                // Calculate size based on depth (closer = bigger)
                const size = (1 - star.z / canvas.width) * star.size * 2;

                // Draw Star if visible
                if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height && size > 0) {
                    const alpha = (1 - star.z / canvas.width); // Fade out distance
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(px, py, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 block bg-black"
        />
    );
}
