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
     * 
     * Number of ray generations to compute 
     */
    rayDepth: number = 1;

    /**
     * 
     * Epsilon value for ray intersection to avoid self intersection
     */
    epsilon: number = 0.0001;

    computeShading(intersection: Intersection): vec3 {
        let color = vec3.create()
        for (let light of this.lights) {
            let lightColor = vec3.create();
            vec3.copy(lightColor, light.color);
            vec3.scale(lightColor, lightColor, light.intensity);

            // ambient color
            let ambientColor = vec3.create();
            vec3.copy(ambientColor, intersection.hitShape!.color);
            vec3.scale(ambientColor, ambientColor, intersection.hitShape!.ambient);


            let lightDirection = vec3.create();
            vec3.copy(lightDirection, light.position);
            vec3.subtract(lightDirection, lightDirection, intersection.position,);
            vec3.normalize(lightDirection, lightDirection);

            let normal = vec3.create();
            vec3.copy(normal, intersection.normal);
            vec3.normalize(normal, normal);

            let diffuseIntensity = Math.max(vec3.dot(lightDirection, normal), 0);

            let diffuseColor = vec3.create();
            vec3.multiply(diffuseColor, lightColor, intersection.hitShape!.color);
            vec3.scale(diffuseColor, diffuseColor, diffuseIntensity);
            vec3.scale(diffuseColor, diffuseColor, intersection.hitShape!.diffuse);

            // calculate the reflected ray 

            // reflect the ray around the normal
            const reflectedRay = intersection.reflectedRay;

            vec3.normalize(reflectedRay.direction, reflectedRay.direction);

            // now use the reflected ray direction to calculate the specular intensity


            // if the generation the ray that hit us is one less that the depth then we do not do a reflection or refraction call
            if (intersection.generation < this.rayDepth - 1) {
                let reflectedColor = this.intersect(reflectedRay, intersection.hitShape!);
                vec3.scale(reflectedColor, reflectedColor, intersection.hitShape!.specular);
            }

            let specularIntensity = Math.pow(Math.max(vec3.dot(reflectedRay.direction, lightDirection), 0), intersection.hitShape!.shininess);

            let specularColor = vec3.create();
            vec3.multiply(specularColor, lightColor, intersection.hitShape!.color);
            vec3.scale(specularColor, specularColor, specularIntensity);
            vec3.scale(specularColor, specularColor, intersection.hitShape!.specular);

            vec3.add(color, color, diffuseColor);
            vec3.add(color, color, specularColor);
            vec3.add(color, color, ambientColor);
        }

        return color;
    }


    /**
     * intersect
     */
    intersect(ray: Ray, originShape: Shape | null = null): vec3 {
        let distance = Infinity;
        let currentIntersection: Intersection | null = null;

        for (let shape of this.shapes) {
            if (shape === originShape) {
                continue;
            }
            let nextIntersection = shape.intersect(ray,);
            if (nextIntersection.hitDistance !== Number.MAX_VALUE && nextIntersection.hitDistance < distance) {

                distance = nextIntersection.hitDistance;
                currentIntersection = nextIntersection;

                shape.intersect(ray);

            }
        }
        if (!currentIntersection) {
            return this.backgroundColor;
        }
        let color = this.computeShading(currentIntersection);

        return color;


    }
}

export default Scene;