import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight
 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import createRenderer from './components/renderer'
import addGltfToScene from '../models/loaders/gltf'
import createLights from './components/lights'
import createCamera from './components/camera'
import createScene from './components/scene'
import createPlane from './components/plane'
import createCube from './components/cube'


export default class World {
    renderer:   WebGLRenderer
    scene:      Scene
    light:      DirectionalLight

    camera:     PerspectiveCamera
    controls:   OrbitControls


    sceneObjects!: [any]

    constructor(canvas: HTMLCanvasElement){
        this.renderer = createRenderer(canvas)
        this.scene    = createScene()
        this.camera   = createCamera()

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target.set(0, 5, 0);
        this.controls.update();
        this.controls.addEventListener('change', () => {
            this.render()})

        this.light    = createLights()
        this.scene.add(this.light)

        const cube    = createCube()
        this.scene.add(cube)

        const plane   = createPlane()
        this.scene.add(plane)

        const soldierPath = '/models/Soldier.glb'
        addGltfToScene(soldierPath, this)


        window.addEventListener('resize',() => this.render(true))
    }

    addToSceneObjects(objs: [any]){
        for(let obj of objs){
            this.sceneObjects.push(objs[obj])
        }
    }

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(window.innerWidth, window.innerHeight)

         // set the pixel ratio (for mobile devices)
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }


    render(resize: boolean = false){
        if(resize){
            this.resize()
        }
        
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(() => this.render())
    }
}
