/**
 * 
 */

import { vec3, mat4 } from 'gl-matrix';

import Shape from './Shape';
import Ray from './Ray';
import Intersection from './Intersection';



class Triangle extends Shape {
    /**
     * Triangle vertices
     */
    vertices: vec3[] = [];

    /**
     * Triangle normals
     */
    normals: vec3[] = [];

    /**
     * Triangle uvs
     */
    uvs: vec3[] = [];

    /**
     * Triangle plane
     */
    planeNormal: vec3 = vec3.create();
    planeOffset: number = 0;


    /**
     * Triangle constructor
     * @param {vec3} v0 - Vertex 0
     * @param {vec3} v1 - Vertex 1
     * @param {vec3} v2 - Vertex 2
     * @param {vec3} n0 - Normal 0
     * @param {vec3} n1 - Normal 1
     * @param {vec3} n2 - Normal 2
     * @param {vec3} uv0 - UV 0
     * @param {vec3} uv1 - UV 1
     * @param {vec3} uv2 - UV 2
     */
    constructor(v0: vec3, v1: vec3, v2: vec3) {
        super();
        this.vertices.push(v0);
        this.vertices.push(v1);
        this.vertices.push(v2);

        this.computePlane();
        this.computeBoundingBox();
    }

    setNormals(n0: vec3, n1: vec3, n2: vec3) {
        this.normals.push(n0);
        this.normals.push(n1);
        this.normals.push(n2);
    }

    setUVs(uv0: vec3, uv1: vec3, uv2: vec3) {
        this.uvs.push(uv0);
        this.uvs.push(uv1);
        this.uvs.push(uv2);
    }



    /**
     * @function computeBoundingBox
     * @desc Computes the bounding box of the triangle
     */
    computeBoundingBox() {
        let min = vec3.fromValues(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        let max = vec3.fromValues(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE);
        for (let i = 0; i < 3; i++) {
            let v = this.vertices[i];
            if (v[0] < min[0]) min[0] = v[0];
            if (v[1] < min[1]) min[1] = v[1];
            if (v[2] < min[2]) min[2] = v[2];
            if (v[0] > max[0]) max[0] = v[0];
            if (v[1] > max[1]) max[1] = v[1];
            if (v[2] > max[2]) max[2] = v[2];
        }
        // add substract epsilon to min and add epsilon to max
        min[0] -= 0.0001;
        min[1] -= 0.0001;
        min[2] -= 0.0001;

        max[0] += 0.0001;
        max[1] += 0.0001;
        max[2] += 0.0001;


        this.boundingBoxOrigin = min;
        this.boundingBoxSize = vec3.subtract(vec3.create(), max, min);
        this.boundingBoxExists = true;
    }

    /**
     * @function computePlane
     * @desc Computes the plane of the triangle
     */
    computePlane() {
        let v0 = this.vertices[0];
        let v1 = this.vertices[1];
        let v2 = this.vertices[2];
        let e1 = vec3.subtract(vec3.create(), v1, v0);
        let e2 = vec3.subtract(vec3.create(), v2, v0);
        this.planeNormal = vec3.cross(vec3.create(), e1, e2);
        vec3.normalize(this.planeNormal, this.planeNormal);
        this.planeOffset = vec3.dot(this.planeNormal, v0);
    }

    /**
     * @function intersect
     * @desc returns intersection point of ray and triangle
     */

    intersect(ray: Ray, useBoundingBox: boolean): Intersection {

        if (useBoundingBox && this.intersectBoundingBox(ray) === false) {
            let noIntersection = Intersection.create();
            noIntersection.hitDistance = Number.MAX_VALUE;
            return noIntersection;
        }

        let intersection = Intersection.create();
        intersection.hitShape = this;
        intersection.hitDistance = Number.MAX_VALUE;
        intersection.position = vec3.create();
        intersection.normal = vec3.create();
        intersection.uv = vec3.create();

        let t = (this.planeOffset - vec3.dot(ray.origin, this.planeNormal)) / vec3.dot(ray.direction, this.planeNormal);
        if (t < 0) {
            return intersection;
        }

        let intersectionPoint = vec3.scaleAndAdd(vec3.create(), ray.origin, ray.direction, t);

        let edge0 = vec3.subtract(vec3.create(), this.vertices[1], this.vertices[0]);   // edge 0
        let vp0 = vec3.subtract(vec3.create(), intersectionPoint, this.vertices[0]);
        let c = vec3.cross(vec3.create(), edge0, vp0);
        if (vec3.dot(this.planeNormal, c) < 0) {
            return intersection;
        }

        let edge1 = vec3.subtract(vec3.create(), this.vertices[2], this.vertices[1]);   // edge 1
        let vp1 = vec3.subtract(vec3.create(), intersectionPoint, this.vertices[1]);
        c = vec3.cross(vec3.create(), edge1, vp1);
        if (vec3.dot(this.planeNormal, c) < 0) {
            return intersection;
        }

        let edge2 = vec3.subtract(vec3.create(), this.vertices[0], this.vertices[2]);   // edge 2
        let vp2 = vec3.subtract(vec3.create(), intersectionPoint, this.vertices[2]);
        c = vec3.cross(vec3.create(), edge2, vp2);
        if (vec3.dot(this.planeNormal, c) < 0) {
            return intersection;
        }

        let reflectedRay = this.getReflectedRay(ray, this.planeNormal, intersectionPoint);
        reflectedRay.generation = ray.generation + 1;

        let worldSpacePoint = this.transformPointToWorldSpace(intersectionPoint);

        let normal = this.transformNormalToWorldSpace(this.planeNormal);

        intersection.hitDistance = t;
        intersection.position = worldSpacePoint;
        intersection.normal = normal; // TODO: interpolate normal
        intersection.uv = vec3.fromValues(0, 0, 0); // TODO: interpolate uv
        intersection.hitShape = this;
        intersection.reflectedRay = reflectedRay;
        intersection.generation = ray.generation + 1;

        return intersection;
    }
}

export default Triangle;

