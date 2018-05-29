import { expect } from 'chai';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { set } from './Set';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Set', () => {
  describe('set', () => {
    it('should work with one string', () => {
      const test = set("a")
      expect(shouldValidate(test.decode("a"))).to.be.eql("a")
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode("A"))
      shouldNotValidate(test.decode("b"))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(false))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('should work with one number', () => {
      const test = set(1)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode("a"))
      shouldNotValidate(test.decode("A"))
      shouldNotValidate(test.decode("b"))
      shouldNotValidate(test.decode(false))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('should work with one boolean', () => {
      const test = set(true)
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode("a"))
      shouldNotValidate(test.decode("A"))
      shouldNotValidate(test.decode("b"))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(false))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('should work with many params', () => {
      const test = set(true, false, 1, 2, "a", "A", "b")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(2))).to.be.eql(2)
      expect(shouldValidate(test.decode("a"))).to.be.eql("a")
      expect(shouldValidate(test.decode("A"))).to.be.eql("A")
      expect(shouldValidate(test.decode("b"))).to.be.eql("b")
      expect(shouldValidate(test.decode(false))).to.be.eql(false)
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('should work with keyof', () => {
      const test = set({
        "a": 0,
        "A": false,
        "b": undefined
      })
      expect(shouldValidate(test.decode("a"))).to.be.eql("a")
      expect(shouldValidate(test.decode("A"))).to.be.eql("A")
      expect(shouldValidate(test.decode("b"))).to.be.eql("b")
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(2))
      shouldNotValidate(test.decode(true))
      shouldNotValidate(test.decode(false))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })
  })
})