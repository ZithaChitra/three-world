import { AxesHelper, AnimationClip, AnimationMixer,AnimationAction} from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { CharacterControls } from './CharControls'


const gltfLoadHandler = function(gltf: GLTF){
    const model = gltf.scene

    model.traverse((object: any) => {
        if(object.isMesh) object.castShadow = true
    })
    console.log(gltf)

    const cubeAxis = new AxesHelper()
    cubeAxis.material.depthTest = false
    cubeAxis.renderOrder        = 1
    model.add(cubeAxis)

    window.sceneObjects.calculatedObjs.push(model)
    // world._scene.add(model)

    const gltfAnimations: AnimationClip[] = gltf.animations
    // we use the animation mixer to transform animation clips to
    // animation actions. the 'animation actions' enable us to fade-in
    // or fade-out animations, for smooth animation transitions
    const mixer = new AnimationMixer(model)
    const animationsMap: Map<string, AnimationAction> = new Map()
    gltfAnimations
        .filter((a: AnimationClip) => a.name != 'TPose')
        .forEach((a: AnimationClip) => {
            animationsMap.set(a.name, mixer.clipAction(a))
        })
    
    let charControls = new CharacterControls(model, animationsMap, window.world._controls, 
    'idle', window.world._camera, mixer)
    
    window.sceneObjects.controlledObjs.push(charControls)
        const event = new Event('controlledObjectAdded')
        document.dispatchEvent(event)
}
export { gltfLoadHandler }