/**
 * 
 * The FrameBuffer class is used to create an array of pixels that can be set with the function setPixel(x, y, color:Color)
 */

import Color from "./Color";

class FrameBuffer {
    width: number;
    height: number;
    pixels: Color[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new Array(height);
        this.initPixels();
    }

    initPixels() {
        for (let i = 0; i < this.height; i++) {
            this.pixels[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {

                this.pixels[i][j] = new Color(23, 128, 44);
            }
        }
    }

    setPixel(x: number, y: number, color: Color) {
        this.pixels[y][x] = color;

    }

    getFrameBuffer() {
        return this.pixels;
    }


}

export default FrameBuffer;