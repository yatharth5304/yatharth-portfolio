import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import setCharacter from './utils/character';
import setLighting from './utils/lighting';
import setAnimations from './utils/animationUtils';
import { handleMouseMove, handleHeadRotation } from './utils/mouseUtils';
import { setCharTimeline, setAllTimeline } from '../utils/GsapScroll';
import { useLoading } from '../../context/LoadingProvider';
import { setProgress } from '../Loading';
declare global {
    interface Window {
        __portfolio3D?: {
            character: THREE.Object3D;
            camera: THREE.PerspectiveCamera;
            mixer: THREE.AnimationMixer;
            clips: string[];
            frames: number;
            hovering: boolean;
            renderer: THREE.WebGLRenderer;
            scene: THREE.Scene;
        };
    }
}
export default function Scene() {
    const canvasDiv = useRef<HTMLDivElement>(null), hoverDivRef = useRef<HTMLDivElement>(null);
    const { setLoading, setIsLoading } = useLoading();
    const [error, setError] = useState(''), [attempt, setAttempt] = useState(0);
    useEffect(() => {
        const container = canvasDiv.current;
        if (!container)
            return;
        let stopped = false, frame = 0, introTimer = 0, cleanupHover: (() => void) | undefined, cleanupScroll: (() => void) | undefined, charContext: gsap.Context | undefined;
        const scene = new THREE.Scene();
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: window.devicePixelRatio < 2, powerPreference: 'high-performance', preserveDrawingBuffer: import.meta.env.DEV });
        }
        catch {
            setError('WebGL could not start. Enable hardware acceleration and retry to view the full 3D experience.');
            setIsLoading(false);
            return;
        }
        const rect = container.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.domElement.setAttribute('aria-label', 'Interactive developer character');
        renderer.domElement.setAttribute('role', 'img');
        container.appendChild(renderer.domElement);
        const camera = new THREE.PerspectiveCamera(14.5, rect.width / rect.height, .1, 1000);
        camera.position.set(0, 13.1, 24.7);
        camera.zoom = 1.1;
        camera.updateProjectionMatrix();
        const clock = new THREE.Clock(), light = setLighting(scene), progress = setProgress(setLoading);
        let head: THREE.Object3D | undefined, screen: THREE.Object3D | undefined, mixer: THREE.AnimationMixer | undefined, character: THREE.Object3D | undefined;
        let isIntroPlaying = () => false;
        let mouse = { x: 0, y: 0 };
        const move = (event: MouseEvent) => handleMouseMove(event, (x, y) => { mouse = { x, y }; });
        document.addEventListener('mousemove', move);
        const resize = () => { const r = container.getBoundingClientRect(); if (!r.height)
            return; renderer.setSize(r.width, r.height); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); ScrollTrigger.refresh(); };
        window.addEventListener('resize', resize);
        const animate = () => { if (stopped)
            return; frame = requestAnimationFrame(animate); const delta = Math.min(clock.getDelta(), .1); mixer?.update(delta); if (head && !isIntroPlaying())
            handleHeadRotation(head, mouse.x, mouse.y, .1, .2, THREE.MathUtils.lerp); if (screen)
            light.setPointLight(screen); renderer.render(scene, camera); if (window.__portfolio3D)
            window.__portfolio3D.frames++; };
        animate();
        setCharacter(renderer, scene, camera).loadCharacter().then(async (gltf) => {
            if (stopped)
                return;
            character = gltf.scene;
            scene.add(character);
            const animations = setAnimations(gltf);
            mixer = animations.mixer;
            isIntroPlaying = animations.isIntroPlaying;
            if (hoverDivRef.current)
                cleanupHover = animations.hover(gltf, hoverDivRef.current);
            head = character.getObjectByName('spine006');
            screen = character.getObjectByName('screenlight');
            charContext = gsap.context(() => { cleanupScroll = setCharTimeline(character!, camera); setAllTimeline(); });
            window.__portfolio3D = { character, camera, mixer, clips: gltf.animations.map(c => c.name), frames: 0, hovering: false, renderer, scene };
            await progress.loaded();
            if (stopped)
                return;
            introTimer = window.setTimeout(() => { light.turnOnLights(); animations.startIntro(); }, 2500);
            renderer.domElement.dataset.characterReady = 'true';
            ScrollTrigger.refresh();
        }).catch(reason => { if (stopped)
            return; progress.clear(); setIsLoading(false); document.body.style.overflowY = 'auto'; setError(`The full 3D character could not load: ${reason instanceof Error ? reason.message : String(reason)}. Retry to restore it.`); });
        return () => { stopped = true; cancelAnimationFrame(frame); clearTimeout(introTimer); progress.cancel(); cleanupHover?.(); cleanupScroll?.(); charContext?.revert(); mixer?.stopAllAction(); document.removeEventListener('mousemove', move); window.removeEventListener('resize', resize); scene.traverse(o => { const m = o as THREE.Mesh; if (m.isMesh) {
            m.geometry.dispose();
            const materials = Array.isArray(m.material) ? m.material : [m.material];
            materials.forEach(material => material.dispose());
        } }); scene.environment?.dispose(); scene.clear(); renderer.dispose(); renderer.domElement.remove(); delete window.__portfolio3D; };
    }, [attempt, setLoading, setIsLoading]);
    return <><div className="character-container"><div className="character-model" ref={canvasDiv}><div className="character-rim"/><div className="character-hover" ref={hoverDivRef} onMouseEnter={() => { if (window.__portfolio3D)
        window.__portfolio3D.hovering = true; }} onMouseLeave={() => { if (window.__portfolio3D)
        window.__portfolio3D.hovering = false; }}/></div></div>{error && <div className="scene-error" role="alert"><p>{error}</p><button onClick={() => { setError(''); setAttempt(x => x + 1); }}>Retry 3D character</button></div>}</>;
}
