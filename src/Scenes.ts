/**
 * @module Scenes
 */


import Scene from './Geometry/Scene';
import Shape from './Geometry/Shape';
import Light from './Geometry/Light';
import Sphere from './Geometry/Sphere';
import Camera from './Camera';
import { vec3 } from 'gl-matrix';


class Scenes {
    /**
     * Scenes
     */
    static scenes: Map<string, Scene> = new Map<string, Scene>();

    /**
     * Current scene
     */
    static currentScene: string = '';


    static addScene(name: string, scene: Scene): void {
        Scenes.scenes.set(name, scene);
    }

    static getScenes(): string[] {
        return Array.from(Scenes.scenes.keys());
    }

    static getScene(name: string): Scene {
        return Scenes.scenes.get(name) as Scene;
    }
}

export default Scenes;


function createScenes() {
    let sphereScene = new Scene();
    sphereScene.backgroundColor = vec3.fromValues(0.5, 0.5, 0.5);

    let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
    //sphere.scale(vec3.fromValues(1, .3, 1));
    sphere.color = vec3.fromValues(1, 1, 1);
    sphere.ambient = 0.1;
    sphere.diffuse = 0.7;
    sphere.specular = 0.2;
    sphere.shininess = 100;
    sphere.reflectivity = 0.5;

    sphereScene.shapes.push(sphere);

    let light = new Light();
    light.position = vec3.fromValues(0, 10, 0);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 0, 0);

    sphereScene.lights.push(light);


    Scenes.addScene('sphere', sphereScene);

}

createScenes();

