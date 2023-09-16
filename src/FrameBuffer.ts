/**
 * 
 * The FrameBuffer class is used to create an array of pixels that can be set with the function setPixel(x, y, color:Color)
 */

import Color from "./Color";

class FrameBuffer {
    width: number;
    height: number;
    pixels: Color[][];
    zBuffer: number[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new Array(height);
        this.zBuffer = new Array(height);
        this.initPixels();
    }

    clear(r: number, g: number, b: number) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.pixels[i][j].r = r;
                this.pixels[i][j].g = g;
                this.pixels[i][j].b = b;
            }
        }
    }


    initPixels() {
        for (let i = 0; i < this.height; i++) {
            this.pixels[i] = new Array(this.width);
            this.zBuffer[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {

                this.pixels[i][j] = new Color(0, 0, 0);
                this.zBuffer[i][j] = 0;
            }
        }
    }

    setPixel(x: number, y: number, color: Color) {
        // clip the pixel to the screen
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        this.pixels[y][x] = color;

    }

    setPixelWithDepth(x: number, y: number, color: Color, depth: number) {
        // clip the pixel to the screen
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        if (depth > this.zBuffer[y][x]) {
            return;
        }
        this.zBuffer[y][x] = depth;
        this.pixels[y][x] = color;
    }

    getPixel(x: number, y: number): Color {
        return this.pixels[y][x];
    }

    getFrameBuffer() {
        return this.pixels;
    }


}

export default FrameBuffer;