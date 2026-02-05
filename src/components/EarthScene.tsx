"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ConvexObjectBreaker } from "three/examples/jsm/misc/ConvexObjectBreaker.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

// Type definition for Ammo (global)
declare global {
    interface Window {
        Ammo: any;
    }
}

export default function EarthScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- Variables ---
        let scene: THREE.Scene;
        let camera: THREE.PerspectiveCamera;
        let renderer: THREE.WebGLRenderer;
        let controls: OrbitControls;
        let stats: Stats;
        let textureLoader: THREE.TextureLoader;
        const clock = new THREE.Clock();

        const mouseCoords = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 });

        // Physics variables
        const gravityConstant = 7.8;
        let collisionConfiguration: any;
        let dispatcher: any;
        let broadphase: any;
        let solver: any;
        let physicsWorld: any;
        const margin = 0.05;

        const convexBreaker = new ConvexObjectBreaker();
        const rigidBodies: THREE.Object3D[] = [];
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        let transformAux1: any;
        let tempBtVec3_1: any;

        const objectsToRemove: any[] = []; // Array(500).fill(null);
        let numObjectsToRemove = 0;
        for (let i = 0; i < 500; i++) objectsToRemove[i] = null;

        const impactPoint = new THREE.Vector3();
        const impactNormal = new THREE.Vector3();

        let Ammo: any;
        let animationId: number;

        // --- Functions ---

        const init = () => {
            initGraphics();
            initPhysics();
            createObjects();
            initInput();
            animate();
        };

        const initGraphics = () => {
            if (!containerRef.current) return;

            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 2000);
            camera.position.set(-14, 8, 16);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xbfd1e5);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            containerRef.current.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 2, 0);
            controls.update();

            textureLoader = new THREE.TextureLoader();

            const ambientLight = new THREE.AmbientLight(0xbbbbbb);
            scene.add(ambientLight);

            const light = new THREE.DirectionalLight(0xffffff, 3);
            light.position.set(-10, 18, 5);
            light.castShadow = true;
            const d = 14;
            light.shadow.camera.left = -d;
            light.shadow.camera.right = d;
            light.shadow.camera.top = d;
            light.shadow.camera.bottom = -d;
            light.shadow.camera.near = 2;
            light.shadow.camera.far = 50;
            light.shadow.mapSize.x = 1024;
            light.shadow.mapSize.y = 1024;
            scene.add(light);

            // Optional: Stats
            // stats = new Stats();
            // stats.domElement.style.position = 'absolute';
            // stats.domElement.style.top = '0px';
            // containerRef.current.appendChild(stats.domElement);

            window.addEventListener('resize', onWindowResize);
        };

        const initPhysics = () => {
            collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
            dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
            broadphase = new Ammo.btDbvtBroadphase();
            solver = new Ammo.btSequentialImpulseConstraintSolver();
            physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
            physicsWorld.setGravity(new Ammo.btVector3(0, -gravityConstant, 0));

            transformAux1 = new Ammo.btTransform();
            tempBtVec3_1 = new Ammo.btVector3(0, 0, 0);
        };

        const createObject = (mass: number, halfExtents: THREE.Vector3, pos: THREE.Vector3, quat: THREE.Quaternion, material: THREE.Material) => {
            const object = new THREE.Mesh(new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2), material);
            object.position.copy(pos);
            object.quaternion.copy(quat);
            convexBreaker.prepareBreakableObject(object, mass, new THREE.Vector3(), new THREE.Vector3(), true);
            createDebrisFromBreakableObject(object);
        };

        const createObjects = () => {
            // Ground
            pos.set(0, -0.5, 0);
            quat.set(0, 0, 0, 1);
            const ground = createParalellepipedWithPhysics(40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
            ground.receiveShadow = true;

            // Grid texture
            // Using a procedural grid or simple color since we might not have 'textures/grid.png'
            // Or trying to load a remote one if needed. For now simple color.
            /* 
            textureLoader.load( 'textures/grid.png', function ( texture ) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 40, 40 );
                ground.material.map = texture;
                ground.material.needsUpdate = true;
            } );
            */

            // Tower 1
            const towerMass = 1000;
            const towerHalfExtents = new THREE.Vector3(2, 5, 2);
            pos.set(-8, 5, 0);
            quat.set(0, 0, 0, 1);
            createObject(towerMass, towerHalfExtents, pos, quat, createMaterial(0xB03014));

            // Tower 2
            pos.set(8, 5, 0);
            quat.set(0, 0, 0, 1);
            createObject(towerMass, towerHalfExtents, pos, quat, createMaterial(0xB03214));

            // Bridge
            const bridgeMass = 100;
            const bridgeHalfExtents = new THREE.Vector3(7, 0.2, 1.5);
            pos.set(0, 10.2, 0);
            quat.set(0, 0, 0, 1);
            createObject(bridgeMass, bridgeHalfExtents, pos, quat, createMaterial(0xB3B865));

            // Stones
            const stoneMass = 120;
            const stoneHalfExtents = new THREE.Vector3(1, 2, 0.15);
            const numStones = 8;
            quat.set(0, 0, 0, 1);
            for (let i = 0; i < numStones; i++) {
                pos.set(0, 2, 15 * (0.5 - i / (numStones + 1)));
                createObject(stoneMass, stoneHalfExtents, pos, quat, createMaterial(0xB0B0B0));
            }

            // Mountain
            const mountainMass = 860;
            const mountainHalfExtents = new THREE.Vector3(4, 5, 4);
            pos.set(5, mountainHalfExtents.y * 0.5, -7);
            quat.set(0, 0, 0, 1);
            const mountainPoints = [];
            mountainPoints.push(new THREE.Vector3(mountainHalfExtents.x, -mountainHalfExtents.y, mountainHalfExtents.z));
            mountainPoints.push(new THREE.Vector3(-mountainHalfExtents.x, -mountainHalfExtents.y, mountainHalfExtents.z));
            mountainPoints.push(new THREE.Vector3(mountainHalfExtents.x, -mountainHalfExtents.y, -mountainHalfExtents.z));
            mountainPoints.push(new THREE.Vector3(-mountainHalfExtents.x, -mountainHalfExtents.y, -mountainHalfExtents.z));
            mountainPoints.push(new THREE.Vector3(0, mountainHalfExtents.y, 0));
            const mountain = new THREE.Mesh(new ConvexGeometry(mountainPoints), createMaterial(0xB03814));
            mountain.position.copy(pos);
            mountain.quaternion.copy(quat);
            convexBreaker.prepareBreakableObject(mountain, mountainMass, new THREE.Vector3(), new THREE.Vector3(), true);
            createDebrisFromBreakableObject(mountain);
        };

        const createParalellepipedWithPhysics = (sx: number, sy: number, sz: number, mass: number, pos: THREE.Vector3, quat: THREE.Quaternion, material: THREE.Material) => {
            const object = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), material);
            const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
            shape.setMargin(margin);

            createRigidBody(object, shape, mass, pos, quat);

            return object;
        };

        const createDebrisFromBreakableObject = (object: any) => {
            object.castShadow = true;
            object.receiveShadow = true;

            const shape = createConvexHullPhysicsShape(object.geometry.attributes.position.array);
            shape.setMargin(margin);

            const body = createRigidBody(object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity);

            // Set pointer back to the three object only in the debris objects
            const btVecUserData = new Ammo.btVector3(0, 0, 0);
            btVecUserData.threeObject = object;
            body.setUserPointer(btVecUserData);
        };

        const removeDebris = (object: any) => {
            scene.remove(object);
            physicsWorld.removeRigidBody(object.userData.physicsBody);
        };

        const createConvexHullPhysicsShape = (coords: ArrayLike<number>) => {
            const shape = new Ammo.btConvexHullShape();

            for (let i = 0, il = coords.length; i < il; i += 3) {
                tempBtVec3_1.setValue(coords[i], coords[i + 1], coords[i + 2]);
                const lastOne = (i >= (il - 3));
                shape.addPoint(tempBtVec3_1, lastOne);
            }

            return shape;
        };

        const createRigidBody = (object: any, physicsShape: any, mass: number, pos: THREE.Vector3 | null, quat: THREE.Quaternion | null, vel?: THREE.Vector3, angVel?: THREE.Vector3) => {
            // Re-using pos/quat variables if not provided is risky in loop, so we trust provided ones or object curr ones
            const p = pos || object.position;
            const q = quat || object.quaternion;

            // We set object pos/quat
            object.position.copy(p);
            object.quaternion.copy(q);

            const transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(p.x, p.y, p.z));
            transform.setRotation(new Ammo.btQuaternion(q.x, q.y, q.z, q.w));
            const motionState = new Ammo.btDefaultMotionState(transform);

            const localInertia = new Ammo.btVector3(0, 0, 0);
            physicsShape.calculateLocalInertia(mass, localInertia);

            const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
            rbInfo.set_m_restitution(0.5);
            rbInfo.set_m_friction(0.5);

            const body = new Ammo.btRigidBody(rbInfo);

            if (vel) {
                body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z));
            }
            if (angVel) {
                body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z));
            }

            object.userData.physicsBody = body;
            object.userData.collided = false;

            scene.add(object);

            if (mass > 0) {
                rigidBodies.push(object);
                // Disable deactivation
                body.setActivationState(4);
            }

            physicsWorld.addRigidBody(body);
            return body;
        };

        const createRandomColor = () => Math.floor(Math.random() * (1 << 24));

        const createMaterial = (color?: number) => {
            color = color || createRandomColor();
            return new THREE.MeshPhongMaterial({ color: color });
        };

        const initInput = () => {
            // Handle cleanup of event listeners carefully
            // We can attach to window, but better to cleanup in return
            window.addEventListener('pointerdown', onPointerDown);
        };

        const onPointerDown = (event: PointerEvent) => {
            mouseCoords.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );

            raycaster.setFromCamera(mouseCoords, camera);

            // Creates a ball and throws it
            const ballMass = 35;
            const ballRadius = 0.4;

            const ball = new THREE.Mesh(new THREE.SphereGeometry(ballRadius, 14, 10), ballMaterial);
            ball.castShadow = true;
            ball.receiveShadow = true;
            const ballShape = new Ammo.btSphereShape(ballRadius);
            ballShape.setMargin(margin);
            pos.copy(raycaster.ray.direction);
            pos.add(raycaster.ray.origin);
            quat.set(0, 0, 0, 1);
            const ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat);

            pos.copy(raycaster.ray.direction);
            pos.multiplyScalar(24);
            ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));
        };


        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const deltaTime = clock.getDelta();
            updatePhysics(deltaTime);
            if (stats) stats.update();
            renderer.render(scene, camera);
        };

        const updatePhysics = (deltaTime: number) => {
            // Step world
            physicsWorld.stepSimulation(deltaTime, 10);

            // Update rigid bodies
            for (let i = 0, il = rigidBodies.length; i < il; i++) {
                const objThree = rigidBodies[i];
                const objPhys: any = objThree.userData.physicsBody;
                const ms = objPhys.getMotionState();

                if (ms) {
                    ms.getWorldTransform(transformAux1);
                    const p = transformAux1.getOrigin();
                    const q = transformAux1.getRotation();
                    objThree.position.set(p.x(), p.y(), p.z());
                    objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

                    objThree.userData.collided = false;
                }
            }

            // Collision handling
            for (let i = 0, il = dispatcher.getNumManifolds(); i < il; i++) {
                const contactManifold = dispatcher.getManifoldByIndexInternal(i);
                const rb0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
                const rb1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);

                const threeObject0 = Ammo.castObject(rb0.getUserPointer(), Ammo.btVector3).threeObject;
                const threeObject1 = Ammo.castObject(rb1.getUserPointer(), Ammo.btVector3).threeObject;

                if (!threeObject0 && !threeObject1) continue;

                const userData0 = threeObject0 ? threeObject0.userData : null;
                const userData1 = threeObject1 ? threeObject1.userData : null;

                const breakable0 = userData0 ? userData0.breakable : false;
                const breakable1 = userData1 ? userData1.breakable : false;

                const collided0 = userData0 ? userData0.collided : false;
                const collided1 = userData1 ? userData1.collided : false;

                if ((!breakable0 && !breakable1) || (collided0 && collided1)) continue;

                let contact = false;
                let maxImpulse = 0;
                for (let j = 0, jl = contactManifold.getNumContacts(); j < jl; j++) {
                    const contactPoint = contactManifold.getContactPoint(j);
                    if (contactPoint.getDistance() < 0) {
                        contact = true;
                        const impulse = contactPoint.getAppliedImpulse();
                        if (impulse > maxImpulse) {
                            maxImpulse = impulse;
                            const pos = contactPoint.get_m_positionWorldOnB();
                            const normal = contactPoint.get_m_normalWorldOnB();
                            impactPoint.set(pos.x(), pos.y(), pos.z());
                            impactNormal.set(normal.x(), normal.y(), normal.z());
                        }
                        break;
                    }
                }

                if (!contact) continue;

                const fractureImpulse = 250;

                if (breakable0 && !collided0 && maxImpulse > fractureImpulse) {
                    const debris = convexBreaker.subdivideByImpact(threeObject0, impactPoint, impactNormal, 1, 2);
                    const numObjects = debris.length;
                    for (let j = 0; j < numObjects; j++) {
                        const vel = rb0.getLinearVelocity();
                        const angVel = rb0.getAngularVelocity();
                        const fragment = debris[j];
                        // @ts-ignore
                        fragment.userData.velocity.set(vel.x(), vel.y(), vel.z());
                        // @ts-ignore
                        fragment.userData.angularVelocity.set(angVel.x(), angVel.y(), angVel.z());

                        createDebrisFromBreakableObject(fragment);
                    }
                    objectsToRemove[numObjectsToRemove++] = threeObject0;
                    userData0.collided = true;
                }

                if (breakable1 && !collided1 && maxImpulse > fractureImpulse) {
                    const debris = convexBreaker.subdivideByImpact(threeObject1, impactPoint, impactNormal, 1, 2);
                    const numObjects = debris.length;
                    for (let j = 0; j < numObjects; j++) {
                        const vel = rb1.getLinearVelocity();
                        const angVel = rb1.getAngularVelocity();
                        const fragment = debris[j];
                        // @ts-ignore
                        fragment.userData.velocity.set(vel.x(), vel.y(), vel.z());
                        // @ts-ignore
                        fragment.userData.angularVelocity.set(angVel.x(), angVel.y(), angVel.z());

                        createDebrisFromBreakableObject(fragment);
                    }
                    objectsToRemove[numObjectsToRemove++] = threeObject1;
                    userData1.collided = true;
                }
            }

            for (let i = 0; i < numObjectsToRemove; i++) {
                removeDebris(objectsToRemove[i]);
            }
            numObjectsToRemove = 0;
        };


        // --- Load Ammo & Start ---
        if (typeof window.Ammo === 'function') {
            // Already loaded?
            // It might be a promise factory or the function itself depending on version. 
            // With the .wasm.js version from three, it usually returns a promise.
            window.Ammo().then((lib: any) => {
                Ammo = lib;
                init();
            });
        } else {
            // Load script
            const script = document.createElement('script');
            script.src = '/js/libs/ammo.wasm.js';
            script.async = true;
            script.onload = () => {
                window.Ammo().then((lib: any) => {
                    Ammo = lib;
                    init();
                });
            };
            document.body.appendChild(script);
        }

        return () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('pointerdown', onPointerDown);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            if (containerRef.current) containerRef.current.innerHTML = '';
            // Ideally we should also cleanup physics world but Ammo cleanup in JS is tricky/optional for this lifecycle
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full z-0 block"
            // Ensure interactions reach the canvas/window listener
            style={{ pointerEvents: 'auto' }}
        />
    );
}
