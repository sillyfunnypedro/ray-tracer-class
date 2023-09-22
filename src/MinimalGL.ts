/** a minimal implementation of a openGL type rendering library 
 * This is intended to be used as a learning tool for understanding the basics of what is happening
 * in a 3D rendering pipeline.
 */

import { get } from "http";
import Color from "./Color";
import FrameBuffer from "./FrameBuffer";
import GeometricProcessor from "./GeometricProcessor";

// types for drawArrays
export enum PRIM {
    POINTS,
    LINES,
    TRIANGLES,
    TRIANGLE_STRIP,
    TRIANGLE_FAN,
}

// types for clear
export const GL_COLOR_BUFFER_BIT = 0x00004000;
export const GL_DEPTH_BUFFER_BIT = 0x00000100;
export const GL_STENCIL_BUFFER_BIT = 0x00000400;



export class GL {

    _frameBuffer: FrameBuffer;
    _geometricProcessor: GeometricProcessor = new GeometricProcessor();
    _dataBuffer: number[] = [];
    _indexBuffer: number[] = [];
    _inputVertexSize: number = 3;
    _inputColorSize: number = 3;
    _stride: number = 6;
    _backgroundColor: Color = new Color(0, 0, 0);
    // a function that takes an array of numbers and returns an array of numbers
    // this is the default vertex shader
    _vertexShader: ((data: number[]) => number[]) | null = null;


    constructor(frameBuffer: FrameBuffer) {
        this._frameBuffer = frameBuffer;
    }

    setDataBuffer(data: number[]) {
        this._dataBuffer = data;
    }

    setIndexBuffer(data: number[]) {
        this._indexBuffer = data;
    }

    setVertexShader(shader: (data: number[]) => number[]) {
        this._vertexShader = shader;
    }

    setBackgroundColor(r: number, g: number, b: number) {
        this._backgroundColor = new Color(r, g, b);
    }


    clear(mask: number) { // TODO: implement alpha
        if (mask & GL_COLOR_BUFFER_BIT) {
            this._frameBuffer.clear(this._backgroundColor.r, this._backgroundColor.g, this._backgroundColor.b);
        }
        if (mask & GL_DEPTH_BUFFER_BIT) {
            this._frameBuffer.clearZBuffer();
        }
    }


    drawArrays(primitive: PRIM) {
        // get the vertex shader
        let vertexShader = this._vertexShader;
        if (vertexShader === null) {
            throw new Error("Vertex shader not set");
        }

        // get the vertex based on stride and position
        function getVertex(this: GL, vertexIndex: number): number[] {
            return this._dataBuffer.slice(vertexIndex * this._stride, vertexIndex * this._stride + this._inputVertexSize);
        }
        // get the color based on stride and position
        function getColor(this: GL, vertexIndex: number): number[] {
            return this._dataBuffer.slice(vertexIndex * this._stride + this._inputVertexSize, vertexIndex * this._stride + this._inputVertexSize + this._inputColorSize);
        }
        // get the data buffer
        let dataBuffer = this._dataBuffer;

        const numVertices = dataBuffer.length / this._stride;
        let resultingDataBuffer: number[] = [];

        for (let vertexIndex = 0; vertexIndex < numVertices; vertexIndex++) {
            let vertexData = getVertex.call(this, vertexIndex);
            let colorData = getColor.call(this, vertexIndex);

            let transformedVertex = vertexShader(vertexData);
            resultingDataBuffer = resultingDataBuffer.concat(transformedVertex);
            resultingDataBuffer = resultingDataBuffer.concat(colorData);
        }

        if (primitive == PRIM.TRIANGLES) {
            GeometricProcessor.fillTriangles(resultingDataBuffer, numVertices / 3, this._frameBuffer, true, new Color(255, 0, 0));
        }
        if (primitive == PRIM.TRIANGLE_STRIP) {
            GeometricProcessor.fillTriangleStrip(resultingDataBuffer, this._frameBuffer, true, new Color(10, 10, 10));
        }



    }

}


