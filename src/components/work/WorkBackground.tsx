"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function WorkBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let camera: THREE.PerspectiveCamera;
        let scene: THREE.Scene;
        let renderer: THREE.WebGLRenderer;
        let globe: THREE.Mesh;
        let atmosphere: THREE.Mesh;
        let controls: OrbitControls;
        let animationId: number;

        const init = () => {
            // Camera
            camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.set(4.5, 2, 3); // User's camera pos

            // Scene
            scene = new THREE.Scene();

            // Sun (Directional Light - mostly for standard materials, but we use uniform for shader)
            const sunPosition = new THREE.Vector3(3, 3, 3);

            // Textures
            const textureLoader = new THREE.TextureLoader();

            // Using reliable high-res textures from common CDN for demo purposes since local files are missing
            const dayTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
            const nightTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png');
            const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');

            dayTexture.colorSpace = THREE.SRGBColorSpace;
            dayTexture.anisotropy = 10;
            nightTexture.colorSpace = THREE.SRGBColorSpace;
            nightTexture.anisotropy = 10;
            cloudsTexture.anisotropy = 10;

            // --- Custom Shader for Earth (Day/Night + Clouds + Atmosphere mix) ---
            // This replicates the TSL logic in standard GLSL
            const earthVertexShader = `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec3 vViewDirection;

                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                    vViewDirection = normalize(cameraPosition - vPosition); // approximation in view space usually, but here world
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

            const earthFragmentShader = `
                uniform sampler2D dayTexture;
                uniform sampler2D nightTexture;
                uniform sampler2D cloudsTexture;
                uniform vec3 sunDirection;
                
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vViewDirection;

                void main() {
                    vec3 viewDir = normalize(vViewDirection);
                    vec3 normal = normalize(vNormal);
                    vec3 sunDir = normalize(sunDirection);

                    // Sun Orientation (Day/Night Factor)
                    float sunOrientation = dot(normal, sunDir);
                    
                    // Textures
                    vec3 dayColor = texture2D(dayTexture, vUv).rgb;
                    vec3 nightColor = texture2D(nightTexture, vUv).rgb;
                    float clouds = texture2D(cloudsTexture, vUv).r; // Clouds usually stored in R or similar

                    // Mix Day/Night
                    float dayStrength = smoothstep(-0.25, 0.5, sunOrientation);
                    
                    // Simple Cloud Shadow/Highlight
                    vec3 dayColorWithClouds = mix(dayColor, vec3(1.0), clouds);
                    
                    // Final Earth Color
                    vec3 finalColor = mix(nightColor, dayColorWithClouds, dayStrength);

                    // Atmosphere / Fresnel (On the ground)
                    float fresnel = 1.0 - abs(dot(viewDir, normal));
                    float atmosphereMix = smoothstep(-0.5, 1.0, sunOrientation) * pow(fresnel, 2.0);
                    vec3 atmosphereColor = vec3(0.3, 0.7, 1.0); // Simple blueish

                    finalColor = mix(finalColor, atmosphereColor, clamp(atmosphereMix, 0.0, 1.0) * 0.5);

                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `;

            const earthMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    dayTexture: { value: dayTexture },
                    nightTexture: { value: nightTexture },
                    cloudsTexture: { value: cloudsTexture },
                    sunDirection: { value: sunPosition }
                },
                vertexShader: earthVertexShader,
                fragmentShader: earthFragmentShader
            });

            // Geometry
            const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
            globe = new THREE.Mesh(sphereGeometry, earthMaterial);
            scene.add(globe);

            // --- Outer Atmosphere (Glow) ---
            const atmosphereVertexShader = `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

            const atmosphereFragmentShader = `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `;

            // Simple additive blend atmosphere
            const atmosphereMaterial = new THREE.ShaderMaterial({
                vertexShader: atmosphereVertexShader,
                fragmentShader: atmosphereFragmentShader,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
                transparent: true
            });

            atmosphere = new THREE.Mesh(sphereGeometry, atmosphereMaterial);
            atmosphere.scale.set(1.1, 1.1, 1.1);
            scene.add(atmosphere);


            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            if (containerRef.current) {
                containerRef.current.innerHTML = "";
                containerRef.current.appendChild(renderer.domElement);
            }
            rendererRef.current = renderer;

            // Controls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.minDistance = 0.1;
            controls.maxDistance = 50;

            // Resize
            const onWindowResize = () => {
                const width = window.innerWidth;
                const height = window.innerHeight;

                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
            };
            window.addEventListener('resize', onWindowResize);

            // Animation
            const clock = new THREE.Clock(); // Create clock here

            const animate = () => {
                animationId = requestAnimationFrame(animate);

                const delta = clock.getDelta();
                if (globe) globe.rotation.y += delta * 0.025; // Spin Earth

                controls.update();
                renderer.render(scene, camera);
            };
            animate();

            return () => {
                window.removeEventListener('resize', onWindowResize);
                cancelAnimationFrame(animationId);
                renderer.dispose();
            };
        };

        const cleanup = init();
        return cleanup;
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-auto"
            style={{ background: 'black' }}
        />
    );
}
