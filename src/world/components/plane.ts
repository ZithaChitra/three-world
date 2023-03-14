import { PlaneGeometry, MeshStandardMaterial, Mesh } from 'three'


function createPlane(){
    const planeSize = 40;
    const plane     = new Mesh(
        new PlaneGeometry(planeSize, planeSize, 1, 1),
        new MeshStandardMaterial({ color: 0x202020 })
        )
    plane.castShadow = false
    plane.receiveShadow = true
    plane.rotation.x = Math.PI * -.5;
    return plane
}

export default createPlane