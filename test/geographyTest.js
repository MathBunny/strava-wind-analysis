const expect = require('chai').expect;
const Geography = require('../utilities/geography');
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
});
