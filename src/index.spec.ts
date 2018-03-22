import { expect } from 'chai';
import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { Loi } from './index';
import * as rt from './RuntimeType';

function shouldValidate<Right>(e: Either<t.ValidationError[], Right>) {
  return e.fold((err) => { throw err }, (right) => right);
}

function shouldNotValidate<Right>(e: Either<t.ValidationError[], Right>) {
  return e.fold((err) => err, (right) => { throw new Error('Should Not Validate') });
}

// tslint:disable:no-unused-expression // chai to be NaN

describe('utilties:Roi', () => {
  describe('number', () => {
    it('should work', () => {
      const test = Loi.number()

      expect(test.name).to.be.eql("number")
      expect(shouldValidate(rt.validate(1, test))).to.be.eql(1)
      expect(shouldValidate(rt.validate(233, test))).to.be.eql(233)
    })

    it('max() should work', () => {
      const test = Loi.number().max(10)

      expect(test.name).to.be.eql("number(<=10)")
      expect(shouldValidate(rt.validate(1, test))).to.be.eql(1)
      expect(shouldValidate(rt.validate(10, test))).to.be.eql(10)
      expect(shouldNotValidate(rt.validate(11, test)))
    })

    it('min() should work', () => {
      const test = Loi.number().min(0)

      expect(test.name).to.be.eql("number(>=0)")
      expect(shouldValidate(rt.validate(0, test))).to.be.eql(0)
      expect(shouldValidate(rt.validate(10, test))).to.be.eql(10)
      expect(shouldNotValidate(rt.validate(-1, test)))
    })

    it('max() & min() should work', () => {
      const test = Loi.number().min(0).max(10)

      expect(test.name).to.be.eql("number(>=0, <=10)")
      expect(shouldValidate(rt.validate(0, test))).to.be.eql(0)
      expect(shouldValidate(rt.validate(5, test))).to.be.eql(5)
      expect(shouldValidate(rt.validate(10, test))).to.be.eql(10)
      expect(shouldNotValidate(rt.validate(11, test)))
      expect(shouldNotValidate(rt.validate(-1, test)))
    })
  })
})
