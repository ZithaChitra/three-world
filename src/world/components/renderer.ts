import { WebGLRenderer } from 'three'

function createRenderer(canvas: HTMLCanvasElement){
    const renderer = new WebGLRenderer({antialias: true, canvas});
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.physicallyCorrectLights = true
    return renderer
}

export default createRenderer