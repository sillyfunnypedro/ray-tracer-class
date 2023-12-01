import Texture3D from "./Texture3D";
import { vec3 } from "gl-matrix";
import ShadeParameters from "../Geometry/ShadeParameters";

class Perlin extends Texture3D {

    private _grid: vec3[][][] = [];

    private _gridSize: number = 50;

    private _randomVectors: vec3[] = [];

    private _permutationX: number[] = [];
    private _permutationY: number[] = [];
    private _permutationZ: number[] = [];

    private _permutation: number[] = [];



    constructor() {
        super();
        this.textureName = "perlin";
        this.createGrid();
    }

    createGrid() {
        for (let x = 0; x < this._gridSize; x++) {
            this._grid[x] = [];
            for (let y = 0; y < this._gridSize; y++) {
                this._grid[x][y] = [];
                for (let z = 0; z < this._gridSize; z++) {
                    let randomGridPoint = vec3.create();
                    randomGridPoint[0] = Math.random() * 2 - 1;
                    randomGridPoint[1] = Math.random() * 2 - 1;
                    randomGridPoint[2] = Math.random() * 2 - 1;
                    this._grid[x][y][z] = randomGridPoint
                }
            }
        }
    }

    smoothStepInterpolate(a0: number, a1: number, w: number) {
        return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
    }

    getPerlinNoiseSingle(x: number, y: number, z: number): number {
        let x0 = Math.floor(x + 1000) % this._gridSize;
        let y0 = Math.floor(y + 1000) % this._gridSize;
        let z0 = Math.floor(z + 1000) % this._gridSize;

        let x1 = (x0 + 1) % this._gridSize;
        let y1 = (y0 + 1) % this._gridSize;
        let z1 = (z0 + 1) % this._gridSize;

        let p000 = this._grid[x0][y0][z0];
        let p100 = this._grid[x1][y0][z0];
        let p010 = this._grid[x0][y1][z0];
        let p110 = this._grid[x1][y1][z0];

        let p001 = this._grid[x0][y0][z1];
        let p101 = this._grid[x1][y0][z1];
        let p011 = this._grid[x0][y1][z1];
        let p111 = this._grid[x1][y1][z1];

        // calculate the distance vectors from the point to each grid point
        let dx = x - Math.floor(x);
        let dy = y - Math.floor(y);
        let dz = z - Math.floor(z);

        let d000 = vec3.fromValues(dx, dy, dz);
        let d100 = vec3.fromValues(dx - 1, dy, dz);
        let d010 = vec3.fromValues(dx, dy - 1, dz);
        let d110 = vec3.fromValues(dx - 1, dy - 1, dz);

        let d001 = vec3.fromValues(dx, dy, dz - 1);
        let d101 = vec3.fromValues(dx - 1, dy, dz - 1);
        let d011 = vec3.fromValues(dx, dy - 1, dz - 1);
        let d111 = vec3.fromValues(dx - 1, dy - 1, dz - 1);

        // interpolate betwee the dot products using the smoothstep function and the fractional part of the point coordinates
        // first do 4 x interpolations in the x direction
        let wx0 = this.smoothStepInterpolate(vec3.dot(p000, d000), vec3.dot(p100, d100), dx);
        let wx1 = this.smoothStepInterpolate(vec3.dot(p010, d010), vec3.dot(p110, d110), dx);

        let wx2 = this.smoothStepInterpolate(vec3.dot(p001, d001), vec3.dot(p101, d101), dx);
        let wx3 = this.smoothStepInterpolate(vec3.dot(p011, d011), vec3.dot(p111, d111), dx);

        // now interpolate in the y direction
        let wy0 = this.smoothStepInterpolate(wx0, wx1, dy);
        let wy1 = this.smoothStepInterpolate(wx2, wx3, dy);

        // now interpolate in the z direction
        let wz0 = this.smoothStepInterpolate(wy0, wy1, dz);
        if (wz0 > 1) {
            throw new Error("wz0 > 1");
        }
        return wz0;
    }



    getPerlinNoise(x: number, y: number, z: number, octaves: number): number {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;  // Used for normalizing result to 0.0 - 1.0
        for (let i = 0; i < octaves; i++) {
            total += this.getPerlinNoiseSingle(x * frequency, y * frequency, z * frequency) * amplitude;

            maxValue += amplitude;

            amplitude *= 0.5;
            frequency *= 2;
        }

        return total / maxValue;
    }








    evaluateTexture(shadeParameters: ShadeParameters): ShadeParameters {
        let point = shadeParameters.position;
        let perlin = this.getPerlinNoise(point[0], point[1], point[2], 5) * 4;
        shadeParameters.resultingColor = vec3.scale(vec3.create(), shadeParameters.color, perlin);

        return shadeParameters;
    }

}
export default Perlin;