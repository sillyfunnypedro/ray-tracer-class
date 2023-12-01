import { vec3 } from "gl-matrix";
import { text } from "stream/consumers";
import ShadeParameters from "../Geometry/ShadeParameters";


abstract class Texture3D {
    textureName: string = "abstract";

    constructor() {

    }


    abstract evaluateTexture(shadeParameters: ShadeParameters): ShadeParameters;
}

export default Texture3D;

