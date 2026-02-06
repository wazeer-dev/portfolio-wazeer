"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
// @ts-ignore
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { fragmentShaderPosition, fragmentShaderVelocity, birdVS, birdFS } from "./shaders/BirdsShaders";

/* TEXTURE WIDTH FOR SIMULATION */
const WIDTH = 32;
const BIRDS = WIDTH * WIDTH;

// Custom Geometry
class BirdGeometry extends THREE.BufferGeometry {
    constructor() {
        super();

        const trianglesPerBird = 3;
        const triangles = BIRDS * trianglesPerBird;
        const points = triangles * 3;

        const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
        const birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
        const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2);
        const birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1);

        this.setAttribute('position', vertices);
        this.setAttribute('birdColor', birdColors);
        this.setAttribute('reference', references);
        this.setAttribute('birdVertex', birdVertex);

        let v = 0;

        function verts_push(...args: number[]) {
            for (let i = 0; i < args.length; i++) {
                // @ts-ignore
                vertices.array[v++] = args[i];
            }
        }

        const wingsSpan = 20;

        for (let f = 0; f < BIRDS; f++) {
            // Body
            verts_push(
                0, -0, -20,
                0, 4, -20,
                0, 0, 30
            );

            // Wings
            verts_push(
                0, 0, -15,
                -wingsSpan, 0, 0,
                0, 0, 15
            );

            verts_push(
                0, 0, 15,
                wingsSpan, 0, 0,
                0, 0, -15
            );
        }

        for (let v = 0; v < triangles * 3; v++) {
            const triangleIndex = ~~(v / 3);
            const birdIndex = ~~(triangleIndex / trianglesPerBird);
            const x = (birdIndex % WIDTH) / WIDTH;
            const y = ~~(birdIndex / WIDTH) / WIDTH;

            const c = new THREE.Color(
                0x444444 +
                ~~(v / 9) / BIRDS * 0x666666
            );

            // @ts-ignore
            birdColors.array[v * 3 + 0] = c.r;
            // @ts-ignore
            birdColors.array[v * 3 + 1] = c.g;
            // @ts-ignore
            birdColors.array[v * 3 + 2] = c.b;

            // @ts-ignore
            references.array[v * 2] = x;
            // @ts-ignore
            references.array[v * 2 + 1] = y;

            // @ts-ignore
            birdVertex.array[v] = v % 9;
        }

        this.scale(0.2, 0.2, 0.2);
    }
}

