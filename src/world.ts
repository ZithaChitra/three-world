import {
    WebGLRenderer, PerspectiveCamera, Scene, Clock,
    DirectionalLight, AmbientLight, CameraHelper, Color,
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

    view1Elem!: HTMLElement
    view2Elem!: HTMLElement

    cameraHelper!: CameraHelper

    clock: Clock            = new Clock()

    constructor(){
        this.__init()
    }

    __init(){
        const canvas = document.querySelector('#c')!
        this._renderer = new WebGLRenderer({antialias: true, canvas: (canvas as HTMLElement)}) 
        // console.log(this._renderer)
        this._renderer.shadowMap.enabled = true
        // this._renderer.setSize(window.innerWidth, window.innerHeight)

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

        this.cameraHelper = new CameraHelper(this._camera) // draws the frustrum of cam
        this._scene.add(this.cameraHelper)

        this.view1Elem = document.querySelector('#view1')!
        this.view2Elem = document.querySelector('#view2')!


        this._controls = new OrbitControls(this._camera, this.view1Elem)
        this._controls.target.set(0, 5, 0)
        this._controls.update()

        this._controls.addEventListener('change', () => this._onChangeHandler())


        this._camera2 = new PerspectiveCamera(60, 2, 0.1, 500)
        this._camera2.position.set(40, 10, 30)
        this._camera2.lookAt(0, 5, 0)

        this._controls2 = new OrbitControls(this._camera2, this.view2Elem)
        this._controls2.target.set(0, 5, 0) 
        this._controls2.update()

        this._controls2.addEventListener('change', () => this._onChangeHandler())


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

    /*
        we need to render the scene from the point of view of each camera
        using the scissor to only render to part of the canvas

        given an element this function will compute the rectangle of that element
        that overlaps the canvas. It will then set the scissor and viewport to
        that rectangle and return the aspect size.
    */


    resizeRendererToDisplaySize(){
        console.log('i am inside resizeRenderToDisplaySize function')
        console.log(this)
        const canvas     = this._renderer.domElement
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const needResize = canvas.width !== width || canvas.height !== height
        if(needResize){
            this._renderer.setSize(width, height, false)
        }
        return needResize
    }

    setScissorForElement(elem: HTMLElement){
        const canvas     = document.querySelector('#c')!
        const canvasRect = canvas.getBoundingClientRect()
        const elemRect   = elem.getBoundingClientRect()


        // compute a canvas relative rectangle
        const right  = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
        const left   = Math.max(0, elemRect.left - canvasRect.left)
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
        const top    = Math.max(0, elemRect.top - canvasRect.top )

        const width  = Math.min(canvasRect.width, right - left)
        const height = Math.min(canvasRect.height, bottom - top)

        // setup the scissor to only render to that part of the canvas
        const positiveYUpBottom = canvasRect.height
        this._renderer.setScissor(left, positiveYUpBottom, width, height)
        this._renderer.setViewport(left, positiveYUpBottom, width, height)

        // return the aspect
        return width / height

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
        // if(window.sceneObjects.controlledObjs.length > 0){
        //     window.sceneObjects.controlledObjs.forEach(obj => {
        //         // let mixerUpdateDelta = this.clock.getDelta()
        //         obj.update(2)
        //     })
            
        //     console.log('window.world: ', window.world)
        //     console.log('this: ', this)
        //     this._controls.update()
        //     this._renderer.render(this._scene, this._camera)
        //     requestAnimationFrame(this.render)
        //     console.log('rendering with animated objects')
        // }else{
        //     this._renderer.render(this._scene, this._camera)
        //     console.log('rendering without animated objects')
        // }
        // console.log(this)
        // console.log(window.world)
        this.resizeRendererToDisplaySize()

        // turn on the scissor
        this._renderer.setScissorTest(true)


        // render the original view
        {
            const aspect = this.setScissorForElement(this.view1Elem)

            // adjust the camera this aspect
            this._camera.aspect = aspect
            this._camera.updateMatrix()
            this.cameraHelper.update()

            // dont draw the camera helper in the original view
            this.cameraHelper.visible = false

            this._scene.background = new Color(0x000000)

            // render
            this._renderer.render(this._scene, this._camera)
        }

        // render from the second camera
        {
            const aspect = this.setScissorForElement(this.view2Elem)

            // adjust the camera for this aspect
            this._camera2.aspect = aspect
            this._camera2.updateProjectionMatrix()

            // draw the camera helper in the second view
            this.cameraHelper.visible = true

            this._scene.background = new Color(0x000040)

            this._renderer.render(this._scene, this._camera2)
        }

        // requestAnimationFrame(this.render.bind(this))
    }

    _onChangeHandler(){
        this.render()
    }
}