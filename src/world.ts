import {
    WebGLRenderer, PerspectiveCamera, Scene, Clock,
    DirectionalLight, AmbientLight, CameraHelper,
} from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MinMaxGUIHelper } from './utils/il-gui-helper/helpers';


export class World {
    _renderer!:  WebGLRenderer
    _controls!:  OrbitControls
    _camera!:    PerspectiveCamera    
    _scene!:     Scene
    _gui!:       GUI

    _camera2!:   PerspectiveCamera
    _controls2!: OrbitControls

    clock: Clock            = new Clock()

    constructor(){
        this.__init()
    }

    __init(){
        this._renderer = new WebGLRenderer({antialias: true}) 
        this._renderer.shadowMap.enabled = true
        this._renderer.setSize(window.innerWidth, window.innerHeight)

        this._scene = new Scene()

        
        const aspect    = 2
        const fov       = 45
        const near      = 0.1   
        const far       = 100
        this._camera = new PerspectiveCamera(fov, aspect, near, far)  
        this._camera.position.set(0, 10, 20)
        
        this._gui       = new GUI()
        const camProps = this._gui.addFolder('main cam').onChange(() => this.render())
        const minMaxGUIHelper = new MinMaxGUIHelper(this._camera, 'near', 'far', 0.1)
        camProps.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near')
        camProps.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')
        camProps.close()

        const cameraHelper = new CameraHelper(this._camera) // draws the frustrum of cam
        this._scene.add(cameraHelper)

        const view1Elem = document.querySelector('#view1')!
        const view2Elem = document.querySelector('#view2')!


        this._controls = new OrbitControls(
            this._camera, (view1Elem as HTMLElement)
        )
        this._controls.target.set(0, 5, 0)
        this._controls.update()

        this._controls.addEventListener('change', () => this._onChangeHandler())


        this._camera2 = new PerspectiveCamera(60, 2, 0.1, 500)
        this._camera2.position.set(40, 10, 30)
        this._camera2.lookAt(0, 5, 0)

        this._controls2 = new OrbitControls(this._camera2, (view2Elem as HTMLElement))
        this._controls2.target.set(0, 5, 0) 
        this._controls2.update()



        // camProps.add(this._camera.position, 'x').name('pos-x').min(0).max(10).step(1)
        // camProps.add(this._camera.position, 'y').name('pos-y').min(0).max(10).step(1)
        // camProps.add(this._camera.position, 'z').name('pos-z').min(0).max(10).step(1)
        // camProps.close()


        let light   = new DirectionalLight(0xFFFFFF, 1.0)
        light.position.set(20, 100, 10)
        light.target.position.set(0, 0, 0)
        light.shadow.mapSize.height = 2048;
        light.shadow.mapSize.width  = 2048;
        light.shadow.camera.bottom  = -100;
        light.shadow.camera.near    = 0.1;
        light.shadow.camera.right   = -100;
        light.shadow.camera.near    = 0.5;
        light.shadow.camera.left    = 100;
        light.shadow.camera.far     = 500.0;
        light.shadow.camera.top     = 100;
        light.shadow.camera.far     = 500.0;
        light.shadow.bias           = -0.001;
        light.castShadow            = true;

        this._scene.add(light)

        let ambLight = new AmbientLight(0xFFFFFF, 1.4)
        this._scene.add(ambLight)

        window.addEventListener('resize', () => this._onChangeHandler(), false)

    }

    updateCamera(){
        console.log('Camera updating but not rerendering')
        this._camera.updateProjectionMatrix()
    }


    addObjectToScene(object: any){
        this._scene.add(object)
    }

    addWorldToCanv(attachTo: HTMLElement){
        attachTo.appendChild(this._renderer.domElement) 
    }

    addObjectsArrayToScene(objects: any[]){
        for(let object of objects){
            this._scene.add(object)
        }
    }


    render(){
        // if(!this.clock.running){
        //     this.clock.start()
        // }
        if(window.sceneObjects.controlledObjs.length > 0){
            window.sceneObjects.controlledObjs.forEach(obj => {
                // let mixerUpdateDelta = this.clock.getDelta()
                obj.update(2)
            })
            
            console.log('window.world: ', window.world)
            console.log('this: ', this)
            this._controls.update()
            this._renderer.render(this._scene, this._camera)
            requestAnimationFrame(this.render)
            console.log('rendering with animated objects')
        }else{
            this._renderer.render(this._scene, this._camera)
            console.log('rendering without animated objects')
        }
    }

    _onChangeHandler(){
        this._camera.aspect = window.innerWidth / window.innerHeight
        this._camera.updateProjectionMatrix()

        this._renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
    }
}