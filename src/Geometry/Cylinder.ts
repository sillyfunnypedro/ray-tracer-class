/**
 * 
 */

import { vec3, mat4 } from 'gl-matrix';

import Shape from './Shape';
import Ray from './Ray';
import Intersection from './Intersection';


class Cylinder extends Shape {
    height = 2;
    radius = 1;
    constructor() {
        super();
        this.computeBoundingBox();
    }

    computeBoundingBox(): void {
        this.boundingBoxExists = true;
        // first compute a bounding box in object space
        let min = vec3.fromValues(-this.radius, -this.height / 2, -this.radius);
        let max = vec3.fromValues(this.radius, this.height / 2, this.radius);


        // now transform the min and max by the model matrix
        let minWorld = this.transformPointToWorldSpace(min);
        let maxWorld = this.transformPointToWorldSpace(max);
        this.boundingBoxOrigin = minWorld;
        this.boundingBoxSize = vec3.fromValues(maxWorld[0] - minWorld[0], maxWorld[1] - minWorld[1], maxWorld[2] - minWorld[2]);
    }

    intersect(ray: Ray, useBoundingBox: boolean): Intersection {
        if (useBoundingBox && this.intersectBoundingBox(ray) === false) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection;
        }

        // first get the ray in object space
        let rayInObjectSpace = this.getRayInObjectSpace(ray);

        // intersect against the top and bottom of the cylinder plane


        // now compute the intersection with the object space cylinder
        let a = rayInObjectSpace.direction[0] * rayInObjectSpace.direction[0] +
            rayInObjectSpace.direction[2] * rayInObjectSpace.direction[2];
        let b = 2 * rayInObjectSpace.origin[0] * rayInObjectSpace.direction[0] +
            2 * rayInObjectSpace.origin[2] * rayInObjectSpace.direction[2];
        let c = rayInObjectSpace.origin[0] * rayInObjectSpace.origin[0] +
            rayInObjectSpace.origin[2] * rayInObjectSpace.origin[2] - this.radius * this.radius;

        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection;
        }

        let t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        let t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        // now we need to check if the intersection is within the height of the cylinder
        let y1 = rayInObjectSpace.origin[1] + t1 * rayInObjectSpace.direction[1];
        let y2 = rayInObjectSpace.origin[1] + t2 * rayInObjectSpace.direction[1];

        let t = 0;

        // if both y1 and y2 are Above or below the height of the cylinder, then there is no intersection
        if ((y1 < -this.height / 2 && y2 < -this.height / 2) || (y1 > this.height / 2 && y2 > this.height / 2)) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection;
        }

        if (t1 > t2) {
            [t1, t2] = [t2, t1];
        }

        // find the intersections with the two planes
        let t3 = (-this.height / 2 - rayInObjectSpace.origin[1]) / rayInObjectSpace.direction[1];
        let t4 = (this.height / 2 - rayInObjectSpace.origin[1]) / rayInObjectSpace.direction[1];

        if (t3 > t4) {
            [t3, t4] = [t4, t3];
        }
        t = t1;

        // if t1 is less than t3 then we are intersecting with the bottom of the cylinder
        if (t1 < t3) {
            t = t3;
        } else {
            t = t1;
        }

        // if t2 is greater than t4 then we are intersecting with the top of the cylinder
        if (t2 > t4) {
            t2 = t4;
        }

        // if t is greater than t2 then there is no intersection
        if (t > t2) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection;
        }


        // now get the intersection point with the cylinder
        let intersectionPoint = vec3.add(vec3.create(), rayInObjectSpace.origin, vec3.scale(vec3.create(), rayInObjectSpace.direction, t));

        let xzLength = intersectionPoint[0] * intersectionPoint[0] + intersectionPoint[2] * intersectionPoint[2];

        if (Math.abs(intersectionPoint[1] - 1) < 0.0000001) {
            // we are intersecting with the top or bottom of the cylinder
            let intersection = Intersection.create();
            intersection.hitShape = this;
            intersection.hitDistance = t;
            intersection.position = this.transformPointToWorldSpace(intersectionPoint);
            intersection.normal = this.transformNormalToWorldSpace(vec3.fromValues(0, intersectionPoint[1], 0));
            intersection.reflectedRay = this.getReflectedRay(ray, intersection.normal, intersection.position);
            intersection.uv = vec3.fromValues(0, 0, 0);
            return intersection;
        }

        // now we have the intersection of the cylinder in object space

        // sanity check.  
        if (Math.abs(intersectionPoint[1]) > this.height / 2) {
            throw new Error("intersection point is not within the height of the cylinder");
        }

        // are we intersecting with the top or bottom of the cylinder?< 0.0001
        if (intersectionPoint[1] > -this.height / 2 && intersectionPoint[1] < this.height / 2) {
            // we are intersecting with the side of the cylinder
            let intersection = Intersection.create();
            intersection.hitShape = this;
            intersection.hitDistance = t;
            intersection.position = this.transformPointToWorldSpace(intersectionPoint);
            intersection.normal = this.transformNormalToWorldSpace(vec3.fromValues(intersectionPoint[0], 0, intersectionPoint[2]));
            intersection.reflectedRay = this.getReflectedRay(ray, intersection.normal, intersection.position);
            intersection.uv = vec3.fromValues(0, 0, 0);
            return intersection;
        }


        // we are intersecting with the top of the cylinder
        let intersection = Intersection.create();
        intersection.hitShape = this;
        intersection.hitDistance = t;
        intersection.position = this.transformPointToWorldSpace(intersectionPoint);
        intersection.normal = this.transformNormalToWorldSpace(vec3.fromValues(0, intersectionPoint[1], 0));
        intersection.reflectedRay = this.getReflectedRay(ray, intersection.normal, intersection.position);
        intersection.uv = vec3.fromValues(0, 0, 0);
        return intersection;
    }




}

export default Cylinder;
