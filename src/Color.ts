/**
 * @module Color
 * @description
 * Color module.
 */

class Color {
    private r: number;
    private g: number;
    private b: number;


    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    toHex() {
        // Convert each component to a 2-digit hex string
        const rHex = this.r.toString(16).padStart(2, "0");
        const gHex = this.g.toString(16).padStart(2, "0");
        const bHex = this.b.toString(16).padStart(2, "0");

        // Combine the hex strings into a single string with a "#" prefix
        return `#${rHex}${gHex}${bHex}`;
    }
}

export default Color;