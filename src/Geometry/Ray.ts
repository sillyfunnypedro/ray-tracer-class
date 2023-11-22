/**
 * @module Ray
 * @desc Ray class
 */

import exp from 'constants';
import { vec3 } from 'gl-matrix';

/**
 * Ray class
 */

export class Ray {
    /**
     * Ray origin
     */
    origin: vec3;

    /**
     * Ray direction
     */
    direction: vec3;

    /**
     * Ray generation
     */
    generation: number = 0;

    /**
     * Ray constructor
     * @param {vec3} origin - Ray origin
     * @param {vec3} direction - Ray direction
     */
    constructor(origin: vec3, direction: vec3, generation: number = 0) {
        this.origin = origin;
        this.direction = direction;
        this.generation = generation
    }

    static create(): Ray {
        let origin = vec3.create();
        let direction = vec3.create();
        let generation = 0;
        return new Ray(origin, direction, generation);
    }
}

export default Ray;