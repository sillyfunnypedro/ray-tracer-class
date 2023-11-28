import { Sphere } from './Sphere';
import { vec3 } from 'gl-matrix';
import { Ray } from './Ray'; // Assuming Ray is in the parent directory


describe('Sphere', () => {
    let sphere: Sphere;
    let center: vec3;
    let radius: number;

    beforeEach(() => {
        center = vec3.fromValues(0, 0, 0);
        radius = 5;
        sphere = new Sphere(radius, center);
    });

    it('should correctly initialize with a center and radius', () => {
        expect(sphere.center).toEqual(center);
        expect(sphere.radius).toEqual(radius);
    });

    it('should return null intersection when ray does not intersect', () => {
        const ray = new Ray(vec3.fromValues(0, 0, 10), vec3.fromValues(0, 1, 1));
        const intersection = sphere.intersect(ray, true);
        expect(intersection.hitDistance).toEqual(Number.MAX_VALUE);
    });

    it('should return intersection when ray intersects', () => {
        const ray = new Ray(vec3.fromValues(0, 0, 10), vec3.fromValues(0, 0, -1));
        const intersection = sphere.intersect(ray, true);
        expect(intersection.hitDistance).toBeLessThan(Number.MAX_VALUE);
        expect(intersection.hitShape).toEqual(sphere);
    });

    it('should return intersection when the ray his the top of the sphere', () => {
        const ray = new Ray(vec3.fromValues(0, 13, 12), vec3.fromValues(0, -1, -1));
        const unitSphere = new Sphere(1, vec3.fromValues(0, 0, 0));
        const intersection = unitSphere.intersect(ray, true);
        const expectedPosition = vec3.fromValues(0, 1, 0);

        expect(intersection.position[0]).toEqual(expectedPosition[0]);
        expect(intersection.position[1]).toEqual(expectedPosition[1]);
        expect(Math.abs(intersection.position[2])).toBeLessThan(0.0001); // allow for numerical error


        expect(intersection.hitDistance).toBeLessThan(Number.MAX_VALUE);

        expect(intersection.reflectedRay.direction).toEqual(vec3.fromValues(0, 1, -1));
        expect(intersection.hitShape).toEqual(unitSphere);
    });

    it('should compute the bounding box', () => {


        sphere.computeBoundingBox();

        expect(sphere.boundingBoxOrigin).toEqual(vec3.fromValues(-5, -5, -5));
        expect(sphere.boundingBoxSize).toEqual(vec3.fromValues(10, 10, 10));
    });
});

export { }