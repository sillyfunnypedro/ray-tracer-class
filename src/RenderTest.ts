import { GL, PRIM, GL_COLOR_BUFFER_BIT, MatricesGL, FragmentGL } from './MinimalGL'
import FrameBuffer from './FrameBuffer'
import { ModelManager, Model } from './ModelManager';
import { mat4, vec4 } from 'gl-matrix'


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

    // multiply by the matrices.toDevice
    vec4.transformMat4(result, result, matrices.toDevice);

    // return the first three elements of the result
    return [result[0], result[1], result[2]];

}




class RenderTest {

    frameBuffer: FrameBuffer;
    modelManager: ModelManager = new ModelManager();
    drawBorder: boolean;
    borderColorArray: number[];


    constructor(frameBuffer: FrameBuffer, drawBorder: boolean, borderColorArray: number[]) {
        this.frameBuffer = frameBuffer;
        this.drawBorder = drawBorder;
        this.borderColorArray = borderColorArray;
    }

    render(modelName: string) {
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

        // This is the same idea as OpenGL's VAO but we provide a more readable API
        gl.setColorSize(colorSize);
        gl.setColorOffset(colorOffset);

        gl.setVertexSize(vertexSize);
        gl.setVertexOffset(vertexOffset);

        // it is important here to add up all the elements that are in the data.
        gl.setStride(colorSize + vertexSize);

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








    }

}

export default RenderTest;