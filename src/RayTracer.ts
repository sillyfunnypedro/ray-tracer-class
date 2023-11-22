/**
 * @file RayTracer.ts
 * @desc RayTracer class.
 */

import FrameBuffer from "./FrameBuffer"
import Color from "./Color"
import Camera from "./Camera"
import Ray from "./Geometry/Ray"



class Point {
    x: number = 0;
    y: number = 0;
    z: number = 0;
}

class RayTracer {
    private _frameBuffer: FrameBuffer;
    // private _scene: Scene;

    constructor(frameBuffer: FrameBuffer) {
        this._frameBuffer = frameBuffer;
    }

    public render(camera: Camera): void {
        for (let i = 0; i < this._frameBuffer.height; i++) {
            for (let j = 0; j < this._frameBuffer.width; j++) {
                // let ray: Ray = this._scene.camera.getRay(i, j);
                // let color: Color = this._scene.rayTrace(ray);
                this._frameBuffer.pixels[i][j] = new Color(255, 0, 0);
            }
        }
    }
    // returns intersection point of ray and sphere
    public sphereIntersect(center: Point, radius: number, rayoriginx: number, rayoriginy: number, rayoriginz: number, directionx: number, directiony: number, directionz: number): number[] {

        let a = directionx * directionx + directiony * directiony + directionz * directionz;
        let b = 2 * (directionx * (rayoriginx - center.x) + directiony * (rayoriginy - center.y) + directionz * (rayoriginz - center.z));
        let c = (rayoriginx - center.x) * (rayoriginx - center.x) + (rayoriginy - center.y) * (rayoriginy - center.y) + (rayoriginz - center.z) * (rayoriginz - center.z) - radius * radius;
        let discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            return [];
        }

        let t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        let t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        // return the smaller of the two values
        let resulultingT = Math.min(t1, t2);
        // calculate the intersection point
        // assume direction is normalized

        let intersectionPointx = rayoriginx + directionx * resulultingT;


        let intersectionPointy = rayoriginy + directiony * resulultingT;

        let intersectionPointz = rayoriginz + directionz * resulultingT;

        return [intersectionPointx, intersectionPointy, intersectionPointz];
    }



}

export default RayTracer;