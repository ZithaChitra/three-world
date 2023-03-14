import {
    BoxGeometry,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
} from 'three';

function createCube() {

    const geometry  = new BoxGeometry(2, 2, 2);
    const material  = new MeshStandardMaterial({ color: 'purple' });
    const cube      = new Mesh(geometry, material);

    cube.position.set(-0.5, -0.1, 1);
    cube.scale.set(1.25, 0.25, 0.5);

    // to rotate using degrees, they must
    // first be converted to radians
    cube.rotation.x = MathUtils.degToRad(-60);
    cube.rotation.y = MathUtils.degToRad(-45);
    cube.rotation.z = MathUtils.degToRad(60);

    return cube;
}

export default createCube;
  