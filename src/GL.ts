/** a minimal implementation of a openGL type rendering library 
 * This is intended to be used as a learning tool for understanding the basics of what is happening
 * in a 3D rendering pipeline.
 */

import Color from "./Color";
import FrameBuffer from "./FrameBuffer";
import GeometricProcessor from "./GeometricProcessor";

// types for drawArrays
export const POINTS = 0;
export const LINES = 1;
export const LINE_STRIP = 2;
export const LINE_LOOP = 3;
export const TRIANGLES = 4;
export const TRIANGLE_STRIP = 5;
export const TRIANGLE_FAN = 6;


class GL {

    _frameBuffer: FrameBuffer;
    _geometricProcessor: GeometricProcessor = new GeometricProcessor();
    _dataBuffer: number[] = [];
    _indexBuffer: number[] = [];
    // a function that takes an array of numbers and returns an array of numbers
    // this is the default vertex shader
    _vertexShader: Function = (data: number[]) => { return data };



    constructor(frameBuffer: FrameBuffer) {
        this._frameBuffer = frameBuffer;
    }

    setDataBuffer(data: number[]) {
        this._dataBuffer = data;
    }

    setIndexBuffer(data: number[]) {
        this._indexBuffer = data;
    }

    setVertexShader(shader: Function) {
        this._vertexShader = shader;
    }



}


