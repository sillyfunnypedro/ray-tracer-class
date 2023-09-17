/**
 * @module Models
 * @description Models for the application
 * 
 * 
 */
import GeometricProcessor from "./GeometricProcessor";
import FrameBuffer from "./FrameBuffer";
import Color from "./Color";


class Models {

    /** 
     * A map of strings to functions that take a frame buffer and draw a model
     * 
     */
    models = new Map<string, (frame: FrameBuffer, drawBorder: boolean, borderColor: Color) => void>();

    constructor() {
        this.models.set("mesh", this.drawMesh);
    }

    listOfModels(): string[] {
        return Array.from(this.models.keys());
    }

    drawModel(model: string, frame: FrameBuffer, drawBorder: boolean = false, borderColor: Color = new Color(0, 0, 0)): void {
        const drawFunction = this.models.get(model);
        if (drawFunction) {
            drawFunction(frame, drawBorder, borderColor);
        }
    }



    /**
     * Draw a mesh to test the drawTriangles function
     * @param frame 
     */
    private drawMesh(frame: FrameBuffer, drawBorder: boolean, borderColor: Color): void {
        // you can change the constants here to change the look of the mesh
        const x = 10;
        const y = 10;
        const w = 180;
        const h = 100;
        const x_steps = 10;
        const y_steps = 5;
        const x_step = w / x_steps;
        const y_step = h / y_steps;
        const color0 = new Color(255, 0, 0);
        const color1 = new Color(0, 255, 0);
        const color2 = new Color(0, 0, 255);
        const color3 = new Color(255, 255, 0);

        const vertices: number[] = [];
        let num_vertices = 0;
        for (let i = 0; i < x_steps + 1; i++) {
            for (let j = 0; j < y_steps + 1; j++) {
                const s = i / x_steps;
                const t = j / y_steps;
                const color = Color.interpolate2d(color0, color1, color2, color3, s, t);
                vertices.push(x + i * x_step);
                vertices.push(y + j * y_step);
                vertices.push(0);
                vertices.push(Math.floor(color.r));
                vertices.push(Math.floor(color.g));
                vertices.push(Math.floor(color.b));
                num_vertices += 1;
            }
        }

        const indices: number[] = [];
        let numTriangles = 0;

        for (let i = 0; i < x_steps; i++) {
            for (let j = 0; j < y_steps; j++) {
                indices.push(i * (y_steps + 1) + j);
                indices.push(i * (y_steps + 1) + j + 1);
                indices.push((i + 1) * (y_steps + 1) + j);
                indices.push(i * (y_steps + 1) + j + 1);
                indices.push((i + 1) * (y_steps + 1) + j + 1);
                indices.push((i + 1) * (y_steps + 1) + j);
                numTriangles += 2;
            }
        }

        GeometricProcessor.fillTriangles(vertices, indices, numTriangles, frame, drawBorder, borderColor);
    }
}

export default Models;
