export { };
import Color from "./Color";

describe("Color", () => {

    describe("toHex", () => {
        it("should return the correct hex string", () => {
            const color = new Color(255, 0, 0);
            expect(color.toHex()).toBe("#ff0000");
        });
    });
});