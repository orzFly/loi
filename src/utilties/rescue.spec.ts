import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldValidate } from '../test-helper.spec';
import { withRescue, withRescueResolver } from './rescue';

// tslint:disable:no-unused-expression // chai to be NaN

describe('utilties:rescue', () => {
  describe('withRescue', () => {
    it('should work', () => {
      const baseType = t.union([t.number, t.null, t.undefined])
      const test = withRescue(baseType, 1)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(undefined)
      expect(shouldValidate(test.decode(null))).to.be.eql(null)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      expect(shouldValidate(test.decode({}))).to.be.eql(1)
      expect(shouldValidate(test.decode(""))).to.be.eql(1)
      expect(shouldValidate(test.decode([]))).to.be.eql(1)

      expect(test.encode(1)).to.be.eql(baseType.encode(1))
      expect(test.encode(NaN)).to.be.eql(baseType.encode(NaN))
      expect(test.encode(undefined)).to.be.eql(baseType.encode(undefined))
      expect(test.encode(null)).to.be.eql(baseType.encode(null))

      expect(test.is(1)).to.be.eql(baseType.is(1))
      expect(test.is(NaN)).to.be.eql(baseType.is(NaN))
      expect(test.is(undefined)).to.be.eql(baseType.is(undefined))
      expect(test.is(null)).to.be.eql(baseType.is(null))
    })
  })

  describe('withRescueResolver', () => {
    it('should work', () => {
      let i = 233
      const baseType = t.union([t.number, t.null, t.undefined])
      const test = withRescueResolver(baseType, () => i++)

      expect(shouldValidate(test.decode(undefined))).to.be.eql(undefined)
      expect(shouldValidate(test.decode(null))).to.be.eql(null)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      expect(i).to.be.eql(233)
      expect(shouldValidate(test.decode({}))).to.be.eql(233)
      expect(shouldValidate(test.decode(""))).to.be.eql(234)
      expect(shouldValidate(test.decode([]))).to.be.eql(235)
      expect(i).to.be.eql(236)

      expect(test.encode(1)).to.be.eql(baseType.encode(1))
      expect(test.encode(NaN)).to.be.eql(baseType.encode(NaN))
      expect(test.encode(undefined)).to.be.eql(baseType.encode(undefined))
      expect(test.encode(null)).to.be.eql(baseType.encode(null))

      expect(test.is(1)).to.be.eql(baseType.is(1))
      expect(test.is(NaN)).to.be.eql(baseType.is(NaN))
      expect(test.is(undefined)).to.be.eql(baseType.is(undefined))
      expect(test.is(null)).to.be.eql(baseType.is(null))

      expect(i).to.be.eql(236)
    })
  })
})
