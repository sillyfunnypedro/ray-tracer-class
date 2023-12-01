import { vec3 } from "gl-matrix";

class ShadeParameters {
    resultingColor: vec3 = vec3.create();
    color: vec3 = vec3.create();
    ambient: number = 0;
    diffuse: number = 0;
    specular: number = 0;
    shininess: number = 0;
    reflectivity: number = 0;
    refractivity: number = 0;
    refractiveIndex: number = 0;
    position: vec3 = vec3.create();
    normal: vec3 = vec3.create();

    // elements added for Texture Mapping

    uv: vec3 = vec3.create();
    uvw: vec3 = vec3.create();

    constructor(copy?: ShadeParameters) {
        if (copy) {
            this.copy(copy);
        }
    }


    copy(shadeParameters: ShadeParameters): ShadeParameters {
        this.resultingColor = vec3.copy(vec3.create(), shadeParameters.resultingColor);
        this.color = vec3.copy(vec3.create(), shadeParameters.color);
        this.ambient = shadeParameters.ambient;
        this.diffuse = shadeParameters.diffuse;
        this.specular = shadeParameters.specular;
        this.shininess = shadeParameters.shininess;
        this.reflectivity = shadeParameters.reflectivity;
        this.refractivity = shadeParameters.refractivity;
        this.refractiveIndex = shadeParameters.refractiveIndex;
        this.position = vec3.copy(vec3.create(), shadeParameters.position);
        this.normal = vec3.copy(vec3.create(), shadeParameters.normal);
        this.uv = vec3.copy(vec3.create(), shadeParameters.uv);
        this.uvw = vec3.copy(vec3.create(), shadeParameters.uvw);
        return this;
    }
}

export default ShadeParameters;