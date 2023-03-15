import { CharacterControls } from '../controls/characterControls';
import World from '../../world/World';
import { gltfLoader } from '../loaders/gltf';
import { Group } from 'three';


export default class Model {

    modelTypes: {} = {gltf: gltfLoader};
    model: Group | null = null
    type: string | null

    controls: CharacterControls | null = null
    W = 'w'
    A = 'a'
    S = 's'
    D = 'd'
    SHIFT      = 'shift'
    DIRECTIONS = [this.W, this.A, this.S, this.D]

    directionOffset: number 
    keysPressed: any 

    constructor(typeKey: string){
        typeKey in this.modelTypes ? this.type = typeKey : this.type = null
        this.directionOffset = 0 // w        
        this.keysPressed     = {}
    }

    loadModel(path: string, world: World, charControls: boolean = false){
        if(this.type && this.type in this.modelTypes){
            switch(this.type){
                case('gltf'):
                    gltfLoader(path, world, charControls) 
                    break;
                default:
                    break
            }
            if(charControls){
                this.initControllerEvents()
                this.controls = new CharacterControls(model, mixer, animationsMap, controls, camera, 'Idle')


            }
        }
    } 

    initControllerEvents(){
        document.addEventListener('keydown', (event) => {
            if (event.shiftKey && this.controls) {
                this.controls.switchRunToggle()
            } else {
                (this.keysPressed as any)[event.key.toLowerCase()] = true
            }
            console.log(this.keysPressed)
        }, false);
        
        document.addEventListener('keyup', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = false
        }, false);
    }
}













