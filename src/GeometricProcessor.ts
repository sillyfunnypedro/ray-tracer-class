import { off } from "process";
import Color from "./Color";
import FrameBuffer from "./FrameBuffer";
import { FragmentGL } from "./MinimalGL";
import PPM from "./PPM";

export class ActiveData {
    bufferData: number[] = [];
    vertexSize: number = 0;
    vertexOffset: number = 0;
    colorSize: number = 0;
    colorOffset: number = 0;
    normalSize: number = 0;
    normalOffset: number = 0;
    uvSize: number = 0;
    uvOffset: number = 0;
    stride: number = 0;
}

class VertexData {
    position: number[] = [];
    color: Color = new Color(0, 0, 0);
    normal: number[] = [];
    uv: number[] = [];

    constructor() {
    }
    static interpolateArray(a: number[], b: number[], t: number): number[] {
        let result: number[] = [];
        for (let i = 0; i < a.length; i++) {
            result.push(a[i] * (1 - t) + b[i] * t);
        }
        return result;
    }

    static interpolate(vertex0: VertexData, vertex1: VertexData, t: number): VertexData {
        let result = new VertexData();
        result.position = VertexData.interpolateArray(vertex0.position, vertex1.position, t);
        result.color = Color.interpolate(vertex0.color, vertex1.color, t);
        result.normal = VertexData.interpolateArray(vertex0.normal, vertex1.normal, t);
        result.uv = VertexData.interpolateArray(vertex0.uv, vertex1.uv, t);
        return result;
    }

}


class GeometricProcessor {
    // draw a line using breseham algorithm
    static fragmentShader: ((data: FragmentGL) => number[]) | null = null;

    static PPMTexture: PPM | null = null;


    static drawLine(x0: number, y0: number, x1: number, y1: number, color: Color, frameBuffer: FrameBuffer) {
        // Make sure that all the coordinates are integers
        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);


        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            frameBuffer.setPixel(x0, y0, color);
            if ((x0 === x1) && (y0 === y1)) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    static fillRect(x: number, y: number, width: number, height: number, color: Color, frameBuffer: FrameBuffer) {

        for (let j = y; j < y + height; j++) {
            GeometricProcessor.drawLine(x, j, x + width, j, color, frameBuffer);
        }
    }

    /**
     * 
     * @param x0 
     * @param x1 
     * @param y 
     * @param color0 
     * @param color1 
     * @param frameBuffer 
     * 
     * Draw the pixels between x0 and x1 on the y line with color0 and color1
     * Assume x0 < x1
     */
    static scanLineColor(x0: number, x1: number, y: number, color0: Color, color1: Color, frameBuffer: FrameBuffer) {

        // clip the line to the screen
        if (x0 < 0) {
            x0 = 0;
        }
        if (x1 >= frameBuffer.width) {
            x1 = frameBuffer.width - 1;
        }

        if (y < 0 || y >= frameBuffer.height) {
            return;
        }

        let dx = Math.abs(x1 - x0);
        let t = 0;
        for (let i = x0; i <= x1; i++) {
            if (dx === 0) {
                t = 0;
            }
            else {
                t = (i - x0) / dx;
            }
            let color = Color.interpolate(color0, color1, t);

            const fragParameters = new FragmentGL();
            fragParameters.color = color.toArray();

            if (GeometricProcessor.fragmentShader !== null) {
                let newColor = GeometricProcessor.fragmentShader(fragParameters);
                color = new Color(newColor[0], newColor[1], newColor[2], newColor[3]);
            }
            frameBuffer.setPixel(i, y, color);
        }
    }

