export class MinMaxGUIHelper {

    obj:        any
    minProp:    string
    maxProp:    string
    minDif:     number

    constructor(obj: any, minProp: string, maxProp: string, minDif: number){
        this.obj        = obj
        this.minProp    = minProp
        this.maxProp    = maxProp
        this.minDif     = minDif
    }

    get min(): number{
        return this.obj[this.minProp]
    }

    set min(v: number){
        this.obj[this.minProp] = v
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif)
    }

    get max(): number{
        return this.obj[this.maxProp]
    }

    set max(v: number){
        this.obj[this.maxProp] = v
        this.min = this.min     // this calls the min setter
    }
}