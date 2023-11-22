import Shape from './Shape';
import Ray from './Ray';
import { vec3 } from 'gl-matrix';

describe('Shape', () => {
    let shape: Shape;
    let ray: Ray;
    let normal: vec3;
    let intersectionPoint: vec3;

    beforeEach(() => {
        shape = new Shape(); // Assuming Shape has a default constructor
        ray = new Ray(vec3.fromValues(0, 0, -10), vec3.fromValues(0, 0, 1));
        normal = vec3.fromValues(0, 0, 1);
        intersectionPoint = vec3.fromValues(0, 0, 0);
    });

    it('should correctly calculate the reflected ray', () => {
        const reflectedRay = shape.getReflectedRay(ray, normal, intersectionPoint);
        expect(reflectedRay.origin).toEqual(intersectionPoint);
        expect(reflectedRay.direction).toEqual(vec3.fromValues(0, 0, -1));
    });

    it('should correctly calculate the reflected ray with a non-zero intersection point', () => {
        intersectionPoint = vec3.fromValues(1, 1, 1);
        const reflectedRay = shape.getReflectedRay(ray, normal, intersectionPoint);
        expect(reflectedRay.origin).toEqual(intersectionPoint);
        expect(reflectedRay.direction).toEqual(vec3.fromValues(0, 0, -1));
    });

    it('should correctly calculate the reflected ray with a non-standard normal', () => {
        normal = vec3.fromValues(0, 1, 0);
        let ray = new Ray(vec3.fromValues(0, 10, 10), vec3.fromValues(0, -1, -1));
        const reflectedRay = shape.getReflectedRay(ray, normal, intersectionPoint);
        expect(reflectedRay.origin).toEqual(intersectionPoint);
        let expectedDirection = vec3.fromValues(0, 1, -1);

        expect(reflectedRay.direction).toEqual(expectedDirection);
    });
});
export { }