export default function EarthScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let camera: THREE.PerspectiveCamera;
        let scene: THREE.Scene;
        let renderer: THREE.WebGLRenderer;

        const BOUNDS = 800;
        const BOUNDS_HALF = BOUNDS / 2;

        let last = performance.now();

        let gpuCompute: any;
        let velocityVariable: any;
        let positionVariable: any;
        let positionUniforms: any;
        let velocityUniforms: any;
        let birdUniforms: any;

        let animationId: number;
        let mouseX = 0;
        let mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        const init = () => {
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
            camera.position.z = 350;

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);
            scene.fog = new THREE.Fog(0xffffff, 100, 1000);

            // Using pure white for cleaner look as per snippet
            // If you want transparency, set alpha: true and setClearColor(0x000000, 0)

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (containerRef.current) {
                containerRef.current.appendChild(renderer.domElement);
            }

            initComputeRenderer();
            initBirds();

            containerRef.current?.addEventListener('pointermove', onPointerMove);
            window.addEventListener('resize', onWindowResize);

            animate();
        };

        const initComputeRenderer = () => {
            gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

            if (renderer.capabilities.isWebGL2 === false) {
                gpuCompute.setDataType(THREE.HalfFloatType);
            }

            const dtPosition = gpuCompute.createTexture();
            const dtVelocity = gpuCompute.createTexture();
            fillPositionTexture(dtPosition);
            fillVelocityTexture(dtVelocity);

            velocityVariable = gpuCompute.addVariable('textureVelocity', fragmentShaderVelocity, dtVelocity);
            positionVariable = gpuCompute.addVariable('texturePosition', fragmentShaderPosition, dtPosition);

            gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
            gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

            positionUniforms = positionVariable.material.uniforms;
            velocityUniforms = velocityVariable.material.uniforms;

            positionUniforms['time'] = { value: 0.0 };
            positionUniforms['delta'] = { value: 0.0 };
            velocityUniforms['time'] = { value: 1.0 };
            velocityUniforms['delta'] = { value: 0.0 };
            velocityUniforms['testing'] = { value: 1.0 };
            velocityUniforms['separationDistance'] = { value: 1.0 };
            velocityUniforms['alignmentDistance'] = { value: 1.0 };
            velocityUniforms['cohesionDistance'] = { value: 1.0 };
            velocityUniforms['freedomFactor'] = { value: 1.0 };
            velocityUniforms['predator'] = { value: new THREE.Vector3() };
            velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2);

            velocityVariable.wrapS = THREE.RepeatWrapping;
            velocityVariable.wrapT = THREE.RepeatWrapping;
            positionVariable.wrapS = THREE.RepeatWrapping;
            positionVariable.wrapT = THREE.RepeatWrapping;

            const error = gpuCompute.init();

            if (error !== null) {
                console.error(error);
            }
        };

        const initBirds = () => {
            const geometry = new BirdGeometry();

            // For Vertex and Fragment
            birdUniforms = {
                'color': { value: new THREE.Color(0xff2200) },
                'texturePosition': { value: null },
                'textureVelocity': { value: null },
                'time': { value: 1.0 },
                'delta': { value: 0.0 }
            };

            // THREE.ShaderMaterial
            const material = new THREE.ShaderMaterial({
                uniforms: birdUniforms,
                vertexShader: birdVS,
                fragmentShader: birdFS,
                side: THREE.DoubleSide
            });

            const birdMesh = new THREE.Mesh(geometry, material);
            birdMesh.rotation.y = Math.PI / 2;
            birdMesh.matrixAutoUpdate = false;
            birdMesh.updateMatrix();

            scene.add(birdMesh);
        };

        const fillPositionTexture = (texture: THREE.DataTexture) => {
            const theArray = texture.image.data;

            for (let k = 0, kl = theArray.length; k < kl; k += 4) {
                const x = Math.random() * BOUNDS - BOUNDS_HALF;
                const y = Math.random() * BOUNDS - BOUNDS_HALF;
                const z = Math.random() * BOUNDS - BOUNDS_HALF;

                theArray[k + 0] = x;
                theArray[k + 1] = y;
                theArray[k + 2] = z;
                theArray[k + 3] = 1;
            }
        };

        const fillVelocityTexture = (texture: THREE.DataTexture) => {
            const theArray = texture.image.data;

            for (let k = 0, kl = theArray.length; k < kl; k += 4) {
                const x = Math.random() - 0.5;
                const y = Math.random() - 0.5;
                const z = Math.random() - 0.5;

                theArray[k + 0] = x * 10;
                theArray[k + 1] = y * 10;
                theArray[k + 2] = z * 10;
                theArray[k + 3] = 1;
            }
        };

        const onWindowResize = () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onPointerMove = (event: PointerEvent) => {
            if (event.isPrimary === false) return;

            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
        };

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            render();
        };

        const render = () => {
            const now = performance.now();
            let delta = (now - last) / 1000;

            if (delta > 1) delta = 1; // safety cap on large deltas
            last = now;

            positionUniforms['time'].value = now;
            positionUniforms['delta'].value = delta;
            velocityUniforms['time'].value = now;
            velocityUniforms['delta'].value = delta;
            birdUniforms['time'].value = now;
            birdUniforms['delta'].value = delta;

            velocityUniforms['predator'].value.set(0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY, 0);

            // We make the mouse inactive if stopped moving for a bit in a real scenario, 
            // but for now we just reset it far away in original logic only at start of frame
            // The original example sets mouseX = 10000 at end of render, we will replicate that
            // BUT onPointerMove updates it again. This means predator effect is impulse-based or needs continuous move?
            // In original code: onPointerMove updates mouseX/Y. render() uses it, then sets to 10000.
            // This means the predator only exists for ONE FRAME after mouse move? 
            // Let's keep it consistent with the user provided code.

            mouseX = 10000;
            mouseY = 10000;

            gpuCompute.compute();

            birdUniforms['texturePosition'].value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
            birdUniforms['textureVelocity'].value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;

            renderer.render(scene, camera);
        };

        init();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (containerRef.current) {
                containerRef.current.removeEventListener('pointermove', onPointerMove);
            }
            cancelAnimationFrame(animationId);
            if (renderer) renderer.dispose();

            // Clean up GPU Compute if possible (though it generates textures)
            if (gpuCompute) {
                // gpuCompute.dispose(); // Method might not exist on all versions
            }

            if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full z-0 block"
            style={{ pointerEvents: 'auto' }}
        />
    );
}
