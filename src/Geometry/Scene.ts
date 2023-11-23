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

    computeShading(intersection: Intersection): Color {
        let color = vec3.create()
        for (let light of this.lights) {
            let lightColor = vec3.create();
            vec3.copy(lightColor, light.color);
            vec3.scale(lightColor, lightColor, light.intensity);

            let lightDirection = vec3.create();
            vec3.copy(lightDirection, light.position);
            vec3.subtract(lightDirection, intersection.position, lightDirection);
            vec3.normalize(lightDirection, lightDirection);

            let normal = vec3.create();
            vec3.copy(normal, intersection.normal);
            vec3.normalize(normal, normal);

            let diffuseIntensity = Math.max(vec3.dot(lightDirection, normal), 0);

            let diffuseColor = vec3.create();
            vec3.multiply(diffuseColor, lightColor, intersection.hitShape!.color);
            vec3.scale(diffuseColor, diffuseColor, diffuseIntensity);

            let reflectedRay = Ray.create();
            vec3.copy(reflectedRay.origin, intersection.position);
            vec3.copy(reflectedRay.direction, intersection.reflectedRay.direction);

            let specularIntensity = Math.pow(Math.max(vec3.dot(reflectedRay.direction, lightDirection), 0), intersection.hitShape!.shininess);

            let specularColor = vec3.create();
            vec3.multiply(specularColor, lightColor, intersection.hitShape!.color);
            vec3.scale(specularColor, specularColor, specularIntensity);

            vec3.add(color, color, diffuseColor);
            vec3.add(color, color, specularColor);
        }

        return Color.createFromVec3(color);
    }


    /**
     * intersect
     */
    intersect(ray: Ray): Color {
        let distance = Infinity;
        let currentIntersection: Intersection | null = null;

        for (let shape of this.shapes) {
            let nextIntersection = shape.intersect(ray);
            if (nextIntersection.hitDistance !== Number.MAX_VALUE && nextIntersection.hitDistance < distance) {
                distance = nextIntersection.hitDistance;
                currentIntersection = nextIntersection;
            }
        }
        if (!currentIntersection) {
            return new Color(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2]);
        }
        let color = this.computeShading(currentIntersection);

        return color;


    }
}

export default Scene;