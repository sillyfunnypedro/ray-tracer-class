/**
 * 
 */

import { vec3, mat4 } from 'gl-matrix';

import Shape from './Shape';
import Ray from './Ray';
import Intersection from './Intersection';



class Cube extends Shape {
    // 2 by 2 by 2 cube
    vertices: vec3[] = [
        vec3.fromValues(-1, -1, -1),
        vec3.fromValues(1, -1, -1),
        vec3.fromValues(1, 1, -1),
        vec3.fromValues(-1, 1, -1),
        vec3.fromValues(-1, -1, 1),
        vec3.fromValues(1, -1, 1),
        vec3.fromValues(1, 1, 1),
        vec3.fromValues(-1, 1, 1)
    ];
    constructor() {
        super();
        this.computeBoundingBox();
    }

    computeBoundingBox(): void {
        this.boundingBoxExists = true;
        // transform each of the vertices and build a min max box
        let min = vec3.fromValues(1000000, 1000000, 1000000);
        let max = vec3.fromValues(-1000000, -1000000, -1000000);

        for (let i = 0; i < this.vertices.length; i++) {
            let vertex = this.transformPointToWorldSpace(this.vertices[i]);
            min[0] = Math.min(min[0], vertex[0]);
            min[1] = Math.min(min[1], vertex[1]);
            min[2] = Math.min(min[2], vertex[2]);

            max[0] = Math.max(max[0], vertex[0]);
            max[1] = Math.max(max[1], vertex[1]);
            max[2] = Math.max(max[2], vertex[2]);
        }

        this.boundingBoxOrigin = min;
        this.boundingBoxSize = vec3.fromValues(max[0] - min[0], max[1] - min[1], max[2] - min[2]);

    }

    intersect(ray: Ray, useBoundingBox: boolean): Intersection {
        if (useBoundingBox && this.intersectBoundingBox(ray) === false) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection;
        }

        // first get the ray in object space
        let rayOriginObjectSpace = this.getRayInObjectSpace(ray);

        // we have the ray in object space so we can do the slab method against -1,1 for all axis
        // we are going to do this using the slab methhod
        // we are going to do this for each axis
        // x axis
        let tmin = (-1 - rayOriginObjectSpace.origin[0]) / rayOriginObjectSpace.direction[0];
        let tmax = (1 - rayOriginObjectSpace.origin[0]) / rayOriginObjectSpace.direction[0];

        if (tmin > tmax) {
            [tmin, tmax] = [tmax, tmin];
        }

        // now do the same for y then see if it is an obvious miss
        let tymin = (-1 - rayOriginObjectSpace.origin[1]) / rayOriginObjectSpace.direction[1];
        let tymax = (1 - rayOriginObjectSpace.origin[1]) / rayOriginObjectSpace.direction[1];

        if (tymin > tymax) {
            [tymin, tymax] = [tymax, tymin]
        }

        // This means that the ray went
        if ((tmin > tymax) || (tymin > tmax)) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection;
        }

        if (tymin > tmin) {
            tmin = tymin;
        }

        if (tymax < tmax) {
            tmax = tymax;
        }

        let tzmin = (-1 - rayOriginObjectSpace.origin[2]) / rayOriginObjectSpace.direction[2];
        let tzmax = (1 - rayOriginObjectSpace.origin[2]) / rayOriginObjectSpace.direction[2];

        if (tzmin > tzmax) {
            let temp = tzmin;
            tzmin = tzmax;
            tzmax = temp;
        }

        if ((tmin > tzmax) || (tzmin > tmax)) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection;
        }

        if (tzmin > tmin) {
            tmin = tzmin;
        }

        if (tzmax < tmax) {
            tmax = tzmax;
        }



        let intersection = Intersection.create();
        intersection.hitDistance = tmin;
        intersection.hitShape = this;
        intersection.position = vec3.create();


        // check to see what side of the cube we are on.


        // we are on a face
        // we need to figure out which face we are on
        let hitPoint = vec3.create();
        vec3.scaleAndAdd(hitPoint, rayOriginObjectSpace.origin, rayOriginObjectSpace.direction, tmin);
        let minDistance = Number.MAX_VALUE;
        let closestFace = 0;
        // we are going to do this really simply.
        // if position.x is -1 then the normal is -1,0,0
        // if position.x is 1 then the normal is 1,0,0
        // if position.y is -1 then the normal is 0,-1,0
        // if position.y is 1 then the normal is 0,1,0
        // if position.z is -1 then the normal is 0,0,-1
        // if position.z is 1 then the normal is 0,0,1
        // if the position is on two faces the we will pick the last one

        // x faces
        if (Math.abs(hitPoint[0] + 1) < minDistance) {
            minDistance = Math.abs(hitPoint[0] + 1);
            closestFace = 0;
        }
        if (Math.abs(hitPoint[0] - 1) < minDistance) {
            minDistance = Math.abs(hitPoint[0] - 1);
            closestFace = 1;
        }
        // y faces
        if (Math.abs(hitPoint[1] + 1) < minDistance) {
            minDistance = Math.abs(hitPoint[1] + 1);
            closestFace = 2;
        }
        if (Math.abs(hitPoint[1] - 1) < minDistance) {
            minDistance = Math.abs(hitPoint[1] - 1);
            closestFace = 3;
        }
        // z faces
        if (Math.abs(hitPoint[2] + 1) < minDistance) {
            minDistance = Math.abs(hitPoint[2] + 1);
            closestFace = 4;
        }
        if (Math.abs(hitPoint[2] - 1) < minDistance) {
            minDistance = Math.abs(hitPoint[2] - 1);
            closestFace = 5;
        }

        switch (closestFace) {
            case 0:
                intersection.normal = vec3.fromValues(-1, 0, 0);
                intersection.uvw = vec3.fromValues(-1, hitPoint[2], hitPoint[1]);
                break;
            case 1:
                intersection.normal = vec3.fromValues(1, 0, 0);
                intersection.uvw = vec3.fromValues(1, hitPoint[2], hitPoint[1]);
                break;
            case 2:
                intersection.normal = vec3.fromValues(0, -1, 0);
                intersection.uvw = vec3.fromValues(hitPoint[0], -1, hitPoint[2]);
                break;
            case 3:
                intersection.normal = vec3.fromValues(0, 1, 0);
                intersection.uvw = vec3.fromValues(hitPoint[0], 1, hitPoint[2]);
                break;
            case 4:
                intersection.normal = vec3.fromValues(0, 0, -1);
                intersection.uvw = vec3.fromValues(hitPoint[0], hitPoint[1], -1);
                break;
            case 5:
                intersection.normal = vec3.fromValues(0, 0, 1);
                intersection.uvw = vec3.fromValues(hitPoint[0], hitPoint[1], 1);
                break;


                intersection.normal = this.transformNormalToWorldSpace(intersection.normal);
                let worldSpacePoint = this.transformPointToWorldSpace(hitPoint);

                let reflectedRay = this.getReflectedRay(ray, intersection.normal, worldSpacePoint);
                reflectedRay.generation = ray.generation + 1;




                intersection.hitDistance = tmin;
                intersection.hitShape = this;
                intersection.reflectedRay = reflectedRay;
                intersection.position = this.transformPointToWorldSpace(hitPoint);
            //intersection.uv = this.getUV(intersection.normal, intersection.position);

        }
        return intersection;
    }



}
export default Cube;
