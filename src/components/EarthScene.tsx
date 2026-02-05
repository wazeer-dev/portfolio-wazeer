"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

export default function EarthScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const worldWidth = 256, worldDepth = 256;
        const clock = new THREE.Clock();

        let camera: THREE.PerspectiveCamera;
        let scene: THREE.Scene;
        let renderer: THREE.WebGLRenderer;
        let controls: FirstPersonControls;
        let mesh: THREE.Mesh;
        let texture: THREE.CanvasTexture;

        // --- Helpers ---
        function generateHeight(width: number, height: number) {
            let seed = Math.PI / 4;
            // Overwrite Math.random slightly locally if needed, but for React simplified:
            // We'll just define a local random function to match the example's determinism if possible,
            // or just use the example's logic.
            const customRandom = () => {
                const x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            };

            const size = width * height;
            const data = new Uint8Array(size);
            const perlin = new ImprovedNoise();
            const z = Math.random() * 100;

            let quality = 1;

            for (let j = 0; j < 4; j++) {
                for (let i = 0; i < size; i++) {
                    const x = i % width;
                    const y = Math.floor(i / width);
                    // Use standard Math.random usually, but example used custom seed. 
                    // Let's use standard perlin logic with the noise instance.
                    data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
                }
                quality *= 5;
            }

            return data;
        }

        function generateTexture(data: Uint8Array, width: number, height: number) {
            let context: CanvasRenderingContext2D | null, image, imageData, shade;

            const vector3 = new THREE.Vector3(0, 0, 0);
            const sun = new THREE.Vector3(1, 1, 1);
            sun.normalize();

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            context = canvas.getContext('2d');
            if (!context) return canvas;

            context.fillStyle = '#000';
            context.fillRect(0, 0, width, height);

            image = context.getImageData(0, 0, canvas.width, canvas.height);
            imageData = image.data;

            for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
                vector3.x = data[j - 2] - data[j + 2];
                vector3.y = 2;
                vector3.z = data[j - width * 2] - data[j + width * 2];
                vector3.normalize();

                shade = vector3.dot(sun);

                imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
                imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
                imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
            }

            context.putImageData(image, 0, 0);

            // Scaled 4x
            const canvasScaled = document.createElement('canvas');
            canvasScaled.width = width * 4;
            canvasScaled.height = height * 4;

            context = canvasScaled.getContext('2d');
            if (!context) return canvas;

            context.scale(4, 4);
            context.drawImage(canvas, 0, 0);

            image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
            imageData = image.data;

            for (let i = 0, l = imageData.length; i < l; i += 4) {
                const v = Math.floor(Math.random() * 5);
                imageData[i] += v;
                imageData[i + 1] += v;
                imageData[i + 2] += v;
            }

            context.putImageData(image, 0, 0);
            return canvasScaled;
        }

        // --- Init ---
        const init = () => {
            if (!containerRef.current) return;

            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xefd1b5);
            scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);

            const data = generateHeight(worldWidth, worldDepth);

            camera.position.set(100, 800, -800);
            camera.lookAt(-100, 810, -800);

            const geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
            geometry.rotateX(-Math.PI / 2);

            const vertices = geometry.attributes.position.array;

            for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
                // @ts-ignore - TS doesn't know this is a float32array accessible by index cleanly in loop sometimes without casting
                vertices[j + 1] = data[i] * 10;
            }

            texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;

            mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
            scene.add(mesh);

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            // We'll handle animation loop manually to clean up cleanly
            containerRef.current.appendChild(renderer.domElement);

            controls = new FirstPersonControls(camera, renderer.domElement);
            controls.movementSpeed = 150;
            controls.lookSpeed = 0.1;
        };

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
            controls.handleResize();
        };

        init();
        window.addEventListener('resize', onWindowResize);

        // --- Animation ---
        let reqId: number;
        const animate = () => {
            reqId = requestAnimationFrame(animate);
            controls.update(clock.getDelta());
            renderer.render(scene, camera);
        };
        animate();

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (reqId) cancelAnimationFrame(reqId);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            // Dispose basic resources
            if (mesh) {
                mesh.geometry.dispose();
                (mesh.material as THREE.Material).dispose();
            }
            if (texture) texture.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full z-0 block cursor-move"
        />
    );
}
