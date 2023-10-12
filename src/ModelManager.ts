/**
 * @module Models
 * @description Models for the application
 * 
 * 
 */
import GeometricProcessor from "./GeometricProcessor";
import FrameBuffer from "./FrameBuffer";
import { GL } from "./MinimalGL";
import Color from "./Color";

export class Model {
    dataBuffer: number[];

    vertexSize: number = 0;
    vertexOffset: number = 0;

    colorLength: number = 0;
    colorOffset: number = 0;

    textureLength: number = 0;
    textureOffset: number = 0;

    normalLength: number = 0;
    normalOffset: number = 0;

    indexBuffer: number[];
    numVertices: number;

    stride: number = 0;


    constructor(vertices: number[] = [],
        vertexLength: number = 0,
        vertexOffset: number = 0,
        colorLength: number = 0,
        colorOffset: number = 0,
        textureLength: number = 0,
        textureOffset: number = 0,
        normalLength: number = 0,
        normalOffset: number = 0,
        indices: number[] = [],
        numVertices: number = 0,
        stride: number = 0
    ) {
        this.dataBuffer = vertices;
        this.vertexSize = vertexLength;
        this.vertexOffset = vertexOffset;
        this.colorOffset = colorOffset;
        this.colorLength = colorLength;
        this.textureLength = textureLength;
        this.textureOffset = textureOffset;
        this.normalLength = normalLength;
        this.normalOffset = normalOffset;
        this.indexBuffer = indices;
        this.numVertices = numVertices;
        this.stride = stride;
    }
    static emptyModel(): Model {
        return new Model();
    }
}


export class ModelManager {


    models: string[] = [
        "triangleStrip",
        "triangleFan",
        "meshIndex",
        "triangleMesh",
        "triangleMesh2d",
        "triangleTexture",
        "quadTexture"
    ];


    constructor() {




    }

    getModels(): string[] {
        return this.models;
    }

    getModel(model: string, width: number, height: number): Model {
        switch (model) {
            case "triangleStrip":
                return this.generateTriangleStrip();
            case "triangleFan":
                return this.generateTriangleFan();
            case "triangleMesh":
                return this.generateTriangles();
            case "triangleMesh2d":
                return this.generateTriangles2d();
            case "meshIndex":
                return this.generateTrianglesIndex();
            case "triangleTexture":
                return this.triangleTexture();
            case "quadTexture":
                return this.quadTexture();
            default:
                return Model.emptyModel()
        }

    }

    /**
     * generateTriangleStrip
     * @param frame
     * @param drawBorder
     * @param borderColor
     * 
     * Draw a triangle strip to test the drawTriangleStrip function
     * The colors of the outside vertices alternate between color0, color1 and color2
     * The triangles make up a torus centered at the center of the frame buffer
     * The inner radius of the torus is defined by the variable innerRadius
     * The outer radius of the torus is defined by the variable outerRadius
     * see https://en.wikipedia.org/wiki/Triangle_strip
     */
    private generateTriangleStrip(): Model {
        const x = 0;
        const y = 0;

        const innerRadius = 0.2;
        const outerRadius = 0.6;

        let numSegments = 18; // each segment has two triangles
        const colors: Color[] = [
            new Color(255, 0, 0),
            new Color(0, 255, 0),
            new Color(0, 0, 255)
        ];


        const dataBuffer: number[] = [];

        const angleStep = 2 * Math.PI / numSegments;




        for (let i = 0; i < numSegments; i++) {
            const currAngle = -i * angleStep;
            const nextAngle = -(i + 1) * angleStep;

            const x0 = x + innerRadius * Math.cos(currAngle);
            const y0 = y + innerRadius * Math.sin(currAngle);
            const x1 = x + outerRadius * Math.cos(currAngle);
            const y1 = y + outerRadius * Math.sin(currAngle);
            const x2 = x + innerRadius * Math.cos(nextAngle);
            const y2 = y + innerRadius * Math.sin(nextAngle);
            const x3 = x + outerRadius * Math.cos(nextAngle);
            const y3 = y + outerRadius * Math.sin(nextAngle);

            if (i == 0) {

                dataBuffer.push(x0);
                dataBuffer.push(y0);
                dataBuffer.push(0);
                dataBuffer.push(Math.floor(colors[i % 3].r));
                dataBuffer.push(Math.floor(colors[i % 3].g));
                dataBuffer.push(Math.floor(colors[i % 3].b));

                dataBuffer.push(x1);
                dataBuffer.push(y1);
                dataBuffer.push(0);
                dataBuffer.push(Math.floor(colors[(i + 2) % 3].r));
                dataBuffer.push(Math.floor(colors[(i + 2) % 3].g));
                dataBuffer.push(Math.floor(colors[(i + 2) % 3].b));
            }
            dataBuffer.push(x2);
            dataBuffer.push(y2);
            dataBuffer.push(0);
            dataBuffer.push(Math.floor(colors[(i + 1) % 3].r));
            dataBuffer.push(Math.floor(colors[(i + 1) % 3].g));
            dataBuffer.push(Math.floor(colors[(i + 1) % 3].b));

            dataBuffer.push(x3);
            dataBuffer.push(y3);
            dataBuffer.push(0);
            dataBuffer.push(Math.floor(colors[i % 3].r));
            dataBuffer.push(Math.floor(colors[i % 3].g));
            dataBuffer.push(Math.floor(colors[i % 3].b));

        }


        let result: Model = new Model();
        result.dataBuffer = dataBuffer;
        result.vertexSize = 3;
        result.vertexOffset = 0;
        result.colorLength = 3;
        result.colorOffset = 3;
        result.numVertices = numSegments * 2 + 2;
        result.stride = 6


        return result;
    }



