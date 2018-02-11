const expect = require('chai').expect;
const Geography = require('../utilities/geography');

const ERROR_THRESHOLD = 0.000001;
/* global it describe */

describe('Geography Class', () => {
  describe('Degrees to Cardinal', () => {
    it('90º => E', () => {
      expect(Geography.degreesToCardinal(90)).to.equal('E');
    });
    it('125º => SE', () => {
      expect(Geography.degreesToCardinal(125)).to.equal('SE');
    });
    it('250º => WSW', () => {
      expect(Geography.degreesToCardinal(250)).to.equal('WSW');
    });
    it('360º => N', () => {
      expect(Geography.degreesToCardinal(360)).to.equal('N');
    });
    it('450º => E', () => {
      expect(Geography.degreesToCardinal(450)).to.equal('E');
    });
    it('-10º => N', () => {
      expect(Geography.degreesToCardinal(-10)).to.equal('N');
    });
  });

  describe('Degrees to Cardinal (Simple)', () => {
    it('90º => E', () => {
      expect(Geography.degreesToCardinalSimple(90)).to.equal('E');
    });
    it('125º => SE', () => {
      expect(Geography.degreesToCardinalSimple(125)).to.equal('SE');
    });
    it('250º => WSW', () => {
      expect(Geography.degreesToCardinalSimple(250)).to.equal('SW');
    });
    it('360º => N', () => {
      expect(Geography.degreesToCardinalSimple(360)).to.equal('N');
    });
    it('450º => E', () => {
      expect(Geography.degreesToCardinalSimple(450)).to.equal('E');
    });
    it('-10º => N', () => {
      expect(Geography.degreesToCardinalSimple(-10)).to.equal('N');
    });
  });

  describe('Polar Angle Latitude Lontitude', () => {
    it('(0, 0, 10, 10) => 3.9269908169872414', () => {
      expect(Geography.getPolarAngleLongLat(0, 0, 10, 10) - 3.9269908169872414).to.lessThan(ERROR_THRESHOLD);
    });
    it('(20, 20, 10, 10) => 3.9269908169872414', () => {
      expect(Geography.getPolarAngleLongLat(20, 20, 10, 10) - 3.9269908169872414).to.lessThan(ERROR_THRESHOLD);
    });
    it('(0, 0, 0, 0) => 0', () => {
      expect(Geography.getPolarAngleLongLat(0, 0, 0, 0)).to.lessThan(ERROR_THRESHOLD);
    });
  });

  describe('Convert Polar Angle to Bearing', () => {
    it('130 => 197.6216724823107', () => {
      expect(Geography.convertPolarAngleToBearing(130) - 201.5486632992979).to.lessThan(ERROR_THRESHOLD);
    });
  });

  describe('Convert Latitude/Longitude to Cardinal', () => {
    it('(0, 0, 10, 10) => SW', () => {
      expect(Geography.convertLatLongToCardinal(0, 0, 10, 10)).to.equal('SW');
    });
    it('(20, 20, 10, 10) => NE', () => {
      expect(Geography.convertLatLongToCardinal(20, 20, 10, 10)).to.equal('NE');
    });
  });
});
