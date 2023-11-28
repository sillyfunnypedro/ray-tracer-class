/**
 *  @file       Shape.ts
 * @module     Shape
 * @desc       Shape class extends Object3D class and is extended by all shapes. 
 * */
import { vec3, mat4, mat3 } from 'gl-matrix';
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
    boundingBoxOrigin: vec3 = vec3.create();
    boundingBoxSize: vec3 = vec3.create();
    boundingBoxExists: boolean = false;

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
        this.computeBoundingBox();
    }

    /**
     * @function rotateX
     * @desc rotates the shape around the x axis by the given angle (in degrees)
     */
    rotateX(angle: number) {
        mat4.rotateX(this.rotationMatrix, this.rotationMatrix, angle * Math.PI / 180);
        this.computeBoundingBox();
    }

    /**
     * @function rotateY
     * @desc rotates the shape around the y axis by the given angle (in degrees)
     */
    rotateY(angle: number) {
        mat4.rotateY(this.rotationMatrix, this.rotationMatrix, angle * Math.PI / 180);
        this.computeBoundingBox();
    }

    /**
     * @function rotateZ
     * @desc rotates the shape around the z axis by the given angle (in degrees)
     */
    rotateZ(angle: number) {
        mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, angle * Math.PI / 180);
        this.computeBoundingBox();
    }

    /**
     * @function scale
     * @desc scales the shape by the given vector
     */
    scale(scale: vec3) {
        mat4.scale(this.scaleMatrix, this.scaleMatrix, scale);
        this.computeBoundingBox();
    }

    /** 
     * @function get ModelMatrix
     */
    getModelMatrix(): mat4 {
        // rotate, translate, scale
        mat4.multiply(this.modelMatrix, this.translationMatrix, this.rotationMatrix);
        mat4.multiply(this.modelMatrix, this.modelMatrix, this.scaleMatrix);
        return this.modelMatrix;
    }

    // for now lets assume scale is uniform
    getRayInObjectSpace(ray: Ray): Ray {
        let inverseModelMatrix = mat4.create();
        mat4.invert(inverseModelMatrix, this.getModelMatrix());


        let origin = vec3.create();
        vec3.transformMat4(origin, ray.origin, inverseModelMatrix);

        let normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, inverseModelMatrix);

        let inverseNormalMatrix = mat3.create();
        mat3.invert(inverseNormalMatrix, normalMatrix);

        let transposedInverseNormalMatrix = mat3.create();
        mat3.transpose(transposedInverseNormalMatrix, inverseNormalMatrix);

        let direction = vec3.create();
        vec3.transformMat3(direction, ray.direction, transposedInverseNormalMatrix);
        vec3.normalize(direction, direction);

        const resultinRay = new Ray(origin, direction);
        return resultinRay;
    }

    transformPointToWorldSpace(point: vec3): vec3 {
        let pointWorldSpace = vec3.create();
        vec3.transformMat4(pointWorldSpace, point, this.getModelMatrix());
        return pointWorldSpace;
    }

    // this transformation needs to first extract the rotation and scale from the model matrix
    // then it needs to apply the inverse of those transformations to the normal
    transformNormalToWorldSpace(normal: vec3): vec3 {
        let modelMatrix = this.getModelMatrix();
        let normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);

        let inverseNormalMatrix = mat3.create();
        mat3.invert(inverseNormalMatrix, normalMatrix);

        let transposedInverseNormalMatrix = mat3.create();
        mat3.transpose(transposedInverseNormalMatrix, inverseNormalMatrix);

        let normalWorldSpace = vec3.create();

        vec3.transformMat3(normalWorldSpace, normal, transposedInverseNormalMatrix);
        vec3.normalize(normalWorldSpace, normalWorldSpace);
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

    intersectBoundingBox(ray: Ray): boolean {

        if (!this.boundingBoxExists) {
            return true;
        }
        // Intersect with the x planes of the bounding box
        let tmin = (this.boundingBoxOrigin[0] - ray.origin[0]) / ray.direction[0];
        let tmax = (this.boundingBoxOrigin[0] + this.boundingBoxSize[0] - ray.origin[0]) / ray.direction[0];

        if (tmin > tmax) {
            [tmin, tmax] = [tmax, tmin];
        }

        // now do the same for y then see if it is an obvious miss
        let tymin = (this.boundingBoxOrigin[1] - ray.origin[1]) / ray.direction[1];
        let tymax = (this.boundingBoxOrigin[1] + this.boundingBoxSize[1] - ray.origin[1]) / ray.direction[1];

        if (tymin > tymax) {
            [tymin, tymax] = [tymax, tymin]
        }

        // This means that the ray went 
        if ((tmin > tymax) || (tymin > tmax)) {
            return false;
        }

        if (tymin > tmin) {
            tmin = tymin;
        }

        if (tymax < tmax) {
            tmax = tymax;
        }

        let tzmin = (this.boundingBoxOrigin[2] - ray.origin[2]) / ray.direction[2];
        let tzmax = (this.boundingBoxOrigin[2] + this.boundingBoxSize[2] - ray.origin[2]) / ray.direction[2];

        if (tzmin > tzmax) {
            let temp = tzmin;
            tzmin = tzmax;
            tzmax = temp;
        }

        if ((tmin > tzmax) || (tzmin > tmax)) {
            return false;
        }

        if (tzmin > tmin) {
            tmin = tzmin;
        }

        if (tzmax < tmax) {
            tmax = tzmax;
        }

        return true;
    }

    abstract computeBoundingBox(): void;



    abstract intersect(ray: Ray, useBoundingBox: boolean): Intersection;

}

export default Shape;