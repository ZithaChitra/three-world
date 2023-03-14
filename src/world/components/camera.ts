import { PerspectiveCamera } from 'three' 

function createCamera(){
    const aspect = 2;  // the canvas default
    const fov    = 45;
    const near   = 5;
    const far    = 100;

    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 30);  
    return camera
}

export default createCamera