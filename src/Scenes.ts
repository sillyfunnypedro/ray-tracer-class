/**
 * @module Scenes
 */


import Scene from './Geometry/Scene';
import Shape from './Geometry/Shape';
import Light from './Geometry/Light';
import Sphere from './Geometry/Sphere';
import Triangle from './Geometry/Triangle';
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
    let scene = new Scene();
    scene.backgroundColor = vec3.fromValues(0.5, 0.5, 0.5);

    let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
    //sphere.translate(vec3.fromValues(2, 0, 0));

    sphere.color = vec3.fromValues(1, 1, 1);
    sphere.ambient = 0.2;
    sphere.diffuse = 0.4;
    sphere.specular = 0.4;
    sphere.shininess = 100;
    sphere.reflectivity = 0.5;

    scene.shapes.push(sphere);

    let light = new Light();
    light.position = vec3.fromValues(0, 5, 10);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 1, 1);

    scene.lights.push(light);
    scene.rayDepth = 2;


    Scenes.addScene('sphere', scene);

}

function createTriangle() {
    let scene = new Scene();
    scene.backgroundColor = vec3.fromValues(0.5, 0.5, 0.5);

    let triangle = new Triangle(vec3.fromValues(-5, 0, -5), vec3.fromValues(0, 0, 5), vec3.fromValues(5, 0, -5),);
    triangle.color = vec3.fromValues(1, 1, 1);
    triangle.ambient = 0.2;
    triangle.diffuse = 0.4;
    triangle.specular = 0.4;
    triangle.shininess = 100;
    triangle.reflectivity = 0.5;

    scene.shapes.push(triangle);

    let light = new Light();
    light.position = vec3.fromValues(0, 2, 0);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 1, 1);

    scene.lights.push(light);
    scene.rayDepth = 2;

    scene.camera.setEyePosition(vec3.fromValues(15, 15, 15));
    scene.camera.setLookAt(vec3.fromValues(0, 0, 0));
    Scenes.addScene('triangle', scene);
}

