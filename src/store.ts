import { Mesh, PlaneGeometry, MeshStandardMaterial, BoxGeometry, MeshPhongMaterial, SphereGeometry } from 'three'

let controlledObjs: any[] = [] // with controllers
let calculatedObjs: any[] = [] // without controllers

let sceneObjects = {
    calculatedObjs,
    controlledObjs
}

let animatedObjsModelsPaths = ['/assets/Soldier.glb']
const planeSize = 40

const plane = new Mesh(
    new PlaneGeometry(planeSize, planeSize, 10, 10),
    new MeshStandardMaterial({color: 0x202020})
)


plane.castShadow    = false
plane.receiveShadow = true
plane.rotation.x    = -Math.PI / 2

sceneObjects.calculatedObjs.push(plane)     // - 1 

{
    const cubeSize  = 4
    const cubeGeo   = new BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat   = new MeshPhongMaterial({color: '#8AC'})
    const mesh      = new Mesh(cubeGeo, cubeMat)
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
    sceneObjects.calculatedObjs.push(mesh)  // - 2
}

{
    const sphereRadius          = 3
    const sphereWidthDivisions  = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const sphereMat = new MeshPhongMaterial({color: '#CA8'})
    const mesh      = new Mesh(sphereGeo, sphereMat)
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
    sceneObjects.calculatedObjs.push(mesh)  // - 3
}



export { sceneObjects, animatedObjsModelsPaths }

