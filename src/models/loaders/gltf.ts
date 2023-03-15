import { AnimationClip, AnimationMixer, AnimationAction } from 'three';
import { CharacterControls } from '../controls/characterControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Model from '../base/Model';


import World from '../../world/World';

const W = 'w'
const A = 'a'
const S = 's'
const D = 'd'
const SHIFT = 'shift'
const DIRECTIONS = [W, A, S, D]

class gltfModel extends Model {
    constructor(){
        super('gltf')
    }
}
export function gltfLoader(path: string, world: World, charControls: boolean = false){
    const loader = new GLTFLoader()

    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.scale.setScalar(3)
        model.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true
        })
        world.scene.add(model)

        const gltfAnimations: AnimationClip[] = gltf.animations
        const mixer = new AnimationMixer(model)
        const animationsMap: Map<string, AnimationAction> = new Map()
        gltfAnimations.filter(a => a.name != 'TPose').forEach((a: AnimationClip) => {
            animationsMap.set(a.name, mixer.clipAction(a))
        })

        // characterControls = new CharacterControls(model, mixer, animationsMap, controls, camera, 'Idle')
        // if (keysPressed[W]) {
        //     if (keysPressed[A]) {
        //         directionOffset = Math.PI / 4 // w+a
        //     } else if (keysPressed[D]) {
        //         directionOffset = - Math.PI / 4 // w+d
        //     }
        // } else if (keysPressed[S]) {
        //     if (keysPressed[A]) {
        //         directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
        //     } else if (keysPressed[D]) {
        //         directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
        //     } else {
        //         directionOffset = Math.PI // s
        //     }
        // } else if (keysPressed[A]) {
        //     directionOffset = Math.PI / 2 // a
        // } else if (keysPressed[D]) {
        //     directionOffset = - Math.PI / 2 // d
        // }


        // return directionOffset

    })
}


export default function addGltfToScene(path: string, world: World, charControls: boolean = false){
    const loader = new GLTFLoader()

    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.scale.setScalar(3)
        model.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true
        })
        world.scene.add(model)

        const gltfAnimations: AnimationClip[] = gltf.animations
        const mixer = new AnimationMixer(model)
        const animationsMap: Map<string, AnimationAction> = new Map()
        gltfAnimations.filter(a => a.name != 'TPose').forEach((a: AnimationClip) => {
            animationsMap.set(a.name, mixer.clipAction(a))
        })

        // characterControls = new CharacterControls(model, mixer, animationsMap, controls, camera, 'Idle')
        // if (keysPressed[W]) {
        //     if (keysPressed[A]) {
        //         directionOffset = Math.PI / 4 // w+a
        //     } else if (keysPressed[D]) {
        //         directionOffset = - Math.PI / 4 // w+d
        //     }
        // } else if (keysPressed[S]) {
        //     if (keysPressed[A]) {
        //         directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
        //     } else if (keysPressed[D]) {
        //         directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
        //     } else {
        //         directionOffset = Math.PI // s
        //     }
        // } else if (keysPressed[A]) {
        //     directionOffset = Math.PI / 2 // a
        // } else if (keysPressed[D]) {
        //     directionOffset = - Math.PI / 2 // d
        // }


        // return directionOffset

    })
    
}