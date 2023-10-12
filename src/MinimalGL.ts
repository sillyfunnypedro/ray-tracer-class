/** a minimal implementation of a openGL type rendering library 
 * This is intended to be used as a learning tool for understanding the basics of what is happening
 * in a 3D rendering pipeline.
 */

import Color from "./Color";
import FrameBuffer from "./FrameBuffer";
import GeometricProcessor, { ActiveData } from "./GeometricProcessor";
import { mat4, vec4 } from "gl-matrix";
import PPM from "./PPM";
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

export class MatricesGL {
    toDevice: mat4 = mat4.identity(mat4.create());  // from normalized device coordinates to device coordinates
    modelMatrix: mat4 = mat4.identity(mat4.create());
    viewMatrix: mat4 = mat4.identity(mat4.create());
    projectionMatrix: mat4 = mat4.identity(mat4.create());
}

export class FragmentGL {
    color: number[] = [];
    uv: number[] = [];
    normal: number[] = [];
    fromEye: number[] = [];
    fromLight: number[] = [];
    depth: number = 0;
    PPMTexture: PPM | null = null;
}




export class GL {

    _frameBuffer: FrameBuffer;
    _geometricProcessor: GeometricProcessor = new GeometricProcessor();
    _dataBuffer: number[] = [];
    _indexBuffer: number[] = [];
    _vertexSize: number = 0;
    _outputVertexSize: number = 3;
    _stride: number = 0;
    _backgroundColor: Color = new Color(0, 0, 0);
    _matrices: MatricesGL = new MatricesGL();
    _vertexOffset: number = 0;
    _colorSize: number = 0;
    _colorOffset: number = 0;
    _normalSize: number = 0;
    _normalOffset: number = 0;
    _textureSize: number = 0;
    _textureOffset: number = 0;
    _textureObject: PPM | null = null;

    // Non openGL stuff for our demo
    _drawBorder: boolean = false;
    _borderColor: Color = new Color(0, 0, 0);

    //* the matrices that will be used for the transformations
    // a function that takes an array of numbers and returns an array of numbers
    // this is the default vertex shader
    _vertexShader: ((data: number[], matrices: MatricesGL) => number[]) | null = null;

    _fragmentShader: ((data: FragmentGL) => number[]) | null = null;


    constructor(frameBuffer: FrameBuffer) {
        this._frameBuffer = frameBuffer;
    }

    setDataBuffer(data: number[]) {
        this._dataBuffer = data;
    }

    setIndexBuffer(data: number[]) {
        this._indexBuffer = data;
    }

    setVertexShader(shader: (data: number[], matrices: MatricesGL) => number[]) {
        this._vertexShader = shader;
    }

    setFragmentShader(shader: (data: FragmentGL) => number[]) {
        this._fragmentShader = shader;
        GeometricProcessor.fragmentShader = shader;
    }

    setBackgroundColor(r: number, g: number, b: number) {
        this._backgroundColor = new Color(r, g, b);
    }

    setVertexSize(size: number) {
        this._vertexSize = size;
    }

    setVertexOffset(offset: number) {
        this._vertexOffset = offset;
    }

    setColorSize(size: number) {
        this._colorSize = size;
    }

    setColorOffset(offset: number) {
        this._colorOffset = offset;
    }

    setNormalSize(size: number) {
        this._normalSize = size;
    }

    setNormalOffset(offset: number) {
        this._normalOffset = offset;
    }

    setTextureSize(size: number) {
        this._textureSize = size;
    }

    setTextureOffset(offset: number) {
        this._textureOffset = offset;
    }

    setStride(stride: number) {
        this._stride = stride;
    }

    // non openGL stuff for our demo
    setDrawBorder(drawBorder: boolean) {
        this._drawBorder = drawBorder;
    }

    setBorderColor(r: number, g: number, b: number) {
        this._borderColor = new Color(r, g, b);
    }

    setModelMatrix(matrix: mat4) {
        this._matrices.modelMatrix = matrix;
    }

    setViewMatrix(matrix: mat4) {
        this._matrices.viewMatrix = matrix;
    }

    setModelViewMatrix(matrix: mat4) {
        this._matrices.modelMatrix = matrix;
    }

    setProjectionMatrix(matrix: mat4) {
        this._matrices.projectionMatrix = matrix;
    }

    setTextureObject(textureObject: PPM) {
        this._textureObject = textureObject;
        GeometricProcessor.PPMTexture = textureObject;
    }







    setViewport(x: number, y: number, width: number, height: number) {
        this._matrices.toDevice = mat4.create();

        // scale from 2 to width, height
        mat4.translate(this._matrices.toDevice, this._matrices.toDevice, [x, y, 0]);
        mat4.translate(this._matrices.toDevice, this._matrices.toDevice, [width / 2, height / 2, 0]);
        mat4.scale(this._matrices.toDevice, this._matrices.toDevice, [width / 2, -height / 2, 1]);
    }