    /**
     * generateTriangleFan
     * @param frame
     * @param drawBorder 
     * @param borderColor 
     * 
     * Draw a triangle fan to test the drawTriangleFan function
     * The colors of the outside vertices alternate between color1 and color2
     */
    private generateTriangleFan(): Model {
        const x = -0.9;
        const y = -0.9;
        const r = 1.2;
        const numTriangles = 5;
        const color0 = new Color(255, 0, 0);
        const color1 = new Color(0, 255, 0);
        const color2 = new Color(0, 0, 255);


        const dataBuffer: number[] = [];


        dataBuffer.push(x);
        dataBuffer.push(y);
        dataBuffer.push(0);

        dataBuffer.push(Math.floor(color0.r));
        dataBuffer.push(Math.floor(color0.g));
        dataBuffer.push(Math.floor(color0.b));

        for (let i = 0; i < numTriangles + 1; i++) {
            const s = i / numTriangles;
            const t = 0;
            let color = color1;
            if (i % 2 === 0) {
                color = color2;
            }
            const angle = s * Math.PI / 2;
            const x1 = x + r * Math.cos(angle);
            const y1 = y + r * Math.sin(angle);
            dataBuffer.push(x1);
            dataBuffer.push(y1);
            dataBuffer.push(0);
            dataBuffer.push(Math.floor(color.r));
            dataBuffer.push(Math.floor(color.g));
            dataBuffer.push(Math.floor(color.b));
        }

        let result: Model = new Model();
        result.dataBuffer = dataBuffer;
        result.vertexSize = 3;
        result.vertexOffset = 0;
        result.colorLength = 3;
        result.colorOffset = 3;
        result.numVertices = numTriangles + 2
        result.stride = 6


        return result;

    }





    /**
     * Draw a mesh to test the drawTriangles function
     * @param frame 
     */
    private generateTrianglesIndex(): Model {
        // you can change the constants here to change the look of the mesh
        const x = -0.7;
        const y = -0.7;
        const w = 1;
        const h = 1;
        const x_steps = 20;
        const y_steps = 20;
        const x_step = w / x_steps;
        const y_step = h / y_steps;
        const color0 = new Color(255, 0, 0);
        const color1 = new Color(255, 0, 0);
        const color2 = new Color(0, 0, 255);
        const color3 = new Color(0, 0, 255);

        const dataBuffer: number[] = [];
        let num_vertices = 0;
        for (let i = 0; i < x_steps + 1; i++) {
            for (let j = 0; j < y_steps + 1; j++) {
                const s = i / x_steps;
                const t = j / y_steps;
                const color = Color.interpolate2d(color0, color1, color2, color3, s, t);
                dataBuffer.push(x + i * x_step);
                dataBuffer.push(y + j * y_step);
                dataBuffer.push(0);
                dataBuffer.push(Math.floor(color.r));
                dataBuffer.push(Math.floor(color.g));
                dataBuffer.push(Math.floor(color.b));
                num_vertices += 1;
            }
        }

        const indexBuffer: number[] = [];
        let numTriangles = 0;

        for (let i = 0; i < x_steps; i++) {
            for (let j = 0; j < y_steps; j++) {
                indexBuffer.push(i * (y_steps + 1) + j);
                indexBuffer.push((i + 1) * (y_steps + 1) + j);
                indexBuffer.push(i * (y_steps + 1) + j + 1);

                indexBuffer.push(i * (y_steps + 1) + j + 1);
                indexBuffer.push((i + 1) * (y_steps + 1) + j);
                indexBuffer.push((i + 1) * (y_steps + 1) + j + 1);
                numTriangles += 2;
            }
        }

        let result: Model = new Model();
        result.dataBuffer = dataBuffer;
        result.indexBuffer = indexBuffer;
        result.vertexSize = 3;
        result.vertexOffset = 0;
        result.colorLength = 3;
        result.colorOffset = 3;
        result.numVertices = numTriangles + 2
        result.stride = 6

        return result;

    }

