import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

/** Keep the reference character entirely unchanged. Validate the existing rig
 * and replace only the separate monitor's personal screenshot with site content. */
export function prepareScene(gltf: GLTF) {
    const scene = gltf.scene;
    const names = ['spine006', 'spine005', 'footR', 'footL', 'eyebrow_L', 'eyebrow_R', 'screenlight', 'Plane004', 'hair'];
    const clips = ['typing', 'browup', 'introAnimation', 'Blink', 'key1', 'key2', 'key5', 'key6'];
    const missing = [...names.filter(name => !scene.getObjectByName(name)), ...clips.filter(name => !gltf.animations.some(clip => clip.name === name))];
    if (missing.length) throw new Error(`Incompatible reference rig: ${missing.join(', ')}`);
    const monitor = scene.getObjectByName('Plane004');
    if (!monitor?.children.some(node => ((node as THREE.Mesh).material as THREE.Material)?.name === 'Material.027')) throw new Error('Animated monitor material missing');

    // This is a scene prop, not the character: no mesh, hair, skin, face,
    // clothing, bone mapping, rest pose or animation data is customized.
    const screen = scene.getObjectByName('screenlight') as THREE.Mesh;
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 640;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0b080c'; ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = '#c2a4ff'; ctx.font = '28px monospace';
    ctx.fillText('yatharth@backend ~ portfolio', 48, 65);
    ctx.fillStyle = '#eae5ec'; ctx.font = '24px monospace';
    ['$ java -jar portfolio.jar', 'Spring Boot · REST API · PostgreSQL', '', 'GET /api/projects        200 OK', 'GET /api/experiences     200 OK', 'GET /api/skills          200 OK', '', 'Building backend systems', 'that hold under pressure.'].forEach((line, i) => ctx.fillText(line, 48, 130 + i * 48));
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false; texture.colorSpace = THREE.SRGBColorSpace;
    const material = screen.material as THREE.MeshStandardMaterial;
    material.map = texture; material.emissiveMap = texture; material.needsUpdate = true;
}
