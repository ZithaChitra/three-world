// Three.js - Cameras - Perspective 2 views
// from https://threejs.org/manual/examples/cameras-perspective-2-scenes.html


import {
    WebGLRenderer, PerspectiveCamera, CameraHelper, Color, Scene,
    PlaneGeometry, Mesh, DirectionalLight, MeshStandardMaterial, Clock
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CharacterControls } from './characterControls';
import { AnimationClip, AnimationMixer, AnimationAction } from 'three';

const W = 'w'
const A = 'a'
const S = 's'
const D = 'd'
const SHIFT = 'shift'
const DIRECTIONS = [W, A, S, D]


function main() {
    const canvas = document.querySelector('#c')!;
    const view1Elem = document.querySelector('#view1')!;
    const view2Elem = document.querySelector('#view2')!;
    const renderer = new WebGLRenderer({ antialias: true, canvas });

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 5;
    const far = 100;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    const cameraHelper = new CameraHelper(camera);

    class MinMaxGUIHelper {
        obj: any
        minProp: any
        maxProp: any
        minDif: any


        constructor(obj: any, minProp: any, maxProp: any, minDif: any) {
            this.obj = obj;
            this.minProp = minProp;
            this.maxProp = maxProp;
            this.minDif = minDif;
        }
        get min() {
            return this.obj[this.minProp];
        }
        set min(v) {
            this.obj[this.minProp] = v;
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
        }
        get max() {
            return this.obj[this.maxProp];
        }
        set max(v) {
            this.obj[this.maxProp] = v;
            this.min = this.min;  // this will call the min setter
        }
    }

    const gui = new GUI();
    gui.onChange(() => render());
    gui.add(camera, 'fov', 1, 180);
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');

    const controls = new OrbitControls(camera, (view1Elem as HTMLElement));
    controls.target.set(0, 5, 0);
    controls.update();

    controls.addEventListener('change', () => render())

    const camera2 = new PerspectiveCamera(
        60,  // fov
        2,   // aspect
        0.1, // near
        500, // far
    );
    camera2.position.set(40, 10, 30);
    camera2.lookAt(0, 5, 0);

    const controls2 = new OrbitControls(camera2, (view2Elem as HTMLElement));
    controls2.target.set(0, 5, 0);
    controls2.update();

    controls2.addEventListener('change', () => render())

    const scene = new Scene();
    scene.background = new Color('black');
    scene.add(cameraHelper);

    {
        const planeSize = 40;


        const plane = new Mesh(
            new PlaneGeometry(planeSize, planeSize, 1, 1),
            new MeshStandardMaterial({ color: 0x202020 })
        )


        plane.castShadow = false
        plane.receiveShadow = true
        plane.rotation.x = Math.PI * -.5;

        scene.add(plane)
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }


    let characterControls: CharacterControls

    const loader = new GLTFLoader()
    loader.load('/models/Soldier.glb', (gltf) => {
        const model = gltf.scene
        model.scale.setScalar(3)
        model.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true
        })
        scene.add(model)

        const gltfAnimations: AnimationClip[] = gltf.animations
        const mixer = new AnimationMixer(model)
        const animationsMap: Map<string, AnimationAction> = new Map()
        gltfAnimations.filter(a => a.name != 'TPose').forEach((a: AnimationClip) => {
            animationsMap.set(a.name, mixer.clipAction(a))
        })

        characterControls = new CharacterControls(model, mixer, animationsMap, controls, camera, 'Idle')
        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed[D]) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed[D]) {
            directionOffset = - Math.PI / 2 // d
        }


        return directionOffset

    })


    let directionOffset = 0 // w
    let keysPressed: any = {}

    document.addEventListener('keydown', (event) => {
        if (event.shiftKey && characterControls) {
            characterControls.switchRunToggle()
        } else {
            (keysPressed as any)[event.key.toLowerCase()] = true
        }
        console.log(keysPressed)
        // render()
    }, false);
    
    document.addEventListener('keyup', (event) => {
        (keysPressed as any)[event.key.toLowerCase()] = false
    }, false);



    function resizeRendererToDisplaySize(renderer: any) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function setScissorForElement(elem: any) {
        const canvasRect = canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();

        // compute a canvas relative rectangle
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);

        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);

        // setup the scissor to only render to that part of the canvas
        const positiveYUpBottom = canvasRect.height - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);

        // return the aspect
        return width / height;
    }

    let clock = new Clock()
    function render() {
        let mixerUpdateDelta = clock.getDelta()
        if (characterControls) {
            characterControls.update(mixerUpdateDelta, keysPressed);
        }

        resizeRendererToDisplaySize(renderer);

        // turn on the scissor
        renderer.setScissorTest(true);

        // render the original view
        {
            const aspect = setScissorForElement(view1Elem);

            // adjust the camera for this aspect
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            cameraHelper.update();

            // don't draw the camera helper in the original view
            cameraHelper.visible = false;

            // scene.background.set(0x000000);
            scene.background = new Color(0x000000)

            // render
            renderer.render(scene, camera);
        }

        // render from the 2nd camera
        {
            const aspect = setScissorForElement(view2Elem);

            // adjust the camera for this aspect
            camera2.aspect = aspect;
            camera2.updateProjectionMatrix();  //   const sphereRadius = 3;


            // draw the camera helper in the 2nd view
            cameraHelper.visible = true;

            scene.background = new Color(0x000040);

            renderer.render(scene, camera2);
        }

        requestAnimationFrame(render);
    }
    render()

    // requestAnimationFrame(render);
}

main();