    /**
     * Draw a mesh to test the drawTriangles function
     * @param frame 
     */
    private generateTriangles(): Model {
        // you can change the constants here to change the look of the mesh
        const x = -0.9;
        const y = -0.9;
        const w = 1.8;
        const h = 1.8;
        const x_steps = 1;
        const y_steps = 1;
        const x_step = w / x_steps;
        const y_step = h / y_steps;
        const color0 = new Color(255, 0, 0);
        const color1 = new Color(0, 255, 0);
        const color2 = new Color(0, 0, 255);
        const color3 = new Color(255, 255, 0);

        const tmpVertices: number[] = [];
        let numVertices = 0;
        let dataBuffer: number[] = [];
        for (let i = 0; i < x_steps + 1; i++) {
            for (let j = 0; j < y_steps + 1; j++) {
                const s = i / x_steps;
                const t = j / y_steps;
                const color = Color.interpolate2d(color0, color1, color2, color3, s, t);
                tmpVertices.push(x + i * x_step);
                tmpVertices.push(y + j * y_step);
                tmpVertices.push(0);
                tmpVertices.push(Math.floor(color.r));
                tmpVertices.push(Math.floor(color.g));
                tmpVertices.push(Math.floor(color.b));
                numVertices += 1;
            }
        }

        const indices: number[] = [];
        let numTriangles = 0;


        // use the same scheme to generate the triangles as in the generateTrianglesIndex function

        function pushVertex(index: number) {
            index *= 6;
            dataBuffer.push(tmpVertices[index]);  // x
            dataBuffer.push(tmpVertices[index + 1]); //y
            dataBuffer.push(tmpVertices[index + 2]); //z
            dataBuffer.push(tmpVertices[index + 3]); //r
            dataBuffer.push(tmpVertices[index + 4]); //g
            dataBuffer.push(tmpVertices[index + 5]); //b
        }

        for (let i = 0; i < x_steps; i++) {
            for (let j = 0; j < y_steps; j++) {
                // Need to generate two triangles here
                // Triangle 1
                //indices.push(i * (y_steps + 1) + j);
                let vertexIndex = i * (y_steps + 1) + j;
                pushVertex(vertexIndex);



                //indices.push((i + 1) * (y_steps + 1) + j);
                vertexIndex = (i + 1) * (y_steps + 1) + j;
                pushVertex(vertexIndex);

                //indices.push(i * (y_steps + 1) + j + 1);
                vertexIndex = i * (y_steps + 1) + j + 1;
                pushVertex(vertexIndex);


                //indices.push(i * (y_steps + 1) + j + 1);
                vertexIndex = i * (y_steps + 1) + j + 1;
                pushVertex(vertexIndex);



                //indices.push((i + 1) * (y_steps + 1) + j);
                vertexIndex = (i + 1) * (y_steps + 1) + j;
                pushVertex(vertexIndex);

                //indices.push((i + 1) * (y_steps + 1) + j + 1);
                vertexIndex = (i + 1) * (y_steps + 1) + j + 1;
                pushVertex(vertexIndex);

                numTriangles += 2;
            }
        }
        let result: Model = new Model();
        result.dataBuffer = dataBuffer;
        result.vertexSize = 3;
        result.vertexOffset = 0;
        result.colorLength = 3;
        result.colorOffset = 3;
        result.numVertices = numTriangles * 3;
        result.stride = 6

        return result;
    }