    clear(mask: number) { // TODO: implement alpha
        if (mask & GL_COLOR_BUFFER_BIT) {
            this._frameBuffer.clear(this._backgroundColor.r, this._backgroundColor.g, this._backgroundColor.b);
        }
        if (mask & GL_DEPTH_BUFFER_BIT) {
            this._frameBuffer.clearZBuffer();
        }
    }

    processVertices(numVertices: number): number[] {
        let vertexShader = this._vertexShader;
        if (vertexShader === null) {
            throw new Error("Vertex shader not set");
        }

        function getData(this: GL, vertexIndex: number, length: number, offset: number): number[] {
            return this._dataBuffer.slice(vertexIndex * this._stride + offset, vertexIndex * this._stride + offset + length);
        }


        let resultingDataBuffer: number[] = [];
        for (let vertexIndex = 0; vertexIndex < numVertices; vertexIndex++) {

            let vertexData = getData.call(this, vertexIndex, this._vertexSize, this._vertexOffset);
            let colorData = getData.call(this, vertexIndex, this._colorSize, this._colorOffset);
            let uvData = getData.call(this, vertexIndex, this._textureSize, this._textureOffset);
            let normalData = getData.call(this, vertexIndex, this._normalSize, this._normalOffset);

            let newData = vertexShader(vertexData, this._matrices); // assume this returns a 4 dimensional vector

            let newDataVec4 = vec4.fromValues(newData[0], newData[1], newData[2], newData[3]);

            // make the vector homogeneous
            vec4.scale(newDataVec4, newDataVec4, 1 / newDataVec4[3]);

            vec4.transformMat4(newDataVec4, newDataVec4, this._matrices.toDevice);
            newData = [newDataVec4[0], newDataVec4[1], newDataVec4[2], newDataVec4[3]];

            resultingDataBuffer = resultingDataBuffer.concat(newData[0], newData[1], newData[2]);
            // TODO fix this to account for normals

            this._outputVertexSize = 3;
            resultingDataBuffer = resultingDataBuffer.concat(colorData);
            resultingDataBuffer = resultingDataBuffer.concat(uvData);
            resultingDataBuffer = resultingDataBuffer.concat(normalData);
        }

        return resultingDataBuffer;

    }


    drawArrays(primitive: PRIM, numVertices: number) {
        // get the vertex shader
        let vertexShader = this._vertexShader;
        if (vertexShader === null) {
            throw new Error("Vertex shader not set");
        }

        // get the fragment shader
        let fragmentShader = this._fragmentShader;
        if (fragmentShader === null) {
            throw new Error("Fragment shader not set");
        }

        // get the vertex position, the color, the normal, and the texture coordinate
        let resultingDataBuffer = this.processVertices(numVertices);

        if (primitive == PRIM.TRIANGLES) {
            let activeData = new ActiveData();

            activeData.vertexSize = this._outputVertexSize;
            activeData.vertexOffset = this._vertexOffset;
            activeData.colorSize = this._colorSize;
            activeData.colorOffset = this._colorOffset;
            activeData.normalSize = this._normalSize;
            activeData.normalOffset = this._normalOffset;
            activeData.uvSize = this._textureSize;
            activeData.uvOffset = this._textureOffset;
            activeData.stride = this._stride + (this._outputVertexSize - this._vertexSize);

            // now if the vertex size has increased we need to increment the offset of all the 
            // pieces of data that are present.

            const offsetAdjust = (this._outputVertexSize - this._vertexSize);

            if (activeData.colorSize > 0) {
                activeData.colorOffset += offsetAdjust;
            }

            if (activeData.normalSize > 0) {
                activeData.normalOffset += offsetAdjust;
            }

            if (activeData.uvSize > 0) {
                activeData.uvOffset += offsetAdjust;
            }

            GeometricProcessor.fillTriangles(resultingDataBuffer, numVertices, this._frameBuffer, this._drawBorder, this._borderColor, activeData);
        }
        if (primitive == PRIM.TRIANGLE_STRIP) {
            GeometricProcessor.fillTriangleStrip(resultingDataBuffer, numVertices, this._frameBuffer, this._drawBorder, this._borderColor);
        }

        if (primitive == PRIM.TRIANGLE_FAN) {
            GeometricProcessor.fillTriangleFan(resultingDataBuffer, numVertices, this._frameBuffer, this._drawBorder, this._borderColor);
        }

    }

    drawElements(primitive: PRIM, numVertices: number) {
        // get the vertex shader
        let vertexShader = this._vertexShader;
        if (vertexShader === null) {
            throw new Error("Vertex shader not set");
        }

        // get the fragment shader
        let fragmentShader = this._fragmentShader;
        if (fragmentShader === null) {
            throw new Error("Fragment shader not set");
        }

        let resultingDataBuffer = this.processVertices(numVertices);

        GeometricProcessor.fillTrianglesIndex(resultingDataBuffer, this._indexBuffer, this._indexBuffer.length / 3, this._frameBuffer, this._drawBorder, this._borderColor);
    }

}


