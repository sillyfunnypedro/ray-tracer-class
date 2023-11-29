import Shape from "./Shape";
import Ray from "./Ray";
import Intersection from "./Intersection";
import { vec3 } from "gl-matrix";
import Cylinder from "./Cylinder";


/**
 * 
 */
describe("Cylinder", () => {
    test("it should intersect with the top of the cylinder", () => {
        let cylinder = new Cylinder();
        let ray = Ray.create();
        ray.origin = vec3.fromValues(10, 11, 0);
        ray.direction = vec3.fromValues(-1, -1, 0);
        let intersection = cylinder.intersect(ray, true);
        let expectedIntersectionPoint = vec3.fromValues(0, 1, 0);

        expect(intersection.position).toEqual(expectedIntersectionPoint);
    });

    test("it should intersect with the bottom of the cylinder", () => {
        let cylinder = new Cylinder();
        let ray = Ray.create();
        ray.origin = vec3.fromValues(10, -11, 0);
        ray.direction = vec3.fromValues(-1, 1, 0);
        let intersection = cylinder.intersect(ray, true);
        let expectedIntersectionPoint = vec3.fromValues(0, -1, 0);

        expect(intersection.position).toEqual(expectedIntersectionPoint);
    });

    test("it should intersect with the side of the cylinder", () => {
        let cylinder = new Cylinder();
        let ray = Ray.create();
        ray.origin = vec3.fromValues(10, 0, 0);
        ray.direction = vec3.fromValues(-1, 0, 0);
        let intersection = cylinder.intersect(ray, true);
        let expectedIntersectionPoint = vec3.fromValues(1, 0, 0);

        expect(intersection.position).toEqual(expectedIntersectionPoint);
    });

});

export default Cylinder;