    /**
     * Draw a mesh to test the drawTriangles function
     * @param frame 
     */
    private generateTriangles2d(): Model {
        // you can change the constants here to change the look of the mesh
        const x = -0.9;
        const y = -0.9;
        const w = 1.8;
        const h = 1.8;
        const x_steps = 1;
        const y_steps = 1;
        const x_step = w / x_steps;
        const y_step = h / y_steps;
        const color0 = new Color(255, 0, 0);
        const color1 = new Color(0, 255, 0);
        const color2 = new Color(0, 0, 255);
        const color3 = new Color(255, 255, 0);

        const tmpVertices: number[] = [];
        let numVertices = 0;
        let dataBuffer: number[] = [];
        for (let i = 0; i < x_steps + 1; i++) {
            for (let j = 0; j < y_steps + 1; j++) {
                const s = i / x_steps;
                const t = j / y_steps;
                const color = Color.interpolate2d(color0, color1, color2, color3, s, t);
                tmpVertices.push(x + i * x_step);
                tmpVertices.push(y + j * y_step);
                tmpVertices.push(Math.floor(color.r));
                tmpVertices.push(Math.floor(color.g));
                tmpVertices.push(Math.floor(color.b));
                numVertices += 1;
            }
        }

        const indices: number[] = [];
        let numTriangles = 0;


        // use the same scheme to generate the triangles as in the generateTrianglesIndex function

        function pushVertex(index: number) {
            index *= 5;
            dataBuffer.push(tmpVertices[index]);  // x
            dataBuffer.push(tmpVertices[index + 1]); //y
            dataBuffer.push(tmpVertices[index + 2]); //r
            dataBuffer.push(tmpVertices[index + 3]); //g
            dataBuffer.push(tmpVertices[index + 4]); //b
        }

        for (let i = 0; i < x_steps; i++) {
            for (let j = 0; j < y_steps; j++) {
                // Need to generate two triangles here
                // Triangle 1
                //indices.push(i * (y_steps + 1) + j);
                let vertexIndex = i * (y_steps + 1) + j;
                pushVertex(vertexIndex);

                //indices.push((i + 1) * (y_steps + 1) + j);
                vertexIndex = (i + 1) * (y_steps + 1) + j;
                pushVertex(vertexIndex);

                //indices.push(i * (y_steps + 1) + j + 1);
                vertexIndex = i * (y_steps + 1) + j + 1;
                pushVertex(vertexIndex);


                //indices.push(i * (y_steps + 1) + j + 1);
                vertexIndex = i * (y_steps + 1) + j + 1;
                pushVertex(vertexIndex);



                //indices.push((i + 1) * (y_steps + 1) + j);
                vertexIndex = (i + 1) * (y_steps + 1) + j;
                pushVertex(vertexIndex);

                //indices.push((i + 1) * (y_steps + 1) + j + 1);
                vertexIndex = (i + 1) * (y_steps + 1) + j + 1;
                pushVertex(vertexIndex);

                numTriangles += 2;
            }
        }
        let result: Model = new Model();
        result.dataBuffer = dataBuffer;
        result.vertexSize = 2;
        result.vertexOffset = 0;
        result.colorLength = 3;
        result.colorOffset = 2;
        result.numVertices = numTriangles * 3;
        result.stride = 5;

        return result;
    }

    private triangleTexture(): Model {
        // this triangle is used to show how UV mapping works
        // three points each with x, y, z, u, v

        const topOffset = 0.5; // for playing with in class
        const dataBuffer: number[] = [
            -0.0, 0.8, 0, topOffset, 1,
            -0.8, -0.8, 0, 0, 0,
            0.8, -0.8, 0, 1, 0,

        ];
        const scaleUV = 0.5;
        for (let i = 0; i < dataBuffer.length; i++) {
            if (i % 5 === 3) {
                dataBuffer[i] *= scaleUV;
            }
            if (i % 5 === 4) {
                dataBuffer[i] *= scaleUV;
            }
        }
        let result: Model = new Model();
        result.dataBuffer = dataBuffer;
        result.vertexSize = 3;
        result.vertexOffset = 0;
        result.textureLength = 2;
        result.textureOffset = 3;
        result.numVertices = 3;
        result.stride = 5
        return result;
    }

    private quadTexture(): Model {
        // this triangle is used to show how UV mapping works
        // three points each with x, y, z, u, v

        const weirdCorner = 0.8; // for playing with in class
        const dataBuffer: number[] = [
            -0.8, 0.8, 0, 0, 1,
            -0.8, -0.8, 0, 0, 0,
            0.8, -0.8, 0, 1, 0,
            -0.8, 0.8, 0, 0, 1,
            0.8, -0.8, 0, 1, 0,
            weirdCorner, weirdCorner, 0, 1, 1
        ];
        const scaleUV = 1;
        for (let i = 0; i < dataBuffer.length; i++) {
            if (i % 5 === 3) {
                dataBuffer[i] *= scaleUV;
            }
            if (i % 5 === 4) {
                dataBuffer[i] *= scaleUV;
            }
        }
        let result: Model = new Model();
        result.dataBuffer = dataBuffer;
        result.vertexSize = 3;
        result.vertexOffset = 0;
        result.textureLength = 2;
        result.textureOffset = 3;
        result.numVertices = 6;
        result.stride = 5
        return result;
    }
}






