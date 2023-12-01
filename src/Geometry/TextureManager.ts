import { vec3 } from 'gl-matrix';
import Intersection from './Intersection';
import Shape from './Shape';
import ShadeParameters from './ShadeParameters';
import Texture3D from '../Textures/Texture3D';
import Checkerboard from '../Textures/Checkerboard';
import CheckerboardReflect from '../Textures/CheckerboardReflect';
import Perlin from '../Textures/Perlin';
import MyTexture from '../Textures/MyTexture';

class ThreeDTexture {
    textureName: string;

    textureEngines = new Map<string, Texture3D>()
    static instance: ThreeDTexture | null = null;

    private constructor() {
        this.textureName = "";
        this.startTheEngines();

    }

    private startTheEngines() {
        this.textureEngines.set("checkerboard", new Checkerboard());
        this.textureEngines.set("checkerboardreflect", new CheckerboardReflect());
        this.textureEngines.set("perlin", new Perlin());
        this.textureEngines.set("mytexture", new MyTexture());

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

    evaluateTexture(name: string, shadeParameters: ShadeParameters): ShadeParameters {
        let textureEngine = this.textureEngines.get(name);
        let color = vec3.create();
        let resultingShadeParameters = new ShadeParameters(shadeParameters);

        if (textureEngine === undefined) {
            throw new Error(` looking for texture ${name} but it is not defined`);
        }

        resultingShadeParameters = textureEngine.evaluateTexture(shadeParameters);
        return resultingShadeParameters;
    }







}

export default ThreeDTexture;   