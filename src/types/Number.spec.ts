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

    it('min().max() should work', () => {
      const test = number().min(0).max(10)

      expect(test.name).to.be.eql("number(>=0, <=10)")
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(5))).to.be.eql(5)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      expect(shouldNotValidate(test.decode(11)))
      expect(shouldNotValidate(test.decode(-1)))
    })

    it('integer() should work', () => {
      const test = number().integer()

      expect(test.name).to.be.eql("number(integer)")
      expect(shouldValidate(test.decode(3))).to.be.eql(3)
      expect(shouldValidate(test.decode(3.0))).to.be.eql(3.0)
      expect(shouldValidate(test.decode(Math.pow(2, 53) - 1))).to.be.eql(Math.pow(2, 53) - 1)
      expect(shouldNotValidate(test.decode(Math.pow(2, 53))))
      expect(shouldNotValidate(test.decode(NaN)))
      expect(shouldNotValidate(test.decode(Infinity)))
      expect(shouldNotValidate(test.decode('3')))
      expect(shouldNotValidate(test.decode(3.1)))
    })

    it('default() should work', () => {
      const test = number().min(0).default(15)

      expect(test.name).to.be.eql("number(>=0, with default)")
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(5))).to.be.eql(5)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      expect(shouldValidate(test.decode(null))).to.be.eql(15)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(15)
      expect(shouldNotValidate(test.decode(NaN)))
      expect(shouldNotValidate(test.decode("")))
      expect(shouldNotValidate(test.decode(-1)))
    })

    it('parseFloat() should work', () => {
      const test = number().parseFloat()

      expect(test.name).to.be.eql("number(parseFloat)")
      expect(shouldValidate(test.decode('0'))).to.be.eql(0)
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(3.14))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('3.14'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('314e-2'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('0.0314E+2'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('3.14more non-digit characters'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('FF2'))).to.be.NaN
    })

    it('parseFloat().max() should work', () => {
      const test = number().parseFloat().max(5)

      expect(test.name).to.be.eql("number(parseFloat, <=5)")
      expect(shouldValidate(test.decode('0'))).to.be.eql(0)
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(3.14))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('3.14'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('314e-2'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('0.0314E+2'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('3.14more non-digit characters'))).to.be.eql(3.14)

      expect(shouldNotValidate(test.decode('FF2')))
      expect(shouldNotValidate(test.decode(5.14)))
      expect(shouldNotValidate(test.decode('5.14')))
      expect(shouldNotValidate(test.decode('514e-2')))
      expect(shouldNotValidate(test.decode('0.0514E+2')))
      expect(shouldNotValidate(test.decode('5.14more non-digit characters')))
    })

    it('max().parseFloat() should work', () => {
      const test = number().max(5).parseFloat()

      expect(test.name).to.be.eql("number(<=5, parseFloat)")
      expect(shouldValidate(test.decode('0'))).to.be.eql(0)
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(3.14))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('3.14'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('314e-2'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('0.0314E+2'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('3.14more non-digit characters'))).to.be.eql(3.14)

      expect(shouldNotValidate(test.decode('FF2')))
      expect(shouldNotValidate(test.decode(5.14)))
      expect(shouldNotValidate(test.decode('5.14')))
      expect(shouldNotValidate(test.decode('514e-2')))
      expect(shouldNotValidate(test.decode('0.0514E+2')))
      expect(shouldNotValidate(test.decode('5.14more non-digit characters')))
    })

    it('max().parseFloat().min() should work', () => {
      const test = number().max(5).parseFloat().min(0)

      expect(test.name).to.be.eql("number(<=5, parseFloat, >=0)")
      expect(shouldValidate(test.decode('0'))).to.be.eql(0)
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(3.14))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('3.14'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('314e-2'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('0.0314E+2'))).to.be.eql(3.14)
      expect(shouldValidate(test.decode('3.14more non-digit characters'))).to.be.eql(3.14)

      expect(shouldNotValidate(test.decode('FF2')))
      expect(shouldNotValidate(test.decode(5.14)))
      expect(shouldNotValidate(test.decode('5.14')))
      expect(shouldNotValidate(test.decode('514e-2')))
      expect(shouldNotValidate(test.decode('0.0514E+2')))
      expect(shouldNotValidate(test.decode('5.14more non-digit characters')))
    })
  })
})