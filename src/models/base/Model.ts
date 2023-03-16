import { CharacterControls } from '../controls/characterControls';
import { gltfLoader } from '../loaders/gltf';
import { Group } from 'three';
import World from '../../world/World';


export default class Model {

    modelTypes: {} = {gltf: gltfLoader};
    type: string | null
    
    model: Group | null = null
    controls: CharacterControls | null = null

    directionOffset: number 
    keysPressed: any 

    constructor(typeKey: string){
        typeKey in this.modelTypes ? this.type = typeKey : this.type = null
        this.directionOffset = 0 // w        
        this.keysPressed     = {}
    }

    loadModel(path: string, world: World, charControls: boolean = true){
        if(this.type && this.type in this.modelTypes){
            switch(this.type){
                case('gltf'):
                    gltfLoader(path, world, true, this) 
                    break;
                default:
                    break
            }
            if(charControls){
                this.initControllerEvents()
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
            console.log(this.keysPressed)
        }, false);
    }
}













