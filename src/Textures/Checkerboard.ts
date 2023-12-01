import Texture3D from "./Texture3D";
import { vec3 } from "gl-matrix";
import ShadeParameters from "../Geometry/ShadeParameters";

class Checkerboard extends Texture3D {

    constructor() {
        super();
        this.textureName = "checkerboard";
    }

    evaluateTexture(shadeParameters: ShadeParameters): ShadeParameters {
        let point = shadeParameters.position;
        let x = Math.round(point[0]);
        let y = Math.round(point[1]);
        let z = Math.round(point[2]);

        if ((x + y + z) % 2 === 0) {
            shadeParameters.resultingColor = shadeParameters.color;
        } else {
            shadeParameters.resultingColor = vec3.fromValues(1, 1, 1);
        }

        return shadeParameters;
    }

}
export default Checkerboard;