function createSquareAndSphere() {
    let scene = new Scene();
    scene.backgroundColor = vec3.fromValues(0.5, 0.5, 0.5);

    let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
    sphere.translate(vec3.fromValues(-3, 6, 0));
    sphere.scale(vec3.fromValues(1.3, 1.3, 1.3));
    sphere.color = vec3.fromValues(0, .5, 0);
    sphere.ambient = 0.2;
    sphere.diffuse = 0.4;
    sphere.specular = 0.4;
    sphere.shininess = 100;
    sphere.reflectivity = 0.5;

    scene.shapes.push(sphere);

    let sphere2 = new Sphere(1, vec3.fromValues(0, 0, 0));
    sphere2.translate(vec3.fromValues(2, 6, 0));
    //sphere2.scale(vec3.fromValues(0.3, 0.3, 0.3));
    sphere2.color = vec3.fromValues(0, 0, 1);
    sphere2.ambient = 0.2;
    sphere2.diffuse = 0.4;
    sphere2.specular = 0.4;
    sphere2.shininess = 100;
    sphere2.reflectivity = 1;

    scene.shapes.push(sphere2);

    let sphere3 = new Sphere(1, vec3.fromValues(0, 0, 0));
    sphere3.translate(vec3.fromValues(7, 1.5, -7));
    //sphere3.scale(vec3.fromValues(0.3, 0.3, 0.3));
    sphere3.color = vec3.fromValues(1, 0, 0);
    sphere3.ambient = 0.2;
    sphere3.diffuse = 0.4;
    sphere3.specular = 0.4;
    sphere3.shininess = 100;
    sphere3.reflectivity = 0.3

    scene.shapes.push(sphere3);

    let square1 = new Triangle(vec3.fromValues(-10, 0, -10), vec3.fromValues(10, 0, -10), vec3.fromValues(-10, 0, 10),);
    square1.color = vec3.fromValues(1, 1, 1);
    square1.ambient = 0.2;
    square1.diffuse = 0.4;
    square1.specular = 0.4;
    square1.shininess = 100;
    square1.reflectivity = 1.0;

    scene.shapes.push(square1);

    let square2 = new Triangle(vec3.fromValues(-10, 0, 10), vec3.fromValues(10, 0, -10), vec3.fromValues(10, 0, 10),);
    square2.color = vec3.fromValues(1, 1, 1);
    square2.ambient = 0.2;
    square2.diffuse = 0.4;
    square2.specular = 0.4;
    square2.shininess = 100;
    square2.reflectivity = 1.0;

    scene.shapes.push(square2);

    let backWall = new Triangle(vec3.fromValues(10, 0, -10), vec3.fromValues(-10, 0, -10), vec3.fromValues(10, 10, -10),);
    backWall.color = vec3.fromValues(1, 1, 1);
    backWall.ambient = 0.2;
    backWall.diffuse = 0.4;
    backWall.specular = 0.4;
    backWall.shininess = 100;
    backWall.reflectivity = 0.5;


    scene.shapes.push(backWall);

    let backWall2 = new Triangle(vec3.fromValues(-10, 0, -10), vec3.fromValues(-10, 10, -10), vec3.fromValues(10, 10, -10));
    backWall2.color = vec3.fromValues(1, 1, 1);
    backWall2.ambient = 0.2;
    backWall2.diffuse = 0.4;
    backWall2.specular = 0.4;
    backWall2.shininess = 100;
    backWall2.reflectivity = 0.5;


    scene.shapes.push(backWall2);

    let sideWall = new Triangle(vec3.fromValues(-10, 0, -10), vec3.fromValues(-10, 0, 10), vec3.fromValues(-10, 10, -10));
    sideWall.color = vec3.fromValues(1, 0, 0);
    sideWall.ambient = 0.2;
    sideWall.diffuse = 0.4;
    sideWall.specular = 0.4;
    sideWall.shininess = 100;
    sideWall.reflectivity = 0.5;

    scene.shapes.push(sideWall);

    let sideWall2 = new Triangle(vec3.fromValues(-10, 0, 10), vec3.fromValues(-10, 10, 10), vec3.fromValues(-10, 10, -10));
    sideWall2.color = vec3.fromValues(1, 0, 0);
    sideWall2.ambient = 0.2;
    sideWall2.diffuse = 0.4;
    sideWall2.specular = 0.4;
    sideWall2.shininess = 100;
    sideWall2.reflectivity = 0.5;

    scene.shapes.push(sideWall2);


    let light = new Light();
    light.position = vec3.fromValues(15, 15, 15);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 1, 1);

    scene.lights.push(light);

    scene.camera.setEyePosition(vec3.fromValues(30, 15, 30));
    scene.camera.setLookAt(vec3.fromValues(-10, 0, -10));
    scene.rayDepth = 8;
    Scenes.addScene('squareAndSphere', scene);
}

function createTwoSphere() {
    let scene = new Scene();
    scene.backgroundColor = vec3.fromValues(0.5, 0.5, 0.5);

    let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
    //sphere.scale(vec3.fromValues(0.3, 0.3, 0.3));

    sphere.translate(vec3.fromValues(-0.5, 0, 0));

    //sphere.scale(vec3.fromValues(2, 2, 2));
    sphere.color = vec3.fromValues(1, 1, 1);
    sphere.ambient = 0.1;
    sphere.diffuse = 0.1;
    sphere.specular = 0.2;
    sphere.shininess = 100;
    sphere.reflectivity = 1.0;

    scene.shapes.push(sphere);

    let sphere2 = new Sphere(1, vec3.fromValues(0, 0, 0));
    sphere2.scale(vec3.fromValues(0.3, 0.3, 0.3));
    sphere2.translate(vec3.fromValues(1, 0, 0));

    //sphere.scale(vec3.fromValues(1, .3, 1));
    sphere2.color = vec3.fromValues(0, 0, 1);
    sphere2.ambient = 0.2;
    sphere2.diffuse = 0.7;
    sphere2.specular = 0.4;
    sphere2.shininess = 100;
    sphere2.reflectivity = 0.0;

    scene.shapes.push(sphere2);

    scene.rayDepth = 2;


    let light = new Light();
    light.position = vec3.fromValues(0, 10, 0);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 1, 1);

    scene.lights.push(light);
    scene.camera.setEyePosition(vec3.fromValues(0, 0, 10));
    scene.camera.setLookAt(vec3.fromValues(0, 0, 0));

    Scenes.addScene('sphere2', scene);

}



