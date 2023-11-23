/**
 * @module Geometry
 */

import { vec3, mat4 } from 'gl-matrix';

class Light {
    /**
     * Light position
     */
    position: vec3 = vec3.create();

    /**
     * Light direction
     */
    direction: vec3 = vec3.create();

    /**
     * Light type
     */
    type: string = 'point';



    /**
     * Light color
     */

    color: vec3 = vec3.create();

    /**
     * Light intensity
     */

    intensity: number = 0;

    static create(): Light {
        let position = vec3.create();
        let color = vec3.create();
        let intensity = 0;
        return new Light();
    }


}

export default Light;

