const expect = require('chai').expect;
const Vector = require('../utilities/vector').Vector;
/* global it describe */

describe('Vector Class', () => {
  describe('Get Unit Value', () => {
    it('(1, 0) => 1', () => {
      expect(Vector.getUnitValue(1, 0)).to.equal(1);
    });
  });
});
