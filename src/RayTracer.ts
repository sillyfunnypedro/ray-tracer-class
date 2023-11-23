/**
 * @file RayTracer.ts
 * @desc RayTracer class.
 */

import FrameBuffer from "./FrameBuffer"
import Color from "./Color"
import Camera from "./Camera"
import Ray from "./Geometry/Ray"
import Scenes from "./Scenes"
import Scene from "./Geometry/Scene"
import { vec3 } from 'gl-matrix';



class Point {
    x: number = 0;
    y: number = 0;
    z: number = 0;
}

class RayTracer {
    private _frameBuffer: FrameBuffer;

    private _screenCenter = vec3.create();
    private _screenLowerLeft = vec3.create();
    private _uDelta = vec3.create();
    private _vDelta = vec3.create();

    // private _scene: Scene;

    constructor(frameBuffer: FrameBuffer) {
        this._frameBuffer = frameBuffer;
    }


    // the screen is defined by the camera.  the camera has a near plane and a view port.
    // the view port is defined by the width and height of the frame buffer.
    // the screen is on the near plane and its width is defined by the Field of View
    // the height of the screen is defined by the width of the screen and the aspect ratio
    public prepareForScreenPositions(x: number, y: number, camera: Camera) {

        const screenPosition = vec3.create();

        // calculate the width based on the near plane and the field of view
        const width = 2 * camera.nearPlane * Math.tan((camera.fieldOfView / 2) / 180 * Math.PI);


        // calculate the normalized eye vector
        const eyeVector = vec3.subtract(vec3.create(), camera.lookAt, camera.eyePosition);
        vec3.normalize(eyeVector, eyeVector);

        // calculate the center of the screen
        const center = vec3.add(vec3.create(), camera.eyePosition, vec3.scale(vec3.create(), eyeVector, camera.nearPlane));

        // the pixels are square so the height is of the screen is based on the resolution of the framebuffer
        const height = width * (this._frameBuffer.height / this._frameBuffer.width);

        // now we need to calculate the lower left corner of the screen
        // first we need to calculate the u vector

        // we check that the up vector is not parallel to the eye vector
        // if it is we throw an error
        if (vec3.dot(camera.upVector, eyeVector) === 1) {
            throw new Error("Up vector is parallel to the eye vector");
        }


        const uVector = vec3.cross(vec3.create(), eyeVector, camera.upVector);
        vec3.normalize(uVector, uVector);

        // now we calculate the vVector
        const vVector = vec3.cross(vec3.create(), uVector, eyeVector);

        // now we calculate the lower left corner of the screen

        // first we calculate the uDelta
        this._uDelta = vec3.scale(vec3.create(), uVector, width / this._frameBuffer.width);
        this._vDelta = vec3.scale(vec3.create(), vVector, height / this._frameBuffer.height);

        // now we calculate the lower left corner of the screen
        this._screenLowerLeft = vec3.subtract(vec3.create(), center, vec3.scale(vec3.create(), this._uDelta, this._frameBuffer.width / 2));
        vec3.subtract(this._screenLowerLeft, this._screenLowerLeft, vec3.scale(vec3.create(), this._vDelta, this._frameBuffer.height / 2));
    }


    public getScreenPosition2(x: number, y: number, camera: Camera): vec3 {
        this.prepareForScreenPositions(x, y, camera);
        // now we calculate the position of the pixel
        let screenPosition = vec3.create();

        vec3.add(screenPosition, this._screenLowerLeft, vec3.scale(vec3.create(), this._uDelta, x));
        vec3.add(screenPosition, screenPosition, vec3.scale(vec3.create(), this._vDelta, y));

        return screenPosition;
    }


    public render(camera: Camera, selectedScene: string): void {

        if (selectedScene === "") {
            return;
        }
        const scene = Scenes.getScene(selectedScene)

        if (scene === null || scene === undefined) {
            throw new Error("scene is null or undefined");
        }
        const eyePosition = camera.eyePosition;

        const lookAt = camera.lookAt;

        const nearPlane = camera.nearPlane;

        const width = camera.viewPortWidth;
        const height = camera.viewPortHeight;

        const pixelWidth = width / this._frameBuffer.width;
        const pixelHeight = height / this._frameBuffer.height;

        // we need to calculate the delta vector for the x and y axis
        const eyeVector = vec3.subtract(vec3.create(), lookAt, eyePosition);
        vec3.normalize(eyeVector, eyeVector);

        const upVector = camera.upVector;

        const uVector = vec3.cross(vec3.create(), eyeVector, upVector);
        vec3.normalize(uVector, uVector);

        const vVector = vec3.cross(vec3.create(), uVector, eyeVector);
        vec3.normalize(vVector, vVector);

        const centerPoint = vec3.add(vec3.create(), eyePosition, vec3.scale(vec3.create(), eyeVector, nearPlane));

        const uDelta = vec3.scale(vec3.create(), uVector, pixelWidth);
        const vDelta = vec3.scale(vec3.create(), vVector, pixelHeight);

        for (let i = 0; i < this._frameBuffer.height; i++) {
            for (let j = 0; j < this._frameBuffer.width; j++) {




                const screenPosition = this.getScreenPosition2(j, this._frameBuffer.height - i, camera);
                let rayDirection = vec3.subtract(vec3.create(), screenPosition, eyePosition);

                // make the ray direction always point to the center of the screen
                //rayDirection = vec3.subtract(rayDirection, lookAt, eyePosition);

                vec3.normalize(rayDirection, rayDirection);
                let ray = new Ray(eyePosition, rayDirection);

                let intersect = scene.intersect;

                if (intersect === null || intersect === undefined) {
                    throw new Error("intersect is null or undefined");
                }
                let color = scene.intersect(ray, null);
                // this is for debugging and finding a single pixel.

                // uncomment this to find a single pixel and then put a break point on the next call to intersect.
                if (i === this._frameBuffer.height / 2 && j === -30 + this._frameBuffer.width / 2) {
                    // console.log("center");
                    // this._frameBuffer.pixels[i][j] = Color.createFromVec3(vec3.fromValues(1, 0, 0));
                    // let color = scene.intersect(ray);
                    // continue;
                }
                this._frameBuffer.pixels[i][j] = Color.createFromVec3(color);
            }
        }
    }



}

export default RayTracer;