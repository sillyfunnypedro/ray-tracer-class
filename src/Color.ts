/**
 * @module Color
 * @description
 * Color module.
 */

class Color {
    r: number;
    g: number;
    b: number;


    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    toHex() {
        const rInt = Math.round(this.r);
        const gInt = Math.round(this.g);
        const bInt = Math.round(this.b);

        // Convert each component to a 2-digit hex string
        const rHex = rInt.toString(16).padStart(2, "0");
        const gHex = gInt.toString(16).padStart(2, "0");
        const bHex = bInt.toString(16).padStart(2, "0");

        // Combine the hex strings into a single string with a "#" prefix
        return `#${rHex}${gHex}${bHex}`;
    }

    static interpolate(color0: Color, color1: Color, t: number) {
        return new Color(

            color0.r + (color1.r - color0.r) * t,
            color0.g + (color1.g - color0.g) * t,
            color0.b + (color1.b - color0.b) * t
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