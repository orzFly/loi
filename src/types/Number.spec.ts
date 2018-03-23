import { expect } from 'chai';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { number } from './Number';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Number', () => {
  describe('number', () => {
    it('should work', () => {
      const test = number()

      expect(test.name).to.be.eql("number")
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(233))).to.be.eql(233)
    })

    it('max() should work', () => {
      const test = number().max(10)

      expect(test.name).to.be.eql("number(<=10)")
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      expect(shouldNotValidate(test.decode(11)))
    })

    it('min() should work', () => {
      const test = number().min(0)

      expect(test.name).to.be.eql("number(>=0)")
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      expect(shouldNotValidate(test.decode(-1)))
    })

    it('max() & min() should work', () => {
      const test = number().min(0).max(10)

      expect(test.name).to.be.eql("number(>=0, <=10)")
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(5))).to.be.eql(5)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      expect(shouldNotValidate(test.decode(11)))
      expect(shouldNotValidate(test.decode(-1)))
    })
  })
})