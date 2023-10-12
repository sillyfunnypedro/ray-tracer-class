import { GL, PRIM, GL_COLOR_BUFFER_BIT, MatricesGL, FragmentGL } from './MinimalGL'
import FrameBuffer from './FrameBuffer'
import { ModelManager, Model } from './ModelManager';
import { mat4, vec4 } from 'gl-matrix'
import PPM from './PPM';
import { imageSource } from './ImageSource';


function defaultFragmentShader(fragParameters: FragmentGL): number[] {
    let result = fragParameters.color;
    return result;
}

function grayFragmentShader(fragParameters: FragmentGL): number[] {
    // compute the gray colour according to the formula
    let r = fragParameters.color[0];
    let g = fragParameters.color[1];
    let b = fragParameters.color[2];

    let gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    let result = [gray, gray, gray, fragParameters.color[3]];
    return result;
}

function defaultVertexShader(vertex: number[], matrices: MatricesGL): number[] {
    let result: vec4 = [0, 0, 0, 1];
    for (let i = 0; i < vertex.length; i++) {
        result[i] = vertex[i];
    }

    vec4.transformMat4(result, result, matrices.modelMatrix);

    return [result[0], result[1], result[2], result[3]];

}

function uvShadeFragmentShader(fragParameters: FragmentGL): number[] {
    let uv = fragParameters.uv;
    let result: number[] = [];
    if (fragParameters.PPMTexture !== null) {
        let textureResult = fragParameters.PPMTexture.sampler2D(uv[0], uv[1]);
        result = textureResult;
    }
    return result;
}




class RenderTest {

    frameBuffer: FrameBuffer;
    modelManager: ModelManager = new ModelManager();
    drawBorder: boolean;
    borderColorArray: number[];
    ppm: PPM = new PPM();




    constructor(frameBuffer: FrameBuffer, drawBorder: boolean, borderColorArray: number[]) {
        this.frameBuffer = frameBuffer;
        this.drawBorder = drawBorder;
        this.borderColorArray = borderColorArray;
        this.ppm.loadFileFromString(imageSource);
    }

    render(modelName: string, rotateX: number, rotateY: number, rotateZ: number, translateX: number, translateY: number, translateZ: number, scaleX: number, scaleY: number, scaleZ: number) {
        let gl = new GL(this.frameBuffer);

        const model: Model = this.modelManager.getModel(modelName, this.frameBuffer.width, this.frameBuffer.height);
        const dataBuffer = model.dataBuffer;
        const numVertices = model.numVertices;
        const vertexSize = model.vertexSize
        const vertexOffset = model.vertexOffset;
        const colorSize = model.colorLength;
        const colorOffset = model.colorOffset;


        const textureLength = model.textureLength;
        const indexBuffer = model.indexBuffer;


        gl.setBackgroundColor(128, 128, 128);
        gl.clear(GL_COLOR_BUFFER_BIT);


        gl.setDataBuffer(dataBuffer);


        // there always have to be vertex data
        gl.setVertexSize(model.vertexSize);
        gl.setVertexOffset(model.vertexOffset);

        gl.setColorSize(model.colorLength);
        gl.setColorOffset(model.colorOffset);

        gl.setTextureSize(model.textureLength);
        gl.setTextureOffset(model.textureOffset);

        gl.setNormalSize(model.normalLength);
        gl.setNormalOffset(model.normalOffset);

        // it is important here to add up all the elements that are in the data.
        gl.setStride(model.stride);

        // here is our vertex shader
        gl.setVertexShader(defaultVertexShader);

        // here is our fragment shader
        gl.setFragmentShader(defaultFragmentShader);

        gl.setDrawBorder(this.drawBorder);
        gl.setBorderColor(this.borderColorArray[0], this.borderColorArray[1], this.borderColorArray[2]);


        // make the viewport square
        let size = Math.min(this.frameBuffer.width, this.frameBuffer.height);

        let x_offset = (this.frameBuffer.width - size) / 2;
        let y_offset = (this.frameBuffer.height - size) / 2;
        gl.setViewport(x_offset, y_offset, size, size);
        //gl.setViewport(0, 0, this.frameBuffer.width, this.frameBuffer.height);


        let modelMatrix = mat4.create();

        mat4.translate(modelMatrix, modelMatrix, [translateX, translateY, translateZ]);
        mat4.rotate(modelMatrix, modelMatrix, rotateX/180.0 * Math.PI, [1, 0, 0]);
        mat4.rotate(modelMatrix, modelMatrix, rotateY/180.0 * Math.PI, [0, 1, 0]);
        mat4.rotate(modelMatrix, modelMatrix, rotateZ/180.0 * Math.PI, [0, 0, 1]);
        mat4.scale(modelMatrix, modelMatrix, [scaleX, scaleY, scaleZ]);

        gl.setModelMatrix(modelMatrix);

        if (modelName === "triangleStrip") {

            gl.drawArrays(PRIM.TRIANGLE_STRIP, numVertices);
        }

        if (modelName === "triangleFan") {

            gl.drawArrays(PRIM.TRIANGLE_FAN, numVertices);
        }

        if (modelName === "triangleMesh" || modelName === "triangleMesh2d") {

            gl.drawArrays(PRIM.TRIANGLES, numVertices);
        }

        if (modelName === "meshIndex") {

            gl.setIndexBuffer(indexBuffer);
            gl.drawElements(PRIM.TRIANGLES, model.numVertices);
        }
        if (modelName === "triangleTexture" || modelName === "quadTexture") {
            gl.setTextureObject(this.ppm);
            gl.setFragmentShader(uvShadeFragmentShader);
            gl.drawArrays(PRIM.TRIANGLES, numVertices);
        }









    }

}

export default RenderTest;