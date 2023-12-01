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
import Camera from '../Camera';
import Color from './../Color';
import ThreeDTexture from './TextureManager';
import ShadeParameters from './ShadeParameters';


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

    /**
     * 
     * scene camera
     */
    camera: Camera = new Camera();

    /**
     * 
     * useBoundingBox 
     */
    useBoundingBox: boolean = true;

    /**
     * 
     * 
     */
    computeShadows: boolean = true;




    // This should probably be in its own file but for now we leave it here. REFACTOR
    computeShading(intersection: Intersection): vec3 {
        let color = vec3.create()

        if (intersection.hitShape === null) {
            let backgroundColor = vec3.copy(vec3.create(), this.backgroundColor);
            return backgroundColor;
        }
        let surfaceColor = vec3.create();
        let shadeParameters = new ShadeParameters();
        shadeParameters.color = intersection.hitShape!.color;
        shadeParameters.resultingColor = vec3.create();
        shadeParameters.resultingColor = vec3.copy(vec3.create(), shadeParameters.color);

        shadeParameters.position = intersection.position;
        shadeParameters.normal = intersection.normal;
        shadeParameters.ambient = intersection.hitShape!.ambient;
        shadeParameters.diffuse = intersection.hitShape!.diffuse;
        shadeParameters.specular = intersection.hitShape!.specular;
        shadeParameters.shininess = intersection.hitShape!.shininess;
        shadeParameters.reflectivity = intersection.hitShape!.reflectivity;
        shadeParameters.refractivity = intersection.hitShape!.refractivity;
        shadeParameters.refractiveIndex = intersection.hitShape!.refractiveIndex;
        shadeParameters.uv = intersection.uv;
        shadeParameters.uvw = intersection.uvw;

        surfaceColor = vec3.copy(vec3.create(), shadeParameters.color);
        // check for 3d texture
        if (intersection.hitShape!.threeDTexture !== "") {


            surfaceColor = vec3.create();
            let objectSpacePoint = vec3.copy(vec3.create(), intersection.position);


            let resultingShadeParameters = ThreeDTexture.getInstance().evaluateTexture(intersection.hitShape!.threeDTexture, shadeParameters);

            surfaceColor = resultingShadeParameters.resultingColor;
        }

        for (let light of this.lights) {

            let lightColor = vec3.create();
            vec3.copy(lightColor, light.color);
            vec3.scale(lightColor, lightColor, light.intensity);

            let lightDirection = vec3.create();
            vec3.copy(lightDirection, light.position);
            vec3.subtract(lightDirection, lightDirection, intersection.position);
            vec3.normalize(lightDirection, lightDirection);

            // are we in shadow
            if (this.computeShadows) {
                let shadowRay = Ray.create();
                let distanceToLight = vec3.distance(light.position, intersection.position);

                shadowRay.origin = intersection.position;
                shadowRay.direction = lightDirection;
                shadowRay.generation = intersection.generation + 1;
                let shadowIntersection = this.intersect(shadowRay, intersection.hitShape!, this.useBoundingBox);
                if (shadowIntersection.hitDistance < distanceToLight) {
                    continue;
                }
            }

            let normal = vec3.create();
            vec3.copy(normal, shadeParameters.normal);
            vec3.normalize(normal, normal);

            let diffuseIntensity = Math.max(vec3.dot(lightDirection, normal), 0);

            let diffuseColor = vec3.create();

            vec3.multiply(diffuseColor, lightColor, surfaceColor);


            vec3.scale(diffuseColor, diffuseColor, diffuseIntensity);
            vec3.scale(diffuseColor, diffuseColor, intersection.hitShape!.diffuse);


            // get the reflected ray
            const reflectedRay = intersection.reflectedRay;

            vec3.normalize(reflectedRay.direction, reflectedRay.direction);

            // now use the reflected ray direction to calculate the specular intensity
            let reflectedColor = vec3.create();

            // if the generation the ray that hit us is one less that the depth then we do not do a reflection or refraction call
            if (reflectedRay.generation < this.rayDepth && shadeParameters.reflectivity > 0) {

                reflectedRay.generation = intersection.generation + 1;
                let reflectedObject = this.intersect(reflectedRay, intersection.hitShape!, this.useBoundingBox);
                if (reflectedObject.hitDistance !== Number.MAX_VALUE) {
                    reflectedColor = this.computeShading(reflectedObject);
                }
                vec3.scale(reflectedColor, reflectedColor, shadeParameters.reflectivity);

            }

            let specularIntensity = Math.pow(Math.max(vec3.dot(reflectedRay.direction, lightDirection), 0), intersection.hitShape!.shininess);

            let specularColor = vec3.create();
            vec3.multiply(specularColor, lightColor, intersection.hitShape!.color);
            vec3.scale(specularColor, specularColor, specularIntensity);
            vec3.scale(specularColor, specularColor, intersection.hitShape!.specular);

            vec3.add(color, color, diffuseColor);
            vec3.add(color, color, specularColor);

            vec3.add(color, color, reflectedColor);
        }
        if (this.lights.length > 0) {
            color = vec3.scale(color, color, 1 / this.lights.length);
        }

        // ambient color
        let ambientColor = vec3.create();
        vec3.copy(ambientColor, surfaceColor);
        vec3.scale(ambientColor, ambientColor, intersection.hitShape!.ambient);
        vec3.add(color, color, ambientColor);

        return color;
    }


    /**
     * intersect
     */
    intersect(ray: Ray, originShape: Shape | null = null, useBoundingBox: boolean): Intersection {
        let distance = Infinity;
        let currentIntersection: Intersection = Intersection.create();

        for (let shape of this.shapes) {
            if (shape === originShape) {
                continue;
            }
            let nextIntersection = shape.intersect(ray, useBoundingBox);
            if (nextIntersection.hitDistance !== Number.MAX_VALUE && nextIntersection.hitDistance < distance) {
                if (nextIntersection.hitDistance > 0) {
                    distance = nextIntersection.hitDistance;
                    currentIntersection = nextIntersection;
                }
            }
        }
        return currentIntersection;
    }


}

export default Scene;