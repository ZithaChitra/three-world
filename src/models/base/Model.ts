import { CharacterControls } from '../controls/characterControls';
import World from '../../world/World';
import { gltfLoader } from '../loaders/gltf';


export default class Model {

    modelTypes: {} = {gltf: gltfLoader};
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
            this.modelTypes
        }
    } 
}