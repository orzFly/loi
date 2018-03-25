import { expect } from 'chai';
import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import * as rt from './RuntimeType';
import { shouldNotValidate, shouldValidate } from './test-helper.spec';

// tslint:disable:no-unused-expression // chai to be NaN

describe('RuntimeType', () => {
  describe('trueBoolean', () => {
    it('should work', () => {
      expect(shouldValidate(rt.trueBoolean.decode(true))).to.be.equal(true)
      shouldNotValidate(rt.trueBoolean.decode(false))
      shouldNotValidate(rt.trueBoolean.decode(null))
      shouldNotValidate(rt.trueBoolean.decode(undefined))
    })
  })

  describe('falseBoolean', () => {
    it('should work', () => {
      expect(shouldValidate(rt.falseBoolean.decode(false))).to.be.equal(false)
      shouldNotValidate(rt.falseBoolean.decode(true))
      shouldNotValidate(rt.falseBoolean.decode(null))
      shouldNotValidate(rt.falseBoolean.decode(undefined))
    })
  })

  describe('violetTrueBoolean', () => {
    it('should work', () => {
      expect(shouldValidate(rt.violetTrueBoolean.decode(true))).to.be.equal(true)
      expect(shouldValidate(rt.violetTrueBoolean.decode(false))).to.be.equal(undefined)
      expect(shouldValidate(rt.violetTrueBoolean.decode(null))).to.be.equal(undefined)
      expect(shouldValidate(rt.violetTrueBoolean.decode(undefined))).to.be.equal(undefined)
    })
  })

  describe('violetFalseBoolean', () => {
    it('should work', () => {
      expect(shouldValidate(rt.violetFalseBoolean.decode(false))).to.be.equal(false)
      expect(shouldValidate(rt.violetFalseBoolean.decode(true))).to.be.equal(undefined)
      expect(shouldValidate(rt.violetFalseBoolean.decode(null))).to.be.equal(undefined)
      expect(shouldValidate(rt.violetFalseBoolean.decode(undefined))).to.be.equal(undefined)
    })
  })
})
