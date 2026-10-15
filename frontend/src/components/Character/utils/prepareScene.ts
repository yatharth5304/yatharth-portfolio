import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { config } from '../../../config';

/** Retain the original rig and texture atlas. The screenlight is a glow mask,
 * separate from the monitor's physical display surface. */
export function prepareScene(gltf: GLTF) {
    const scene = gltf.scene;
    const names = ['spine006', 'spine005', 'footR', 'footL', 'eyebrow_L', 'eyebrow_R', 'EYEs001', 'screenlight', 'Plane004', 'hair'];
    const clips = ['typing', 'browup', 'introAnimation', 'Blink', 'key1', 'key2', 'key5', 'key6'];
    const missing = [...names.filter(name => !scene.getObjectByName(name)), ...clips.filter(name => !gltf.animations.some(clip => clip.name === name))];
    if (missing.length) throw new Error(`Incompatible reference rig: ${missing.join(', ')}`);
    const eyes = scene.getObjectByName('EYEs001') as THREE.SkinnedMesh;
    const eyeMaterial = eyes.material as THREE.MeshStandardMaterial;
    if (!eyes.isSkinnedMesh || !eyeMaterial.map?.image) {
        throw new Error('The original eye texture could not be decoded');
    }
    const monitor = scene.getObjectByName('Plane004');
    if (!monitor?.children.some(node => ((node as THREE.Mesh).material as THREE.Material)?.name === 'Material.027')) throw new Error('Animated monitor material missing');

    const glow = scene.getObjectByName('screenlight') as THREE.Mesh;
    if (!(glow.material as THREE.MeshStandardMaterial).map?.image) throw new Error('Monitor glow texture missing');
    const display = monitor.children.find(node => ((node as THREE.Mesh).material as THREE.Material)?.name === 'Material.028') as THREE.Mesh;
    if (!display) throw new Error('Physical monitor display missing');

    // Move the casing, panel and light together, retaining their authored local
    // coordinates. Previously only the casing moved during the entrance.
    const assembly = new THREE.Group();
    assembly.name = 'DesktopMonitor';
    scene.add(assembly);
    assembly.add(monitor, glow);

    // UVs come from the flat screen's local bounds, not the glow's atlas layout.
    display.geometry = display.geometry.clone();
    display.geometry.computeBoundingBox();
    const bounds = display.geometry.boundingBox!;
    const position = display.geometry.getAttribute('position');
    const uv = new Float32Array(position.count * 2);
    for (let i = 0; i < position.count; i++) {
        uv[i * 2] = 1 - (position.getX(i) - bounds.min.x) / (bounds.max.x - bounds.min.x);
        uv[i * 2 + 1] = (position.getY(i) - bounds.min.y) / (bounds.max.y - bounds.min.y);
    }
    display.geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 548;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0b080c'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#c2a4ff'; ctx.font = '28px monospace';
    ctx.fillText('yatharth@backend ~ portfolio', 48, 65);
    ctx.fillStyle = '#eae5ec'; ctx.font = '24px monospace';
    [config.developer.fullName, config.developer.title, 'Java / Spring Boot / PostgreSQL', '', ...config.projects.slice(0, 3).map(project => project.title)].forEach((line, i) => ctx.fillText(line, 48, 130 + i * 48));
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = display.material as THREE.MeshStandardMaterial;
    material.color.set('#ffffff'); material.emissive.set('#ffffff');
    material.emissiveIntensity = .35;
    material.map = texture; material.emissiveMap = texture; material.needsUpdate = true;
}
