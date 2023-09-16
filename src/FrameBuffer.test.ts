import FrameBuffer from "./FrameBuffer";
import Color from "./Color";

describe("FrameBuffer", () => {
    describe("constructor", () => {
        it("should create a new FrameBuffer with the given dimensions", () => {
            const width = 10;
            const height = 20;
            const fb = new FrameBuffer(width, height);

            expect(fb.getFrameBuffer().length).toBe(height);
            expect(fb.getFrameBuffer()[0].length).toBe(width);
        });
    });

    describe("setPixel", () => {
        it("should set the color of the pixel at the given coordinates", () => {
            const fb = new FrameBuffer(3, 3);
            const color = new Color(255, 0, 0);

            fb.setPixel(1, 1, color);
            expect(fb.getFrameBuffer()[1][1]).toEqual(color);
        });
    });
    it("should not set the color of a pixel outside the screen bounds", () => {
        const fb = new FrameBuffer(3, 3);
        const color = new Color(255, 0, 0);

        fb.setPixel(-1, 1, color);
        fb.setPixel(1, -1, color);
        fb.setPixel(3, 1, color);
        fb.setPixel(1, 3, color);

        expect(fb.getFrameBuffer()[0][1]).not.toEqual(color);
        expect(fb.getFrameBuffer()[1][0]).not.toEqual(color);
        expect(fb.getFrameBuffer()[1][2]).not.toEqual(color);
        expect(fb.getFrameBuffer()[2][1]).not.toEqual(color);
    });

    // With depth testing

    it("should set the color of the pixel at the given coordinates", () => {
        const fb = new FrameBuffer(3, 3);
        const color = new Color(255, 0, 0);

        fb.setPixelWithDepth(1, 1, color, 0);
        expect(fb.getFrameBuffer()[1][1]).toEqual(color);
    });

    it("should not set the color of a pixel outside the screen bounds", () => {
        const fb = new FrameBuffer(3, 3);
        const color = new Color(255, 0, 0);

        fb.setPixelWithDepth(-1, 1, color, 0);
        fb.setPixelWithDepth(1, -1, color, 0);
        fb.setPixelWithDepth(3, 1, color, 0);
        fb.setPixelWithDepth(1, 3, color, 0);

        expect(fb.getFrameBuffer()[0][1]).not.toEqual(color);
        expect(fb.getFrameBuffer()[1][0]).not.toEqual(color);
        expect(fb.getFrameBuffer()[1][2]).not.toEqual(color);
        expect(fb.getFrameBuffer()[2][1]).not.toEqual(color);
    });

    it("should not set the color of a pixel with a greater depth value", () => {
        const fb = new FrameBuffer(3, 3);
        const color1 = new Color(255, 0, 0);
        const color2 = new Color(0, 255, 0);

        fb.setPixelWithDepth(1, 1, color1, 0);
        fb.setPixelWithDepth(1, 1, color2, 1);

        expect(fb.getFrameBuffer()[1][1]).toEqual(color1);
    });
});