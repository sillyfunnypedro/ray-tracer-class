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

    // it('should correctly initialize with a center and radius', () => {
    //     expect(sphere.center).toEqual(center);
    //     expect(sphere.radius).toEqual(radius);
    // });

    // it('should return null intersection when ray does not intersect', () => {
    //     const ray = new Ray(vec3.fromValues(0, 0, 10), vec3.fromValues(0, 1, 1));
    //     const intersection = sphere.intersect(ray);
    //     expect(intersection.hitDistance).toEqual(Number.MAX_VALUE);
    // });

    it('should return intersection when ray intersects', () => {
        const ray = new Ray(vec3.fromValues(0, 0, 10), vec3.fromValues(0, 0, -1));
        const intersection = sphere.intersect(ray);
        expect(intersection.hitDistance).toBeLessThan(Number.MAX_VALUE);
        expect(intersection.hitShape).toEqual(sphere);
    });
});