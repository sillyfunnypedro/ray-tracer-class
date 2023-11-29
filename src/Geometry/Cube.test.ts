import Shape from "./Shape";
import Ray from "./Ray";
import Intersection from "./Intersection";
import { vec3 } from "gl-matrix";
import Cube from "./Cube";

/**
 *  Cube class
 */

describe("Cube", () => {
    test("constructor", () => {
        let cube = new Cube();
        expect(cube).toBeDefined();
    });

    it("intersect untransformed cube", () => {
        let cube = new Cube();
        let ray = Ray.create();
        ray.origin = vec3.fromValues(10, 10, 10);
        ray.direction = vec3.fromValues(-1, -1, -1);
        let intersection = cube.intersect(ray, true);
        let expectedIntersectionPoint = vec3.fromValues(1, 1, 1);

        let expectedIntersecionDistance = vec3.length(vec3.subtract(vec3.create(), ray.origin, expectedIntersectionPoint));

        let delta = Math.abs(intersection.hitDistance - expectedIntersecionDistance);

        expect(delta).toBeLessThan(0.0001);
        //expect(intersection.hitDistance).toEqual(expectedIntersecionDistance);
        //expect(cube.intersect(ray, intersection)).toBe(false);
    });

    it("the bounding box should be correct after translation", () => {
        let cube = new Cube();
        cube.translate(vec3.fromValues(10, 10, 10));
        cube.computeBoundingBox();
        expect(cube.boundingBoxOrigin).toEqual(vec3.fromValues(9, 9, 9));
        expect(cube.boundingBoxSize).toEqual(vec3.fromValues(2, 2, 2));
    });

    it("the bounding box should be correct after rotation", () => {
        let cube = new Cube();
        cube.rotateX(45);
        cube.computeBoundingBox();
        expect(cube.boundingBoxOrigin).toEqual(vec3.fromValues(-1, -1.4142135381698608, -1.4142135381698608));
        expect(cube.boundingBoxSize).toEqual(vec3.fromValues(2, 2.8284270763397217, 2.8284270763397217));
    });

    it("should intersect the cube after translation", () => {
        let cube = new Cube();
        cube.translate(vec3.fromValues(0, 1.5, 0));
        let ray = Ray.create();
        ray.origin = vec3.fromValues(0, 1.5, 10);
        ray.direction = vec3.fromValues(0, 0, -1);
        let intersection = cube.intersect(ray, false);
        let expectedIntersectionPoint = vec3.fromValues(0, 1.5, 1);

        let expectedIntersecionDistance = vec3.length(vec3.subtract(vec3.create(), ray.origin, expectedIntersectionPoint));

        let delta = Math.abs(intersection.hitDistance - expectedIntersecionDistance);

        expect(delta).toBeLessThan(0.0001);
    });


});

export { };

