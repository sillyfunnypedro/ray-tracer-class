/**
 * @module Sphere
 */

import { vec3, mat4 } from 'gl-matrix';

import Shape from './Shape';
import Ray from './Ray';
import Intersection from './Intersection';

/**
 * Sphere shape
 */

export class Sphere extends Shape {
    /**
     * Sphere radius
     */
    radius: number;

    /**
     * Sphere center
     */
    center: vec3;

    /**
     * Sphere constructor
     * @param {number} radius - Sphere radius
     * @param {vec3} center - Sphere center
     */
    constructor(radius: number, center: vec3) {
        super();
        this.radius = radius;
        this.center = center;
    }

    /**
     * @function intersect
     * @desc returns intersection point of ray and sphere
     * returns null if no intersection
     */
    intersect(ray: Ray): Intersection {
        // first get the ray in object space
        let rayOriginObjectSpace = this.getRayInObjectSpace(ray);

        // Compute the intersection of the ray with the sphere
        let a = vec3.dot(rayOriginObjectSpace.direction, rayOriginObjectSpace.direction);
        let b = 2 * vec3.dot(rayOriginObjectSpace.direction, rayOriginObjectSpace.origin);
        let c = vec3.dot(rayOriginObjectSpace.origin, rayOriginObjectSpace.origin) - this.radius * this.radius;
        let discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection
        }

        let t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        let t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        // return the smaller of the two values
        let resultingT = Math.min(t1, t2);
        // calculate the intersection point
        // the t value should correspond th the direction of the ray even if it was scaled
        let intersectionPoint = vec3.create();
        vec3.scaleAndAdd(intersectionPoint, rayOriginObjectSpace.origin, rayOriginObjectSpace.direction, resultingT);

        let normal = vec3.copy(vec3.create(), intersectionPoint);
        normal = this.transformNormalToWorldSpace(normal);

        let worldSpacePoint = this.transformPointToWorldSpace(intersectionPoint);



        // now that we have the world point and the normal we call the shape function getReflectedRay

        let reflectedRay = this.getReflectedRay(ray, normal, worldSpacePoint);
        reflectedRay.generation = ray.generation + 1;



        let intersection = Intersection.create();
        intersection.position = worldSpacePoint;
        intersection.normal = normal;
        intersection.hitDistance = resultingT;
        intersection.hitShape = this;
        intersection.reflectedRay = reflectedRay;
        intersection.generation = ray.generation + 1;


        return intersection;
    }
}

export default Sphere;