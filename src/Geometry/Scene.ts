/**
 * Scene
 * 
 * The Scene class is responsible for holding all of the objects in the scene.
 */

// Path: src/Geometry/Scene.ts

import { vec3 } from 'gl-matrix';

import Shape from './Shape';
import Light from './Light';
import Ray from './Ray';
import Intersection from './Intersection';
import Color from './../Color';



/**
 * Scene class
 */

class Scene {
    /**
     * Scene shapes
     */
    shapes: Shape[] = [];

    /**
     * Scene lights
     */

    lights: Light[] = [];

    /**
     * Scene background color
     */
    backgroundColor: vec3 = vec3.create();


    /**
     * intersect
     */
    intersect(ray: Ray): Color {
        let distance = Infinity;
        let currentINtersection: Intersection | null = null;

        for (let shape of this.shapes) {
            let nextIntersection = shape.intersect(ray);
            if (nextIntersection.hitDistance !== Number.MAX_VALUE && nextIntersection.hitDistance < distance) {
                distance = nextIntersection.hitDistance;
                currentINtersection = nextIntersection;
            }
        }
        let color = new Color(0, 0, 0);
        if (currentINtersection !== null) {
            color = new Color(255, 0, 255);
        } else {
            color = new Color(0, 255, 0);
        }

        return color;


    }
}

export default Scene;