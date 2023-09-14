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
});