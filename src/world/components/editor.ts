import World from "../World";
import { PerspectiveCamera, CameraHelper, Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";



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

function startEditorDislpay(world: World, view1El: any, view2El: any, camera2: PerspectiveCamera, cameraHelper: CameraHelper){

    // turn on the scissor
    world.renderer.setScissorTest(true);

    // render the original view
    {
        const aspect = setScissorForElement(world, view1El);

        // adjust the camera for this aspect
        world.camera.aspect = aspect;
        world.camera.updateProjectionMatrix();
        cameraHelper.update();

        // don't draw the camera helper in the original view
        cameraHelper.visible = false;

        // scene.background.set(0x000000);
        world.scene.background = new Color(0x000000)

        // render
        world.renderer.render(world.scene, world.camera);
    }

    // render from the 2nd camera
    {
        const aspect = setScissorForElement(world, view2El);

        // adjust the camera for this aspect
        camera2.aspect = aspect;
        camera2.updateProjectionMatrix();  //   const sphereRadius = 3;


        // draw the camera helper in the 2nd view
        cameraHelper.visible = true;

        world.scene.background = new Color(0x000040);

        world.renderer.render(world.scene, camera2);
    }
}

function startEditor(world: World){

    const cameraHelper = new CameraHelper(world.camera);
    
    const view1Elem = document.querySelector('#view1')!;
    const view2Elem = document.querySelector('#view2')!;
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
    controls2.addEventListener('change', () => world.render())

    world.scene.add(cameraHelper);

    startEditorDislpay(world, view1Elem, view2Elem, camera2, cameraHelper)
}



export default startEditor