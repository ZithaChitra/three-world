import { AnimationClip, AnimationMixer, AnimationAction } from 'three';
import { CharacterControls } from '../controls/characterControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import World from '../../world/World';
import Model from '../base/Model';

export function gltfLoader(path: string, world: World, charControls: boolean = false, charModel: Model){
    const loader = new GLTFLoader()

    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.scale.setScalar(3)
        model.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true
        })
        
        world.scene.add(model)
        charModel.model = model

        const gltfAnimations: AnimationClip[] = gltf.animations
        const mixer = new AnimationMixer(model)
        const animationsMap: Map<string, AnimationAction> = new Map()
        gltfAnimations.filter(a => a.name != 'TPose').forEach((a: AnimationClip) => {
            animationsMap.set(a.name, mixer.clipAction(a))
        })
        if(charControls){
            charModel.controls = new CharacterControls(charModel.model, mixer, animationsMap, world.controls, world.camera, 'Idle')
        }
    })
}