    static scanLineVertexData(x0: number, x1: number, y: number, vertex0: VertexData, vertex1: VertexData, frameBuffer: FrameBuffer) {

        // clip the line to the screen
        if (x0 < 0) {
            x0 = 0;
        }
        if (x1 >= frameBuffer.width) {
            x1 = frameBuffer.width - 1;
        }

        if (y < 0 || y >= frameBuffer.height) {
            return;
        }

        let dx = Math.abs(x1 - x0);
        let t = 0;
        for (let i = x0; i <= x1; i++) {
            if (dx === 0) {
                t = 0;
            }
            else {
                t = (i - x0) / dx;
            }
            let vertex = VertexData.interpolate(vertex0, vertex1, t);
            let color = vertex.color;


            const fragParameters = new FragmentGL();
            fragParameters.color = color.toArray();
            fragParameters.uv = vertex.uv;
            fragParameters.PPMTexture = GeometricProcessor.PPMTexture;

            if (GeometricProcessor.fragmentShader !== null) {
                let newColor = GeometricProcessor.fragmentShader(fragParameters);
                color = new Color(newColor[0], newColor[1], newColor[2], newColor[3]);
            }
            frameBuffer.setPixel(i, y, color);
        }
    }


    static fillTriangleVertexData(vertex0: VertexData, vertex1: VertexData, vertex2: VertexData, frameBuffer: FrameBuffer) {
        // make all the coordinates integers
        let x0 = Math.round(vertex0.position[0]);
        let y0 = Math.round(vertex0.position[1]);
        let x1 = Math.round(vertex1.position[0]);
        let y1 = Math.round(vertex1.position[1]);
        let x2 = Math.round(vertex2.position[0]);
        let y2 = Math.round(vertex2.position[1]);


        if (y0 > y1) {
            [y0, y1] = [y1, y0];
            [x0, x1] = [x1, x0];
            [vertex0, vertex1] = [vertex1, vertex0];
        }
        if (y1 > y2) {
            [y2, y1] = [y1, y2];
            [x2, x1] = [x1, x2];
            [vertex2, vertex1] = [vertex1, vertex2];
        }
        if (y0 > y1) {
            [y0, y1] = [y1, y0];
            [x0, x1] = [x1, x0];
            [vertex0, vertex1] = [vertex1, vertex0];
        }

        if (y0 === y2) { // Handle awkward all-on-same-line case as its own thing
            let a = x0;
            let b = x0;
            let color_a = vertex0.color;
            let color_b = vertex0.color;
            if (x1 < a) {
                a = x1;
                color_a = vertex1.color;
            }
            else if (x1 > b) {
                b = x1;
                color_b = vertex1.color;
            }
            if (x2 < a) {
                a = x2;
                color_a = vertex2.color;
            }
            else if (x2 > b) {
                b = x2;
                color_b = vertex2.color;
            }
            GeometricProcessor.scanLineVertexData(a, b, y0, vertex0, vertex1, frameBuffer);
            return;

        }
        // For upper part of triangle, find scanline crossings for segments
        // 0-1 and 0-2.  If y1=y2 (flat-bottomed triangle), the scanline y1
        // is included here (and second loop will be skipped, avoiding a /0
        // error there), otherwise scanline y1 is skipped here and handled
        // in the second loop...which also avoids a /0 error here if y0=y1
        // (flat-topped triangle).

        let a, b, y, last;
        if (y1 === y2) {
            last = y1;   // Include y1 scanline
        } else {
            last = y1 - 1; // Skip it
        }
        for (y = y0; y <= last; y++) {
            let a_t = (y - y0) / (y1 - y0);
            let b_t = (y - y0) / (y2 - y0);

            a = x0 + (x1 - x0) * a_t;
            b = x0 + (x2 - x0) * b_t;

            let vertex_a = VertexData.interpolate(vertex0, vertex1, a_t);
            let vertex_b = VertexData.interpolate(vertex0, vertex2, b_t);
            if (a > b) {

                [a, b] = [b, a];
                [vertex_a, vertex_b] = [vertex_b, vertex_a];
            }
            a = Math.ceil(a);
            b = Math.floor(b);
            GeometricProcessor.scanLineVertexData(a, b, y, vertex_a, vertex_b, frameBuffer);

        }
        // For lower part of triangle, find scanline crossings for segments
        // 0-2 and 1-2.  This loop is skipped if y1=y2.

        for (; y <= y2; y++) {
            let a_t = (y - y1) / (y2 - y1);
            let b_t = (y - y0) / (y2 - y0);

            a = x1 + (x2 - x1) * a_t;
            b = x0 + (x2 - x0) * b_t;

            let vertex_a = VertexData.interpolate(vertex1, vertex2, a_t);
            let vertex_b = VertexData.interpolate(vertex0, vertex2, b_t);
            if (a > b) {

                [a, b] = [b, a];
                [vertex_a, vertex_b] = [vertex_b, vertex_a];
            }
            a = Math.ceil(a);
            b = Math.floor(b);
            GeometricProcessor.scanLineVertexData(a, b, y, vertex_a, vertex_b, frameBuffer);
        }
    }