function createFiveSpheres() {

    let scene = new Scene();
    scene.backgroundColor = vec3.fromValues(.3, .3, .3);

    let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
    //sphere.scale(vec3.fromValues(0.3, 0.3, 0.3));

    sphere.translate(vec3.fromValues(0, 0, 0));

    //sphere.scale(vec3.fromValues(2, 2, 2));
    sphere.color = vec3.fromValues(1, 1, 1);
    sphere.ambient = 0.1;
    sphere.diffuse = 0.1;
    sphere.specular = 0.2;
    sphere.shininess = 100;
    sphere.reflectivity = 1.0;
    scene.shapes.push(sphere);

    function blueSphere(scene: Scene, x: number, y: number, z: number) {
        let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
        sphere.scale(vec3.fromValues(0.3, 0.3, 0.3));
        sphere.translate(vec3.fromValues(x, y, z));

        //sphere.scale(vec3.fromValues(1, .3, 1));
        sphere.color = vec3.fromValues(0, 0, 1);
        sphere.ambient = 0.2;
        sphere.diffuse = 0.7;
        sphere.specular = 0.4;
        sphere.shininess = 100;
        sphere.reflectivity = 0.0;

        scene.shapes.push(sphere);
    }
    blueSphere(scene, 2, 0, 0);
    blueSphere(scene, -2, 0, 0);
    blueSphere(scene, 0, 2, 0);
    blueSphere(scene, 0, -3, 0);

    scene.rayDepth = 2;

    let light = new Light();
    light.position = vec3.fromValues(0, 10, 0);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 1, 1);

    scene.lights.push(light);
    scene.camera.setEyePosition(vec3.fromValues(10, 0, 10));
    scene.camera.setLookAt(vec3.fromValues(0, 0, 0));
    scene.camera.fieldOfView = 30;

    Scenes.addScene('sphere5', scene);


}

function create5SpheresRecursive(size: number, scene: Scene, generation: number, x: number, y: number, z: number) {
    if (generation === 0) {
        return;
    }
    let sphere = new Sphere(1, vec3.fromValues(0, 0, 0));
    sphere.scale(vec3.fromValues(size, size, size));
    sphere.translate(vec3.fromValues(x, y, z));

    //sphere.scale(vec3.fromValues(2, 2, 2));
    sphere.color = vec3.fromValues(1, 0, 1);
    sphere.ambient = 0.1;
    sphere.diffuse = 0.1;
    sphere.specular = 0.2;
    sphere.shininess = 100;
    sphere.reflectivity = 1.0;
    scene.shapes.push(sphere);

    create5SpheresRecursive(size / 2, scene, generation - 1, x + size * 2, y, z);
    create5SpheresRecursive(size / 2, scene, generation - 1, x - size * 2, y, z);
    create5SpheresRecursive(size / 2, scene, generation - 1, x, y + size * 2, z);
    create5SpheresRecursive(size / 2, scene, generation - 1, x, y - size * 2, z);
    // create5SpheresRecursive(size / 2, scene, generation - 1, x, y, z + size * 1.5);
    // create5SpheresRecursive(size / 2, scene, generation - 1, x, y, z - size * 1.5);


}

function manySpheres() {
    let scene = new Scene();
    scene.backgroundColor = vec3.fromValues(0.5, 0.5, 0.5);

    create5SpheresRecursive(0.5, scene, 2, 0, 0, 0);

    scene.rayDepth = 3;

    let light = new Light();
    light.position = vec3.fromValues(0, 10, 0);
    light.intensity = 1;
    light.color = vec3.fromValues(1, 1, 1);
    scene.camera.setEyePosition(vec3.fromValues(0, 0, 5));
    scene.camera.setLookAt(vec3.fromValues(0, 0, 0));


    scene.lights.push(light);

    Scenes.addScene('sphereMany', scene);
}

function createScenes() {
    createSphere();
    createTriangle();
    createSquareAndSphere()
    createTwoSphere();
    createFiveSpheres();
    manySpheres();
}

createScenes();

