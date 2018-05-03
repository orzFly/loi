import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { withDefault, withDefaultResolver } from './default';

// tslint:disable:no-unused-expression // chai to be NaN

describe('utilties:default', () => {
  describe('withDefault', () => {
    it('should work', () => {
      const test = withDefault(t.number, 1)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(1)
      expect(shouldValidate(test.decode(null))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode([]))

      expect(test.encode(1)).to.be.eql(t.number.encode(1))
      expect(test.encode(NaN)).to.be.eql(t.number.encode(NaN))
      expect(test.encode(undefined)).to.be.eql(t.number.encode(undefined))
      expect(test.encode(null)).to.be.eql(t.number.encode(null))

      expect(test.is(1)).to.be.eql(t.number.is(1))
      expect(test.is(NaN)).to.be.eql(t.number.is(NaN))
      expect(test.is(undefined)).to.be.eql(t.number.is(1))
      expect(test.is(null)).to.be.eql(t.number.is(1))
    })
  })

  describe('withDefaultResolver', () => {
    it('should work', () => {
      let i = 233
      const test = withDefaultResolver(t.number, () => i++)

      expect(shouldValidate(test.decode(undefined))).to.be.eql(233)
      expect(shouldValidate(test.decode(null))).to.be.eql(234)
      expect(i).to.be.eql(235)

      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN

      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode([]))

      expect(test.encode(1)).to.be.eql(t.number.encode(1))
      expect(test.encode(NaN)).to.be.eql(t.number.encode(NaN))
      expect(test.encode(undefined)).to.be.eql(t.number.encode(undefined))
      expect(test.encode(null)).to.be.eql(t.number.encode(null))

      expect(test.is(1)).to.be.eql(t.number.is(1))
      expect(test.is(NaN)).to.be.eql(t.number.is(NaN))
      expect(test.is(undefined)).to.be.eql(t.number.is(235)); expect(i).to.be.eql(236)
      expect(test.is(null)).to.be.eql(t.number.is(236)); expect(i).to.be.eql(237)

      expect(i).to.be.eql(237)
    })
  })
})
