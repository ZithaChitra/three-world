import { Camera, AnimationMixer, AnimationAction, Group } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// a state machine
export class CharacterControls {
    // state
    toggleRun       = true
    keyPressed      = {}
    currentAction!: string
    
    // in order to move and update the character we must provide the following:
    animationsMap:  Map<string, AnimationAction>
    orbitControls:  OrbitControls
    camera:         Camera
    model:          Group
    mixer:          AnimationMixer    

    constructor(model: Group, animationsMap: Map<string, AnimationAction>,
        orbitControls: OrbitControls, currentAction: string,
        camera: Camera, mixer: AnimationMixer){
        this.animationsMap = animationsMap
        this.orbitControls = orbitControls
        this.model  = model
        this.mixer  = mixer
        this.camera = camera

        this.animationsMap.forEach((value, key)=>{
            if(key === currentAction){
                value.play()
            }
        })

        this._initModelEvents()
    }

    _initModelEvents(){
    
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            // if(event.shiftKey && charControls){
                // charControls.switchRunToggle()
            // }else{
                // let's walk for now and run later
                (this.keyPressed as any)[event.key.toLocaleLowerCase()] = true
                console.log(this.keyPressed)
            // }
        }, false)
        
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            (this.keyPressed as any)[event.key.toLocaleLowerCase()] = false
            console.log(this.keyPressed)
        })
    }


    switchRunToggle(){
        this.toggleRun = !this.toggleRun
    }

    /* 
        called at every frame in the animation loop to calculate the next state
        , the movement speed and directions, and to update the animation with
        the animation mixer
    */
    update(delta: number){
        console.log('CharControl udate function runnning. delta: ', delta)
    }

}
