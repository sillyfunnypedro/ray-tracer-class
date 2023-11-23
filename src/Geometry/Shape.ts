/**
 *  @file       Shape.ts
 * @module     Shape
 * @desc       Shape class extends Object3D class and is extended by all shapes. 
 * */
import { vec3, mat4 } from 'gl-matrix';
import Ray from './Ray';
import Light from './Light';
import Intersection from './Intersection';

abstract class Shape {

    color: vec3;
    ambient: number;
    diffuse: number;
    specular: number;
    shininess: number;
    reflectivity: number;
    refractivity: number;
    refractiveIndex: number;
    modelMatrix: mat4;
    rotationMatrix: mat4;
    translationMatrix: mat4;
    scaleMatrix: mat4;

    constructor() {
        this.color = vec3.create();
        this.ambient = 0;
        this.diffuse = 0;
        this.specular = 0;
        this.shininess = 0;
        this.reflectivity = 0;
        this.refractivity = 0;
        this.refractiveIndex = 0;
        this.modelMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        this.translationMatrix = mat4.create();
        this.scaleMatrix = mat4.create();
    }


    /**
     * @function translate
     * @desc translates the shape by the given vector
     */
    translate(translation: vec3) {
        mat4.translate(this.translationMatrix, this.translationMatrix, translation);
    }

    /**
     * @function rotateX
     * @desc rotates the shape around the x axis by the given angle (in degrees)
     */
    rotateX(angle: number) {
        mat4.rotateX(this.rotationMatrix, this.rotationMatrix, angle * Math.PI / 180);
    }

    /**
     * @function rotateY
     * @desc rotates the shape around the y axis by the given angle (in degrees)
     */
    rotateY(angle: number) {
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, angle * Math.PI / 180);
    }

    /**
     * @function rotateZ
     * @desc rotates the shape around the z axis by the given angle (in degrees)
     */
    rotateZ(angle: number) {
        mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, angle * Math.PI / 180);
    }

    /**
     * @function scale
     * @desc scales the shape by the given vector
     */
    scale(scale: vec3) {
        mat4.scale(this.scaleMatrix, this.scaleMatrix, scale);
    }

    /** 
     * @function get ModelMatrix
     */
    getModelMatrix(): mat4 {
        mat4.multiply(this.modelMatrix, this.translationMatrix, this.rotationMatrix);
        mat4.multiply(this.modelMatrix, this.modelMatrix, this.scaleMatrix);
        return this.modelMatrix;
    }

    // for now lets assume scale is uniform
    getRayInObjectSpace(ray: Ray): Ray {
        let inverseModelMatrix = mat4.create();
        mat4.invert(inverseModelMatrix, this.getModelMatrix());
        let origin = vec3.create();
        let direction = vec3.create();
        vec3.transformMat4(origin, ray.origin, inverseModelMatrix);
        vec3.transformMat4(direction, ray.direction, inverseModelMatrix);

        const resultinRay = new Ray(origin, direction);
        return resultinRay;
    }

    transformPointToWorldSpace(point: vec3): vec3 {
        let inverseModelMatrix = mat4.create();
        mat4.invert(inverseModelMatrix, this.getModelMatrix());
        let pointWorldSpace = vec3.create();
        vec3.transformMat4(pointWorldSpace, point, inverseModelMatrix);
        return pointWorldSpace;
    }

    transformNormalToWorldSpace(normal: vec3): vec3 {
        let inverseModelMatrix = mat4.create();
        mat4.invert(inverseModelMatrix, this.getModelMatrix());
        let normalWorldSpace = vec3.create();
        vec3.transformMat4(normalWorldSpace, normal, inverseModelMatrix);
        return normalWorldSpace;
    }

    getReflectedRay(ray: Ray, normal: vec3, intersectionPoint: vec3): Ray {
        let reflectedRay = Ray.create();
        let reflectionDirection = vec3.create();
        vec3.scaleAndAdd(reflectionDirection, ray.direction, normal, -2 * vec3.dot(ray.direction, normal));
        reflectedRay.origin = intersectionPoint;
        reflectedRay.direction = reflectionDirection;
        return reflectedRay;
    }

    calculateShading(ray: Ray, intersection: Intersection, light: Light): vec3 {
        let shadingColor = vec3.create();
        let lightDirection = vec3.create();
        vec3.normalize(lightDirection, vec3.subtract(lightDirection, light.position, intersection.position));
        let normal = intersection.normal;
        let diffuseTerm = Math.max(0, vec3.dot(lightDirection, normal));
        let reflectedRay = this.getReflectedRay(ray, normal, intersection.position);
        let specularTerm = Math.pow(Math.max(0, vec3.dot(reflectedRay.direction, lightDirection)), this.shininess);
        vec3.scale(shadingColor, this.color, this.ambient + this.diffuse * diffuseTerm + this.specular * specularTerm);
        return shadingColor;
    }

    abstract intersect(ray: Ray): Intersection;

}

export default Shape;