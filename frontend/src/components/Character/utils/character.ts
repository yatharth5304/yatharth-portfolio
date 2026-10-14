import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { prepareScene } from './prepareScene';
export default function setCharacter(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    const loader = new GLTFLoader();
    return { async loadCharacter() {
            const gltf = await loader.loadAsync('/models/yatharth-developer.glb');
            prepareScene(gltf);
            gltf.scene.traverse(child => { const mesh = child as THREE.Mesh; if (mesh.isMesh) {
                mesh.castShadow = false;
                mesh.receiveShadow = false;
                mesh.frustumCulled = true;
            } });
            gltf.scene.getObjectByName('footR')!.position.y = 3.36;
            gltf.scene.getObjectByName('footL')!.position.y = 3.36;
            await renderer.compileAsync(gltf.scene, camera, scene);
            return gltf;
        } };
}
