/**
 * 
 * The FrameBuffer class is used to create an array of pixels that can be set with the function setPixel(x, y, color:Color)
 * 
 * colors are between 0 and 1
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

    public realWidth(pixelSize: number): number {
        return this.width * pixelSize;
    }

    public realHeight(pixelSize: number): number {
        return this.height * pixelSize;
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

    clearZBuffer() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; i++) {
                this.zBuffer[i][j] = 0;
            }
        }
    }

    getImageData(pixelSize: number): Uint8ClampedArray {
        if (pixelSize === undefined || pixelSize === null || pixelSize < 1) {
            pixelSize = 1;
        }
        let data: Uint8ClampedArray = new Uint8ClampedArray(this.width * this.height * 4 * pixelSize * pixelSize);

        for (let i = 0; i < this.height; i++) {
            for (let k = 0; k < pixelSize; k++) {
                for (let j = 0; j < this.width; j++) {


                    for (let l = 0; l < pixelSize; l++) {
                        data[((i * pixelSize + k) * this.width + j) * 4 * pixelSize + l * 4] = this.pixels[i][j].r * 255;
                        data[((i * pixelSize + k) * this.width + j) * 4 * pixelSize + l * 4 + 1] = this.pixels[i][j].g * 255;
                        data[((i * pixelSize + k) * this.width + j) * 4 * pixelSize + l * 4 + 2] = this.pixels[i][j].b * 255;
                        data[((i * pixelSize + k) * this.width + j) * 4 * pixelSize + l * 4 + 3] = 255;
                    }
                }
            }
            // for (let j = 0; j < this.width; j++) {

            //     data[(i * this.width + j) * 4] = this.pixels[i][j].r;
            //     data[(i * this.width + j) * 4 + 1] = this.pixels[i][j].g;
            //     data[(i * this.width + j) * 4 + 2] = this.pixels[i][j].b;
            //     data[(i * this.width + j) * 4 + 3] = 255;
            // }
        }
        return data;
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
        // make the coordinates integers
        x = Math.round(x);
        y = Math.round(y);
        this.pixels[y][x].r = color.r;
        this.pixels[y][x].g = color.g;
        this.pixels[y][x].b = color.b;

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
        this.pixels[y][x].r = color.r;
        this.pixels[y][x].g = color.g;
        this.pixels[y][x].b = color.b;
    }

    getPixel(x: number, y: number): Color {
        let result = new Color(0, 0, 0);
        result.r = this.pixels[y][x].r;
        result.g = this.pixels[y][x].g;
        result.b = this.pixels[y][x].b;
        return this.pixels[y][x];
    }

    getFrameBuffer() {
        return this.pixels;
    }


}

export default FrameBuffer;