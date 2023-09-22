import { GL, PRIM, GL_COLOR_BUFFER_BIT } from './MinimalGL'
import FrameBuffer from './FrameBuffer'
import ModelManager from './ModelManager';



function scaleHalf(data: number[]): number[] {
    let newData: number[] = [];
    for (let i = 0; i < data.length; i++) {
        newData.push(data[i] / 2);
    }
    return newData;
}


class RenderTest {

    frameBuffer: FrameBuffer;
    modelManager: ModelManager = new ModelManager();

    constructor(frameBuffer: FrameBuffer) {
        this.frameBuffer = frameBuffer;
        let gl = new GL(frameBuffer);
        gl.setVertexShader((data: number[]) => {
            return data;
        });

        const vertices = this.modelManager.getModel('triangleStrip', frameBuffer.width, frameBuffer.height);
        gl.setBackgroundColor(128, 128, 128);
        gl.clear(GL_COLOR_BUFFER_BIT);
        gl.setDataBuffer(vertices);
        gl.drawArrays(PRIM.TRIANGLE_STRIP);
        gl.setVertexShader(scaleHalf);
        gl.drawArrays(PRIM.TRIANGLE_STRIP);


    }

}

export default RenderTest;