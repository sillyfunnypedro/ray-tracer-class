/**
 * @module Geometry
 * 
 */

import { vec3, mat4 } from 'gl-matrix';
import Shape from './Shape';

import Ray from './Ray';

class Intersection {
    /**
     * Intersection position
     */
    position: vec3 = vec3.create();

    /**
     * Intersection normal
     */

    normal: vec3 = vec3.create();

    /** 
     * Reflected ray
     */
    reflectedRay: Ray = Ray.create();

    /**
     * Refracted ray
     */

    refractedRay: Ray = Ray.create();

    /**
     * Hit distance
     */
    hitDistance: number = 0;

    /**
     * Hit Shape
     */
    hitShape: Shape | null = null;

    /**
     * uv coordinates
     */
    uv: vec3 = vec3.create();

    /**
     * 
     * generation of the ray that hit us
     */
    generation: number = 0;

    static create(): Intersection {
        let position = vec3.create();
        let normal = vec3.create();
        let reflectedRay = Ray.create();
        let refractedRay = Ray.create();
        let hitDistance = 0;
        let hitShape = null;
        return new Intersection();
    }
}

export default Intersection;



