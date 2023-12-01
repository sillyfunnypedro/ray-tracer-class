import Texture3D from "./Texture3D";
import { vec3 } from "gl-matrix";
import ShadeParameters from "../Geometry/ShadeParameters";

class MyTexture extends Texture3D {

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

    }


    computeMyTexture(x: number, y: number, z: number): number {
        let result = (Math.sin(x) / 2.0 + 0.5);
        result *= (Math.sin(y) / 2.0 + 0.5);
        result *= (Math.sin(z) / 2.0 + 0.5);
        return result;
    }

    evaluateTexture(shadeParameters: ShadeParameters): ShadeParameters {
        let point = shadeParameters.position;
        let result = this.computeMyTexture(point[0], point[1], point[2]);

        shadeParameters.resultingColor = vec3.copy(vec3.create(), shadeParameters.color);

        shadeParameters.resultingColor = vec3.fromValues(result, result, result);

        let normal = vec3.fromValues(0, 0, 0);
        normal[1] += Math.sin(point[1] * 10) * 0.01

        //shadeParameters.normal = vec3.normalize(normal, normal);


        return shadeParameters;
    }

}
export default MyTexture;