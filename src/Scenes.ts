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


function createSphere() {
    let sphereScene = new Scene();
    sphereScene.backgroundColor = vec3.fromValues(0.5, 0.5, 0.5);

    let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
    sphere.translate(vec3.fromValues(0, 0, 0));
    //sphere.scale(vec3.fromValues(10,10,10));
    sphere.color = vec3.fromValues(1, 1, 1);
    sphere.ambient = 0.2;
    sphere.diffuse = 0.4;
    sphere.specular = 0.4;
    sphere.shininess = 100;
    sphere.reflectivity = 0.5;

    sphereScene.shapes.push(sphere);

    let light = new Light();
    light.position = vec3.fromValues(0, 10, 0);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 1, 1);

    sphereScene.lights.push(light);


    Scenes.addScene('sphere', sphereScene);

}

function createTwoSphere() {
    let sphereScene = new Scene();
    sphereScene.backgroundColor = vec3.fromValues(0.5, 0.5, 0.5);

    let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
    //sphere.scale(vec3.fromValues(0.3, 0.3, 0.3));

    sphere.translate(vec3.fromValues(-1, 0, 0));

    //sphere.scale(vec3.fromValues(2, 2, 2));
    sphere.color = vec3.fromValues(1, 1, 1);
    sphere.ambient = 0.1;
    sphere.diffuse = 0.7;
    sphere.specular = 0.2;
    sphere.shininess = 100;
    sphere.reflectivity = 0.5;

    sphereScene.shapes.push(sphere);

    let sphere2 = new Sphere(1, vec3.fromValues(0, 0, 0));
    //sphere2.scale(vec3.fromValues(0.3, 0.3, 0.3));
    sphere2.translate(vec3.fromValues(1, 0, 0));

    //sphere.scale(vec3.fromValues(1, .3, 1));
    sphere2.color = vec3.fromValues(1, 1, 1);
    sphere2.ambient = 0.2;
    sphere2.diffuse = 0.9;
    sphere2.specular = 0.0;
    sphere2.shininess = 100;
    sphere2.reflectivity = 0.0;

    sphereScene.shapes.push(sphere2);

    sphereScene.rayDepth = 1;


    let light = new Light();
    light.position = vec3.fromValues(0, 10, 0);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 0, 0);

    sphereScene.lights.push(light);


    Scenes.addScene('sphere2', sphereScene);

}

function createScenes() {
    createSphere();
    createTwoSphere();
}

createScenes();

