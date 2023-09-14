import Color from "./Color";
import FrameBuffer from "./FrameBuffer";
import GeometricProcessor from "./GeometricProcessor";

describe("GeometricProcessor", () => {
    describe("drawLine", () => {
        it("should draw a line from (0, 0) to (5, 5) with red color", () => {
            const fb = new FrameBuffer(10, 10);
            GeometricProcessor.drawLine(0, 0, 5, 5, new Color(255, 0, 0), fb);
            expect(fb.getPixel(0, 0).toHex()).toBe("#ff0000");
            expect(fb.getPixel(1, 1).toHex()).toBe("#ff0000");
            expect(fb.getPixel(2, 2).toHex()).toBe("#ff0000");
            expect(fb.getPixel(3, 3).toHex()).toBe("#ff0000");
            expect(fb.getPixel(4, 4).toHex()).toBe("#ff0000");
            expect(fb.getPixel(5, 5).toHex()).toBe("#ff0000");
        });
    });

    describe("fillTriangle", () => {
        it("should fill a triangle with red color and black border", () => {
            const fb = new FrameBuffer(4, 4);
            GeometricProcessor.fillTriangle(0, 0, 1, 3, 3, 1, new Color(255, 0, 0), new Color(255, 0, 0), fb);
            expect(fb.getPixel(0, 0).toHex()).toBe("#ff0000");
            expect(fb.getPixel(1, 1).toHex()).toBe("#ff0000")
        });
    });
});