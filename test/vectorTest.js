const expect = require('chai').expect;
const Vector = require('../utilities/vector');

const ERROR_THRESHOLD = 0.000001;
/* global it describe */

describe('Vector Class', () => {
  describe('Get Unit Value', () => {
    it('(1, 0) => 1', () => {
      expect(Vector.getUnitValue(1, 0)).to.equal(1);
    });
  });
  describe('Get Distance', () => {
    it('(10, 10) to (0, 0) => 1', () => {
      const vectorA = new Vector(10, 10);
      const vectorB = new Vector(0, 0);
      expect(Math.abs(Vector.getDistance(vectorA, vectorB) - 1)).to.lessThan(ERROR_THRESHOLD);
    });
    it('(-10, 10) to (0, 0) => 1', () => {
      const vectorA = new Vector(-10, 10);
      const vectorB = new Vector(0, 0);
      expect(Math.abs(Vector.getDistance(vectorA, vectorB) - 1)).to.lessThan(ERROR_THRESHOLD);
    });
    it('(-10, 10) to (10, 10) => 20', () => {
      const vectorA = new Vector(-10, 10);
      const vectorB = new Vector(10, 10);
      expect(Math.abs(Vector.getDistance(vectorA, vectorB))).equal(1.414213562373095);
    });
  });

  describe('Get Latitude from Bearing', () => {
    it('0 => 0', () => {
      expect(Vector.getLatitudeFromBearing(0)).to.lessThan(ERROR_THRESHOLD);
    });
    it('360 => 0', () => {
      expect(Vector.getLatitudeFromBearing(360)).to.lessThan(ERROR_THRESHOLD);
    });
    it('45 => √2/2', () => {
      expect(Vector.getLatitudeFromBearing(45) - (Math.sqrt(2) / 2)).to.lessThan(ERROR_THRESHOLD);
    });
  });
});
