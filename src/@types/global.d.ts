import { World } from "../world";

declare module '*.glb'

declare global {
    interface Window {
        world: World;
        sceneObjects: {
            controlledObjs: any[];
            calculatedObjs: any[];
        };
    }
}

export { Window }