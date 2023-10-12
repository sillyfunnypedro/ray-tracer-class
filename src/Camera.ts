/** 
 * @module Camera
 * @description
 * Camera class
 * @class Camera
 * @export Camera
 * 
 * @requires gl-matrix
 */

import { mat4, vec3 } from 'gl-matrix';

class Camera {


    viewMatrix: mat4;
    private _projectionMatrix: mat4;
    eyePosition: vec3;
    lookAt: vec3;
    upVector: vec3;
    aspectRatio: number;
    fieldOfView: number;
    nearPlane: number;
    farPlane: number;
    viewPortWidth: number;
    viewPortHeight: number;
    roll: number;
    usePerspective: boolean = true;
    renderSolid: boolean = true;

    constructor() {
        this.viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();
        this.eyePosition = vec3.fromValues(0, 0, 5)
        this.lookAt = vec3.fromValues(0, 0, 0);
        this.upVector = vec3.fromValues(0, 1, 0);
        this.aspectRatio = 1;
        this.fieldOfView = 90;
        this.nearPlane = 0.1;
        this.farPlane = 100;
        this.viewPortWidth = 1;
        this.viewPortHeight = 1;
        this.roll = 0;
        this.updateCamera();
    }

    public resetCamera(): void {
        this.eyePosition = vec3.fromValues(0, 0, 1)
        this.lookAt = vec3.fromValues(0, 0, 0);
        this.upVector = vec3.fromValues(0, 1, 0);
        this.aspectRatio = 1;
        this.fieldOfView = 45;
        this.nearPlane = 0.1;
        this.farPlane = 100;
        this.viewPortWidth = 1;
        this.viewPortHeight = 1;
        this.roll = 0;
        this.updateCamera();
    }


    public get projectionMatrix(): mat4 {
        this.updateProjectionMatrix();
        return this._projectionMatrix;
    }

    public setEyePosition(eyePosition: vec3): void {
        this.eyePosition = eyePosition;
        this.updateCamera();
    }

    public moveForward(distance: number): void {
        let lookDirection = vec3.create();
        vec3.subtract(lookDirection, this.lookAt, this.eyePosition);
        vec3.normalize(lookDirection, lookDirection);
        vec3.scaleAndAdd(this.eyePosition, this.eyePosition, lookDirection, distance);
        vec3.scaleAndAdd(this.lookAt, this.lookAt, lookDirection, distance);
        this.updateCamera();
    }

    public moveBackward(distance: number): void {
        this.moveForward(-distance);
    }

    public lookUp(angle: number): void {
        angle = angle / 180.0 * Math.PI;
        let lookDirection = vec3.create();
        vec3.subtract(lookDirection, this.lookAt, this.eyePosition);
        let rotationMatrix = mat4.create();
        // calculate the right vector as the cross product of the look direction and the up vector

        let rightVector = vec3.create();
        vec3.cross(rightVector, lookDirection, this.upVector);
        vec3.normalize(rightVector, rightVector);
        // rotate the look direction around the right vector
        mat4.fromRotation(rotationMatrix, angle, rightVector);

        // this preserves the length of lookDirection
        vec3.transformMat4(lookDirection, lookDirection, rotationMatrix);

        // update the lookAt position
        vec3.add(this.lookAt, this.eyePosition, lookDirection);
        // update the up vector

        vec3.transformMat4(this.upVector, this.upVector, rotationMatrix);

        // check that the up vector is still perpendicular to the look direction
        let dotProduct = vec3.dot(this.upVector, lookDirection);
        if (Math.abs(dotProduct) > 0.001) {
            console.log("Warning: up vector is not perpendicular to the look direction");
        }
        this.updateCamera();
    }

    public lookDown(angle: number): void {
        this.lookUp(-angle);
    }


    public lookLeft(angle: number): void {
        console.log("look left" + angle);
        angle = angle / 180.0 * Math.PI;
        let lookDirection = vec3.create();
        vec3.subtract(lookDirection, this.lookAt, this.eyePosition);
        let rotationMatrix = mat4.create();
        mat4.fromRotation(rotationMatrix, angle, this.upVector);
        vec3.transformMat4(lookDirection, lookDirection, rotationMatrix);
        vec3.add(this.lookAt, this.eyePosition, lookDirection);
        this.updateCamera();
    }

    public rollCamera(angle: number): void {
        // calculate the new up vector
        angle = angle / 180.0 * Math.PI;
        let lookDirection = vec3.create();

        vec3.subtract(lookDirection, this.lookAt, this.eyePosition);
        let rotationMatrix = mat4.create();
        mat4.fromRotation(rotationMatrix, angle, lookDirection);
        vec3.transformMat4(this.upVector, this.upVector, rotationMatrix);
        let dotProduct = vec3.dot(this.upVector, lookDirection);
        if (Math.abs(dotProduct) > 0.001) {
            console.log("Warning: up vector is not perpendicular to the look direction");
        }
        this.updateCamera();
    }

    public lookRight(angle: number): void {
        this.lookLeft(-angle);
    }


