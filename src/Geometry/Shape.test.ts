import Shape from './Shape';
import Ray from './Ray';
import { vec3 } from 'gl-matrix';
import Intersection from './Intersection';

class TestShape extends Shape {
    intersect(ray: Ray): Intersection {
        throw new Error("Method not implemented.");

    }
    computeBoundingBox(): void {
        this.boundingBoxExists = true;
        this.boundingBoxOrigin = vec3.fromValues(-1, -1, -1);
        this.boundingBoxSize = vec3.fromValues(2, 2, 2);

    }

}

describe('Shape', () => {
    let shape: TestShape;
    let ray: Ray;
    let normal: vec3;
    let intersectionPoint: vec3;

    beforeEach(() => {
        shape = new TestShape(); // Assuming Shape has a default constructor
        ray = new Ray(vec3.fromValues(0, 0, -10), vec3.fromValues(0, 0, 1));
        normal = vec3.fromValues(0, 0, 1);
        intersectionPoint = vec3.fromValues(0, 0, 0);
    });


    // test the bounding box.

    it('should correctly calculate the bounding box', () => {
        shape.computeBoundingBox();
        expect(shape.boundingBoxOrigin).toEqual(vec3.fromValues(-1, -1, -1));
        expect(shape.boundingBoxSize).toEqual(vec3.fromValues(2, 2, 2));
    });

    it('should return false when the ray [10,2,0] -> [-1,0,0] does not intersect the bounding box', () => {
        shape.computeBoundingBox();
        let ray = new Ray(vec3.fromValues(10, 2, 0), vec3.fromValues(-1, 0, 0));
        expect(shape.intersectBoundingBox(ray)).toEqual(false);
    });

    it('should return true when the ray [10,0,0] -> [-1,0,0] does intersect the bounding box', () => {
        shape.computeBoundingBox();
        let ray = new Ray(vec3.fromValues(10, 0, 0), vec3.fromValues(-1, 0, 0));
        let intersection = shape.intersectBoundingBox(ray);
        expect(intersection).toEqual(true);
    });

    it('should return false when the ray [10,10,10] -> [-1,-1,-1] does  intersect the bounding box', () => {
        shape.computeBoundingBox();
        let ray = new Ray(vec3.fromValues(0, 10, 0), vec3.fromValues(0, -1, 0));
        expect(shape.intersectBoundingBox(ray)).toEqual(true);
    });

    it('should return truee when the ray [10,10,10] -> [-1,0,-1] does not intersect the bounding box that is at 0 9 0', () => {
        shape.computeBoundingBox();
        shape.boundingBoxOrigin = vec3.fromValues(0, 9, 0);
        let ray = new Ray(vec3.fromValues(10, 10, 10), vec3.fromValues(-1, 0, -1));
        expect(shape.intersectBoundingBox(ray)).toEqual(true);
    });
});
export { }