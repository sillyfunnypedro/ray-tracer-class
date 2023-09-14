import Color from "./Color";
import FrameBuffer from "./FrameBuffer";

class GeometricProcessor {
    // draw a line using breseham algorithm

    static drawLine(x0: number, y0: number, x1: number, y1: number, color: Color, frameBuffer: FrameBuffer) {
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            frameBuffer.setPixel(x0, y0, color);
            if ((x0 == x1) && (y0 == y1)) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    static fillRect(x: number, y: number, width: number, height: number, color: Color, frameBuffer: FrameBuffer) {

        for (let j = y; j < y + height; j++) {
            GeometricProcessor.drawLine(x, j, x + width, j, color, frameBuffer);
        }

    }

    static fillTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, borderColor: Color, color: Color, frameBuffer: FrameBuffer) {


        let a, b, y, last;

        //Sort coordinates by Y order(y2 >= y1 >= y0)
        if (y0 > y1) {
            [y0, y1] = [y1, y0];
            [x0, x1] = [x1, x0];
        }
        if (y1 > y2) {
            [y2, y1] = [y1, y2];
            [x2, x1] = [x1, x2];
        }
        if (y0 > y1) {
            [y0, y1] = [y1, y0];
            [x0, x1] = [x1, x0];
        }

        if (y0 == y2) { // Handle awkward all-on-same-line case as its own thing
            a = b = x0;
            if (x1 < a) a = x1;
            else if (x1 > b) b = x1;
            if (x2 < a) a = x2;
            else if (x2 > b) b = x2;
            GeometricProcessor.drawLine(a, y0, b, y0, color, frameBuffer);
            return;

        }

        let dx01 = x1 - x0,
            dy01 = y1 - y0,
            dx02 = x2 - x0,
            dy02 = y2 - y0,
            dx12 = x2 - x1,
            dy12 = y2 - y1,
            sa = 0,
            sb = 0;

        // // For upper part of triangle, find scanline crossings for segments
        // // 0-1 and 0-2.  If y1=y2 (flat-bottomed triangle), the scanline y1
        // // is included here (and second loop will be skipped, avoiding a /0
        // // error there), otherwise scanline y1 is skipped here and handled
        // // in the second loop...which also avoids a /0 error here if y0=y1
        // // (flat-topped triangle).
        if (y1 == y2) last = y1;   // Include y1 scanline
        else last = y1 - 1; // Skip it

        for (y = y0; y <= last; y++) {
            a = x0 + sa / dy01;
            b = x0 + sb / dy02;
            sa += dx01;
            sb += dx02;

            a = x0 + (x1 - x0) * (y - y0) / (y1 - y0);
            b = x0 + (x2 - x0) * (y - y0) / (y2 - y0);

            if (a > b) [a, b] = [b, a];
            // shift a to the next integer, and b to the integer that preceeds it
            a = Math.ceil(a);
            b = Math.floor(b);
            GeometricProcessor.drawLine(a, y, b, y, color, frameBuffer);
        }

        // For lower part of triangle, find scanline crossings for segments
        // 0-2 and 1-2.  This loop is skipped if y1=y2.
        sa = dx12 * (y - y1);
        sb = dx02 * (y - y0);
        for (; y <= y2; y++) {
            a = x1 + sa / dy12;
            b = x0 + sb / dy02;
            sa += dx12;
            sb += dx02;
            /* longhand:
            a = x1 + (x2 - x1) * (y - y1) / (y2 - y1);
            b = x0 + (x2 - x0) * (y - y0) / (y2 - y0);
            */
            if (a > b) [a, b] = [b, a];
            a = Math.ceil(a);
            b = Math.floor(b);
            GeometricProcessor.drawLine(a, y, b, y, color, frameBuffer);
        }

        // now draw the lines of the triangle in border color

        GeometricProcessor.drawLine(x0, y0, x1, y1, borderColor, frameBuffer);
        GeometricProcessor.drawLine(x0, y0, x2, y2, borderColor, frameBuffer);
        GeometricProcessor.drawLine(x1, y1, x2, y2, borderColor, frameBuffer);



    }

}



export default GeometricProcessor;