    public setLookAt(lookAt: vec3): void {
        this.lookAt = lookAt;
        this.updateCamera();
    }



    public setUpVector(upVector: vec3): void {
        this.upVector = upVector;
        this.updateCamera();
    }

    public setAspectRatio(aspectRatio: number): void {
        this.aspectRatio = aspectRatio;
        this.updateCamera();
    }

    public changeFieldOfView(angle: number): void {
        if (this.fieldOfView + angle > 180) {
            return;
        }
        if (this.fieldOfView + angle < 0) {
            return;
        }
        this.fieldOfView += angle;
        this.updateCamera();
    }
    public setFieldOfView(fieldOfView: number): void {
        this.fieldOfView = fieldOfView;
        this.updateCamera();
    }

    public setNearPlane(nearPlane: number): void {
        this.nearPlane = nearPlane;
        this.updateCamera();
    }

    public setFarPlane(farPlane: number): void {
        this.farPlane = farPlane;
        this.updateCamera();
    }

    public setViewPortWidth(viewPortWidth: number): void {
        this.viewPortWidth = viewPortWidth;
        this.updateCamera();
    }

    public setViewPortHeight(viewPortHeight: number): void {
        this.viewPortHeight = viewPortHeight;
        this.updateCamera();
    }

    public compareMatrix(matrix1: mat4, matrix2: mat4) {
        let errorFound: boolean = false;
        let differenceMatrix: mat4 = mat4.create();
        for (let i = 0; i < 16; i++) {
            if (matrix1[i] !== matrix2[i]) {
                errorFound = true;
                differenceMatrix[i] = 1;
            }
        }

        if (!errorFound) {
            return;
        }
        // print the difference matrix out in a readable format
        console.log("Difference matrix:");
        console.log(differenceMatrix[0], differenceMatrix[4], differenceMatrix[8], differenceMatrix[12]);
        console.log(differenceMatrix[1], differenceMatrix[5], differenceMatrix[9], differenceMatrix[13]);
        console.log(differenceMatrix[2], differenceMatrix[6], differenceMatrix[10], differenceMatrix[14]);
        console.log(differenceMatrix[3], differenceMatrix[7], differenceMatrix[11], differenceMatrix[15]);
    }



    public updateViewMatrix(): void {
        // compute the view matrix the hard way.
        let myViewMatrix = mat4.create();

        // calculate the look direction
        let lookDirection = vec3.create();
        vec3.subtract(lookDirection, this.lookAt, this.eyePosition);

        // normalize the look direction
        vec3.normalize(lookDirection, lookDirection);

        // calculate the right vector as the cross product of the look direction and the up vector
        let rightVector = vec3.create();
        vec3.cross(rightVector, lookDirection, this.upVector);
        vec3.normalize(rightVector, rightVector);

        // calculate the perpendicular up vector
        let perpendicularUpVector = vec3.create();
        vec3.cross(perpendicularUpVector, rightVector, lookDirection);
        vec3.normalize(perpendicularUpVector, perpendicularUpVector);

        // create the rotation matrix
        let rotationMatrix = mat4.fromValues(
            rightVector[0], rightVector[1], rightVector[2], 0,
            perpendicularUpVector[0], perpendicularUpVector[1], perpendicularUpVector[2], 0,
            -lookDirection[0], -lookDirection[1], -lookDirection[2], 0,
            0, 0, 0, 1);

        // create the translation matrix
        let translationMatrix = mat4.fromValues(
            1, 0, 0, -this.eyePosition[0],
            0, 1, 0, -this.eyePosition[1],
            0, 0, 1, -this.eyePosition[2],
            0, 0, 0, 1);

        // combine the matrices into the view matrix
        mat4.multiply(myViewMatrix, translationMatrix, rotationMatrix);
        // invert the view matrix
        mat4.invert(myViewMatrix, myViewMatrix);

        this.viewMatrix = myViewMatrix;

        this.compareMatrix(this.viewMatrix, myViewMatrix);

        mat4.lookAt(myViewMatrix, this.eyePosition, this.lookAt, this.upVector);
    }

    public updateProjectionMatrix(): void {
        if (this.usePerspective) {
            let aspectRatio = this.viewPortWidth / this.viewPortHeight;
            mat4.perspective(this._projectionMatrix,
                this.fieldOfView / 180.0 * Math.PI,
                aspectRatio,
                this.nearPlane,
                this.farPlane);
        } else {
            let left = -1;
            let right = 1;
            let bottom = -1;
            let top = 1;
            mat4.ortho(this._projectionMatrix, left, right, bottom, top, this.nearPlane, this.farPlane);
            console.log(this._projectionMatrix)
        }
        console.log(this._projectionMatrix)

    }

    public setProjection(perspective: boolean): void {
        this.usePerspective = perspective;
        this.updateProjectionMatrix();
    }



    public setRenderSolid(renderSolid: boolean): void {
        this.renderSolid = renderSolid;
    }


    public updateCamera(): void {
        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }

}

export default Camera;