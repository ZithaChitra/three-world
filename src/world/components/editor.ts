import { PerspectiveCamera, CameraHelper, Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import MinMaxGUIHelper from "./util/guiHelper";
import { GUI } from 'lil-gui'
import World from "../World";



function setScissorForElement(world: World, elem: any) {
    const canvasRect = world.renderer.domElement.getBoundingClientRect();
    const elemRect   = elem.getBoundingClientRect();

    // compute a canvas relative rectangle
    const right  = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left   = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top    = Math.max(0, elemRect.top - canvasRect.top);

    const width  = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom;
    world.renderer.setScissor(left, positiveYUpBottom, width, height);
    world.renderer.setViewport(left, positiveYUpBottom, width, height);

    // return the aspect
    return width / height;
}

function startEditorDislpay(world: World, props: {view1El: any, view2El: any, camera2: PerspectiveCamera, cameraHelper: CameraHelper}){

    // turn on the scissor
    world.renderer.setScissorTest(true);

    // render the original view
    {
        const aspect = setScissorForElement(world, props.view1El);

        // adjust the camera for this aspect
        world.camera.aspect = aspect;
        world.camera.updateProjectionMatrix();
        props.cameraHelper.update();

        // don't draw the camera helper in the original view
        props.cameraHelper.visible = false;

        // scene.background.set(0x000000);
        world.scene.background = new Color(0x000000)

        // render
        world.renderer.render(world.scene, world.camera);
    }

    // render from the 2nd camera
    {
        const aspect = setScissorForElement(world, props.view2El);

        // adjust the camera for this aspect
        props.camera2.aspect = aspect;
        props.camera2.updateProjectionMatrix();  //   const sphereRadius = 3;


        // draw the camera helper in the 2nd view
        props.cameraHelper.visible = true;

        world.scene.background = new Color(0x000040);

        world.renderer.render(world.scene, props.camera2);
    }
}

function startEditor(world: World){

    const cameraHelper = new CameraHelper(world.camera);

    let splitElem = document.querySelector('.split')! as HTMLElement
    splitElem.style.setProperty('display', 'flex')

    const view1El = document.querySelector('#view1')! as HTMLElement;
    const view2El = document.querySelector('#view2')! as HTMLElement;
    const camera2 = new PerspectiveCamera(
        60,  // fov
        2,   // aspect
        0.1, // near
        500, // far
    );
    camera2.position.set(40, 10, 30);
    camera2.lookAt(0, 5, 0);

    // world.controls.domElement = view1El
    // world.controls.update()
    // console.log(world.controls)

    let gui = new GUI()
    gui.onChange(() => world.render())
    gui.add(world.camera, 'fov', 1, 180);
    const minMaxGUIHelper = new MinMaxGUIHelper(world.camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near');
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far');



    const controls = new OrbitControls(world.camera, view1El)
    controls.target.set(0, 5, 0)
    controls.update()
    controls.addEventListener('change', () => {
        console.log('controls event handler')
        world.render()
    })

    const controls2 = new OrbitControls(camera2, view2El);
    controls2.target.set(0, 5, 0);
    controls2.update();
    controls2.addEventListener('change', () => {
        console.log('controls2 event handler')
        world.render()})

    world.scene.add(cameraHelper);

    return {view1El, view2El, camera2, cameraHelper}

}



export { startEditor, startEditorDislpay }