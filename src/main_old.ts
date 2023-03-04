import './style.css'
import { World } from './world'
import { sceneObjects, animatedObjsModelsPaths } from './store'
import { gltfLoadHandler } from './models/utils/gltf'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

interface sceneObjects {
    calculatedObjs: any[];
    controlledObjs: any[];
}

let _world = new World()
window.world = _world
let app = document.getElementById('app')!

window.sceneObjects = sceneObjects

window.world.addObjectsArrayToScene(window.sceneObjects.calculatedObjs)

window.world.addWorldToCanv(app)
window.world.render()

// document.addEventListener('controlledObjectsLoaded', () => {
//     console.log('controlledObjectsLoaded event handler')
//     console.log('controlled objects global: ', sceneObjects.controlledObjs)
//     window.world.render()
// })

// loadControlledModels()

function loadControlledModels(){
    document.addEventListener('controlledObjectAdded', () => {
        if(window.sceneObjects.controlledObjs.length != animatedObjsModelsPaths.length){
            console.log('controlled object added: not done loading')
            return
        }else{
            console.log('controlled object added: done loading')
            let event = new Event('controlledObjectsLoaded')
            document.dispatchEvent(event)
            return
        }
    })

    animatedObjsModelsPaths.forEach(objPath => {
        let loader = new GLTFLoader()
        loader.load(objPath, (gltf: GLTF) => gltfLoadHandler(gltf))
    })
}