    static fillTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, borderColor: Color, color: Color, frameBuffer: FrameBuffer) {
        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        x2 = Math.round(x2);
        y2 = Math.round(y2);

        let a, b, y, last;

        //Sort coordinates by Y order(y2 >= y1 >= y0)
        if (y0 > y1) {
            [y0, y1] = [y1, y0];
            [x0, x1] = [x1, x0];
        }
        if (y1 > y2) {
            [y2, y1] = [y1, y2];
            [x2, x1] = [x1, x2];
        }
        if (y0 > y1) {
            [y0, y1] = [y1, y0];
            [x0, x1] = [x1, x0];
        }

        if (y0 === y2) { // Handle awkward all-on-same-line case as its own thing
            a = b = x0;
            if (x1 < a) a = x1;
            else if (x1 > b) b = x1;
            if (x2 < a) a = x2;
            else if (x2 > b) b = x2;
            GeometricProcessor.drawLine(a, y0, b, y0, color, frameBuffer);
            return;

        }




        // For upper part of triangle, find scanline crossings for segments
        // 0-1 and 0-2.  If y1=y2 (flat-bottomed triangle), the scanline y1
        // is included here (and second loop will be skipped, avoiding a /0
        // error there), otherwise scanline y1 is skipped here and handled
        // in the second loop...which also avoids a /0 error here if y0=y1
        // (flat-topped triangle).

        if (y1 === y2) last = y1;   // Include y1 scanline
        else last = y1 - 1; // Skip it


        for (y = y0; y <= last; y++) {

            a = x0 + (x1 - x0) * (y - y0) / (y1 - y0);
            b = x0 + (x2 - x0) * (y - y0) / (y2 - y0);



            if (a > b) [a, b] = [b, a];
            // shift a to the next integer, and b to the integer that preceeds it
            a = Math.ceil(a);
            b = Math.floor(b);
            GeometricProcessor.drawLine(a, y, b, y, color, frameBuffer);
        }

        // For lower part of triangle, find scanline crossings for segments
        // 0-2 and 1-2.  This loop is skipped if y1=y2.

        for (; y <= y2; y++) {

            a = x1 + (x2 - x1) * (y - y1) / (y2 - y1);
            b = x0 + (x2 - x0) * (y - y0) / (y2 - y0);

            if (a > b) [a, b] = [b, a];
            a = Math.ceil(a);
            b = Math.floor(b);
            GeometricProcessor.drawLine(a, y, b, y, color, frameBuffer);
        }

        // now draw the lines of the triangle in border color

        GeometricProcessor.drawLine(x0, y0, x1, y1, borderColor, frameBuffer);
        GeometricProcessor.drawLine(x0, y0, x2, y2, borderColor, frameBuffer);
        GeometricProcessor.drawLine(x1, y1, x2, y2, borderColor, frameBuffer);



    }
    static fillTriangleColor(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color0: Color, color1: Color, color2: Color, frameBuffer: FrameBuffer) {
        // make all the coordinates integers
        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        x2 = Math.round(x2);
        y2 = Math.round(y2);

        // Calculate the z component of cross product of the vectors (x1-x0, y1-y0) and (x2-x0, y2-y0)
        // This will be positive if the winding order is counter clockwise
        // This will be negative if the winding order is clockwise
        // we are in screen space so the we want clockwise as the front
        const crossProduct = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);

        // if the cross product is negative then set all colors to [30, 30, 30]
        if (crossProduct > 0) {
            color0 = new Color(255, 255, 255);
            color1 = new Color(0, 0, 0);
            color2 = new Color(0, 0, 0);
        }


        let a, b, y, last;
        let color_a: Color = color0;
        let color_b: Color = color2;

        //Sort coordinates by Y order(y2 >= y1 >= y0)
        if (y0 > y1) {
            [y0, y1] = [y1, y0];
            [x0, x1] = [x1, x0];
            let temp = color0;
            color0 = color1;
            color1 = temp;
        }
        if (y1 > y2) {
            [y2, y1] = [y1, y2];
            [x2, x1] = [x1, x2];
            let temp = color1;
            color1 = color2;
            color2 = temp;
        }
        if (y0 > y1) {
            [y0, y1] = [y1, y0];
            [x0, x1] = [x1, x0];
            let temp = color0;
            color0 = color1;
            color1 = temp;
        }

        if (y0 === y2) { // Handle awkward all-on-same-line case as its own thing
            a = b = x0;
            color_a = color0;
            color_b = color0;
            if (x1 < a) {
                a = x1;
                color_a = color1;
            }
            else if (x1 > b) {
                b = x1;
                color_b = color1;
            }
            if (x2 < a) {
                a = x2;
                color_a = color2;
            }
            else if (x2 > b) {
                b = x2;
                color_b = color2;
            }
            GeometricProcessor.scanLineColor(a, b, y0, color_a, color_b, frameBuffer);
            return;

        }

        // set up the interpolation for the colors
        let b_t = 0;
        let a_t = 0;

        // For upper part of triangle, find scanline crossings for segments
        // 0-1 and 0-2.  If y1=y2 (flat-bottomed triangle), the scanline y1
        // is included here (and second loop will be skipped, avoiding a /0
        // error there), otherwise scanline y1 is skipped here and handled
        // in the second loop...which also avoids a /0 error here if y0=y1
        // (flat-topped triangle).
        if (y1 === y2) last = y1;   // Include y1 scanline
        else last = y1 - 1; // Skip it

        for (y = y0; y <= last; y++) {


            a = x0 + (x1 - x0) * (y - y0) / (y1 - y0);
            b = x0 + (x2 - x0) * (y - y0) / (y2 - y0);

            // update the color interpolation
            b_t = (y - y0) / (y2 - y0);
            a_t = (y - y0) / (y1 - y0);
            color_b = Color.interpolate(color0, color2, b_t);

            color_a = Color.interpolate(color0, color1, a_t);

            if (a > b) {
                [a, b] = [b, a];
                [color_a, color_b] = [color_b, color_a];
            }
            // shift a to the next integer, and b to the integer that preceeds it
            a = Math.ceil(a);
            b = Math.floor(b);
            GeometricProcessor.scanLineColor(a, b, y, color_a, color_b, frameBuffer);
        }

        a_t = 0;
        // For lower part of triangle, find scanline crossings for segments
        // 0-2 and 1-2.  This loop is skipped if y1=y2.

        for (; y <= y2; y++) {

            a = x1 + (x2 - x1) * (y - y1) / (y2 - y1);
            b = x0 + (x2 - x0) * (y - y0) / (y2 - y0);

            // update the color interpolation
            b_t = (y - y0) / (y2 - y0);
            a_t = (y - y1) / (y2 - y1);
            let color_b = Color.interpolate(color0, color2, b_t);

            let color_a = Color.interpolate(color1, color2, a_t);

            if (a > b) {
                [a, b] = [b, a];
                [color_a, color_b] = [color_b, color_a];
            }
            a = Math.ceil(a);
            b = Math.floor(b);
            GeometricProcessor.scanLineColor(a, b, y, color_a, color_b, frameBuffer);
        }
    }

    static getVector(dataBuffer: number[], index: number, stride: number, offset: number, size: number): number[] {
        let result: number[] = [];
        for (let i = 0; i < size; i++) {
            result.push(dataBuffer[index * stride + offset + i]);
        }
        return result;
    }

    /**
     * Draw an array of triangles defined by a data buffer.  each vertex is defined by 3 floats (x,y,z) and 3 floats for the color (r,g,b)
     * the triangles are defined by three sets of data in a row, this does not use indexBuffers
     * The z values are ignored for now.
     * @param dataBuffer
     * @param frameBuffer
     * @param width
     */
    static fillTriangles(dataBuffer: number[], numVertices: number, frameBuffer: FrameBuffer, drawBorder: boolean, borderColor: Color, activeData: ActiveData) {

        const numTriangles = numVertices / 3;
        for (let i = 0; i < numTriangles; i++) {
            let vertex1: VertexData = new VertexData();
            let vertex2: VertexData = new VertexData();
            let vertex3: VertexData = new VertexData();

            vertex1.position = GeometricProcessor.getVector(dataBuffer, i * 3, activeData.stride, activeData.vertexOffset, activeData.vertexSize);
            vertex2.position = GeometricProcessor.getVector(dataBuffer, i * 3 + 1, activeData.stride, activeData.vertexOffset, activeData.vertexSize);
            vertex3.position = GeometricProcessor.getVector(dataBuffer, i * 3 + 2, activeData.stride, activeData.vertexOffset, activeData.vertexSize);

            if (activeData.colorSize > 0) {
                let vColor1 = GeometricProcessor.getVector(dataBuffer, i * 3, activeData.stride, activeData.colorOffset, activeData.colorSize)
                vertex1.color = new Color(vColor1[0], vColor1[1], vColor1[2]);

                let vColor2 = GeometricProcessor.getVector(dataBuffer, i * 3 + 1, activeData.stride, activeData.colorOffset, activeData.colorSize)
                vertex2.color = new Color(vColor2[0], vColor2[1], vColor2[2]);

                let vColor3 = GeometricProcessor.getVector(dataBuffer, i * 3 + 2, activeData.stride, activeData.colorOffset, activeData.colorSize)
                vertex3.color = new Color(vColor3[0], vColor3[1], vColor3[2]);
            }

            if (activeData.normalSize > 0) {
                vertex1.normal = GeometricProcessor.getVector(dataBuffer, i * 3, activeData.stride, activeData.normalOffset, activeData.normalSize);
                vertex2.normal = GeometricProcessor.getVector(dataBuffer, i * 3 + 1, activeData.stride, activeData.normalOffset, activeData.normalSize);
                vertex3.normal = GeometricProcessor.getVector(dataBuffer, i * 3 + 2, activeData.stride, activeData.normalOffset, activeData.normalSize);
            }

            if (activeData.uvSize > 0) {
                vertex1.uv = GeometricProcessor.getVector(dataBuffer, i * 3, activeData.stride, activeData.uvOffset, activeData.uvSize);
                vertex2.uv = GeometricProcessor.getVector(dataBuffer, i * 3 + 1, activeData.stride, activeData.uvOffset, activeData.uvSize);
                vertex3.uv = GeometricProcessor.getVector(dataBuffer, i * 3 + 2, activeData.stride, activeData.uvOffset, activeData.uvSize);
            }

            GeometricProcessor.fillTriangleVertexData(vertex1, vertex2, vertex3, frameBuffer);


            if (drawBorder) {
                GeometricProcessor.drawLine(vertex1.position[0], vertex1.position[1], vertex2.position[0], vertex2.position[1], borderColor, frameBuffer);
                GeometricProcessor.drawLine(vertex1.position[0], vertex1.position[1], vertex3.position[0], vertex3.position[1], borderColor, frameBuffer);
                GeometricProcessor.drawLine(vertex2.position[0], vertex2.position[1], vertex3.position[0], vertex3.position[1], borderColor, frameBuffer);
            }
        }
    }

    /**
     * Draw an array of triangles defined by a data buffer.  each vertex is defined by 3 floats (x,y,z) and 3 floats for the color (r,g,b)
     * the triangles are defined by an array of indices three per triangle
     * The z values are ignored for now.
     * @param dataBuffer
     * @param frameBuffer
     * @param width
     */
    static fillTrianglesIndex(dataBuffer: number[], indexBuffer: number[], numTriangles: number, frameBuffer: FrameBuffer, drawBorder: boolean, borderColor: Color) {

        for (let i = 0; i < numTriangles; i++) {
            let index = i * 3;
            let index0 = indexBuffer[index];
            let index1 = indexBuffer[index + 1];
            let index2 = indexBuffer[index + 2];

            let vertex0 = [dataBuffer[index0 * 6], dataBuffer[index0 * 6 + 1], dataBuffer[index0 * 6 + 2]];
            let vertex1 = [dataBuffer[index1 * 6], dataBuffer[index1 * 6 + 1], dataBuffer[index1 * 6 + 2]];
            let vertex2 = [dataBuffer[index2 * 6], dataBuffer[index2 * 6 + 1], dataBuffer[index2 * 6 + 2]];

            let color0 = new Color(dataBuffer[index0 * 6 + 3], dataBuffer[index0 * 6 + 4], dataBuffer[index0 * 6 + 5]);
            let color1 = new Color(dataBuffer[index1 * 6 + 3], dataBuffer[index1 * 6 + 4], dataBuffer[index1 * 6 + 5]);
            let color2 = new Color(dataBuffer[index2 * 6 + 3], dataBuffer[index2 * 6 + 4], dataBuffer[index2 * 6 + 5]);

            GeometricProcessor.fillTriangleColor(vertex0[0], vertex0[1], vertex1[0], vertex1[1], vertex2[0], vertex2[1], color0, color1, color2, frameBuffer);

            if (drawBorder) {
                GeometricProcessor.drawLine(vertex0[0], vertex0[1], vertex1[0], vertex1[1], borderColor, frameBuffer);
                GeometricProcessor.drawLine(vertex0[0], vertex0[1], vertex2[0], vertex2[1], borderColor, frameBuffer);
                GeometricProcessor.drawLine(vertex1[0], vertex1[1], vertex2[0], vertex2[1], borderColor, frameBuffer);
            }
        }
    }


    static fillTriangleFan(dataBuffer: number[], numVertices: number, frameBuffer: FrameBuffer, drawBorder: boolean, borderColor: Color) {

        const numTriangles = numVertices - 2;

        const vertex0 = [dataBuffer[0], dataBuffer[1], dataBuffer[2]];
        const color0 = new Color(dataBuffer[3], dataBuffer[4], dataBuffer[5]);

        for (let i = 0; i < numTriangles; i++) {
            let index = (i + 1) * 6;

            let vertex1 = [dataBuffer[index], dataBuffer[index + 1], dataBuffer[index + 2]];
            let vertex2 = [dataBuffer[index + 6], dataBuffer[index + 7], dataBuffer[index + 8]];

            let color1 = new Color(dataBuffer[index + 3], dataBuffer[index + 4], dataBuffer[index + 5]);
            let color2 = new Color(dataBuffer[index + 9], dataBuffer[index + 10], dataBuffer[index + 11]);



            GeometricProcessor.fillTriangleColor(vertex0[0], vertex0[1], vertex1[0], vertex1[1], vertex2[0], vertex2[1], color0, color1, color2, frameBuffer);

            if (drawBorder) {
                GeometricProcessor.drawLine(vertex0[0], vertex0[1], vertex1[0], vertex1[1], borderColor, frameBuffer);
                GeometricProcessor.drawLine(vertex0[0], vertex0[1], vertex2[0], vertex2[1], borderColor, frameBuffer);
                GeometricProcessor.drawLine(vertex1[0], vertex1[1], vertex2[0], vertex2[1], borderColor, frameBuffer);
            }
        }
    }

    /**
     * 
     * @param dataBuffer fillTriangleStrip
     * @param frameBuffer 
     * @param drawBorder 
     * @param borderColor 
     */

    static fillTriangleStrip(dataBuffer: number[], numVertices: number, frameBuffer: FrameBuffer, drawBorder: boolean, borderColor: Color) {

        const numTriangles = numVertices - 2;

        // define the variables so we don not get undefined since there is an if in the loop.
        let vertex0 = [dataBuffer[0], dataBuffer[1], dataBuffer[2]];
        let vertex1 = vertex0;
        let vertex2 = vertex0;

        let color0 = new Color(dataBuffer[3], dataBuffer[4], dataBuffer[5]);
        let color1 = color0;
        let color2 = color0;

        for (let i = 0; i < numTriangles; i++) {
            let index = i * 6;
            let index0 = index;
            let index1 = index + 6;
            let index2 = index + 12;


            // for a triangle strip the alternating triangles are reversed so the winding order is correct
            // 0 1 2 is the order
            if (i % 2 === 1) {
                vertex0 = [dataBuffer[index0], dataBuffer[index0 + 1], dataBuffer[index0 + 2]];
                vertex1 = [dataBuffer[index1], dataBuffer[index1 + 1], dataBuffer[index1 + 2]];
                vertex2 = [dataBuffer[index2], dataBuffer[index2 + 1], dataBuffer[index2 + 2]];

                color0 = new Color(dataBuffer[index0 + 3], dataBuffer[index0 + 4], dataBuffer[index0 + 5]);
                color1 = new Color(dataBuffer[index1 + 3], dataBuffer[index1 + 4], dataBuffer[index1 + 5]);
                color2 = new Color(dataBuffer[index2 + 3], dataBuffer[index2 + 4], dataBuffer[index2 + 5]);
            } else { // 0 2 1 is the order
                vertex0 = [dataBuffer[index0], dataBuffer[index0 + 1], dataBuffer[index0 + 2]];
                vertex1 = [dataBuffer[index2], dataBuffer[index2 + 1], dataBuffer[index2 + 2]];
                vertex2 = [dataBuffer[index1], dataBuffer[index1 + 1], dataBuffer[index1 + 2]];

                color0 = new Color(dataBuffer[index0 + 3], dataBuffer[index0 + 4], dataBuffer[index0 + 5]);
                color1 = new Color(dataBuffer[index2 + 3], dataBuffer[index2 + 4], dataBuffer[index2 + 5]);
                color2 = new Color(dataBuffer[index1 + 3], dataBuffer[index1 + 4], dataBuffer[index1 + 5]);
            }




            GeometricProcessor.fillTriangleColor(vertex0[0], vertex0[1], vertex1[0], vertex1[1], vertex2[0], vertex2[1], color0, color1, color2, frameBuffer);
            if (drawBorder) {
                GeometricProcessor.drawLine(vertex0[0], vertex0[1], vertex1[0], vertex1[1], borderColor, frameBuffer);
                GeometricProcessor.drawLine(vertex0[0], vertex0[1], vertex2[0], vertex2[1], borderColor, frameBuffer);
                GeometricProcessor.drawLine(vertex1[0], vertex1[1], vertex2[0], vertex2[1], borderColor, frameBuffer);
            }



        }
    }
}



export default GeometricProcessor;