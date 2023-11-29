import { vec3 } from 'gl-matrix';

class ThreeDTexture {
    textureName: string;
    static instance: ThreeDTexture | null = null;

    private constructor() {
        this.textureName = "";

    }

    static create(): ThreeDTexture {
        return new ThreeDTexture();
    }

    static getInstance(): ThreeDTexture {
        if (ThreeDTexture.instance === null) {
            ThreeDTexture.instance = ThreeDTexture.create();
        }
        return ThreeDTexture.instance;
    }

    evaluateTexture(name: string, point: vec3): vec3 {
        switch (name) {
            case "checkerboard":
                return this.checkerboard(point);
            default:
                return this.checkerboard(point);
        }
    }

    checkerboard(point: vec3): vec3 {
        let x = Math.round(point[0]);
        let y = Math.round(point[1]);
        let z = Math.round(point[2]);

        if ((x + y + z) % 2 === 0) {
            return vec3.fromValues(1, 0, 0);
        } else {
            return vec3.fromValues(1, 1, 1);
        }

    }



}

export default ThreeDTexture;   