/**
 * @module Color
 * @description
 * Color module.
 */

class Color {
    r: number;
    g: number;
    b: number;
    a: number;


    constructor(r: number, g: number, b: number, a: number = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    toHex(length: number = 3) {
        const rInt = Math.round(this.r);
        const gInt = Math.round(this.g);
        const bInt = Math.round(this.b);
        const aInt = Math.round(this.a);

        // Convert each component to a 2-digit hex string
        const rHex = rInt.toString(16).padStart(2, "0");
        const gHex = gInt.toString(16).padStart(2, "0");
        const bHex = bInt.toString(16).padStart(2, "0");
        const aHex = aInt.toString(16).padStart(2, "0")

        // Combine the hex strings into a single string with a "#" prefix
        if (length === 4) {
            return `${rHex}${gHex}${bHex}${aHex}`
        }
        return `#${rHex}${gHex}${bHex}`;
    }

    toArray(): number[] {
        return [this.r, this.g, this.b, this.a];
    }

    static interpolate(color0: Color, color1: Color, t: number) {
        return new Color(

            color0.r + (color1.r - color0.r) * t,
            color0.g + (color1.g - color0.g) * t,
            color0.b + (color1.b - color0.b) * t,
            color0.a + (color1.a - color0.a) * t,
        );
    }

    // A function to interpolate 4 colours based on s and t

    static interpolate2d(color0: Color, color1: Color, color2: Color, color3: Color, s: number, t: number): Color {
        const leftColor = Color.interpolate(color0, color1, s);
        const rightColor = Color.interpolate(color3, color2, s);
        return Color.interpolate(leftColor, rightColor, t);
    }
}



export default Color;