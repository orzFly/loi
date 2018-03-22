import { expect } from 'chai';
import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import * as rt from './RuntimeType';

function shouldValidate<Right>(e: Either<t.ValidationError[], Right>) {
  return e.fold((err) => { throw err }, (right) => right);
}

function shouldNotValidate<Right>(e: Either<t.ValidationError[], Right>) {
  return e.fold((err) => err, (right) => { throw new Error('Should Not Validate') });
}

// tslint:disable:no-unused-expression // chai to be NaN

describe('RuntimeType', () => {
  describe('convert', () => {
    it('should work', () => {
      const test = rt.convert(t.number, () => 233, (i) => i === 1)

      expect(shouldValidate(rt.validate(1, test))).to.be.eql(233)
      expect(shouldValidate(rt.validate(2, test))).to.be.eql(2)
      expect(shouldValidate(rt.validate(233, test))).to.be.eql(233)
    })
  })

  describe('nullAsUndefined', () => {
    it('should work', () => {
      const test = t.partial({
        key: rt.nullAsUndefined(t.boolean)
      })

      expect(shouldValidate(rt.validate({ key: true }, test)).key).to.be.equal(true)
      expect(shouldValidate(rt.validate({ key: false }, test)).key).to.be.equal(false)
      expect(shouldValidate(rt.validate({ key: null }, test)).key).to.be.equal(undefined)
      expect(shouldValidate(rt.validate({ key: undefined }, test)).key).to.be.equal(undefined)
      expect(shouldValidate(rt.validate({}, test)).key).to.be.equal(undefined)
    })
  })

  describe('trueBoolean', () => {
    it('should work', () => {
      expect(shouldValidate(rt.validate(true, rt.trueBoolean))).to.be.equal(true)
      shouldNotValidate(rt.validate(false, rt.trueBoolean))
      shouldNotValidate(rt.validate(null, rt.trueBoolean))
      shouldNotValidate(rt.validate(undefined, rt.trueBoolean))
    })
  })

  describe('falseBoolean', () => {
    it('should work', () => {
      expect(shouldValidate(rt.validate(false, rt.falseBoolean))).to.be.equal(false)
      shouldNotValidate(rt.validate(true, rt.falseBoolean))
      shouldNotValidate(rt.validate(null, rt.falseBoolean))
      shouldNotValidate(rt.validate(undefined, rt.falseBoolean))
    })
  })

  describe('violetTrueBoolean', () => {
    it('should work', () => {
      expect(shouldValidate(rt.validate(true, rt.violetTrueBoolean))).to.be.equal(true)
      expect(shouldValidate(rt.validate(false, rt.violetTrueBoolean))).to.be.equal(undefined)
      expect(shouldValidate(rt.validate(null, rt.violetTrueBoolean))).to.be.equal(undefined)
      expect(shouldValidate(rt.validate(undefined, rt.violetTrueBoolean))).to.be.equal(undefined)
    })
  })

  describe('violetFalseBoolean', () => {
    it('should work', () => {
      expect(shouldValidate(rt.validate(false, rt.violetFalseBoolean))).to.be.equal(false)
      expect(shouldValidate(rt.validate(true, rt.violetFalseBoolean))).to.be.equal(undefined)
      expect(shouldValidate(rt.validate(null, rt.violetFalseBoolean))).to.be.equal(undefined)
      expect(shouldValidate(rt.validate(undefined, rt.violetFalseBoolean))).to.be.equal(undefined)
    })
  })

  describe('nullablePartial', () => {
    it('should work', () => {
      const test = rt.nullablePartial({
        key: t.boolean
      })

      expect(shouldValidate(rt.validate({ key: true }, test)).key).to.be.equal(true)
      expect(shouldValidate(rt.validate({ key: false }, test)).key).to.be.equal(false)
      expect(shouldValidate(rt.validate({ key: null }, test)).key).to.be.equal(undefined)
      expect(shouldValidate(rt.validate({ key: undefined }, test)).key).to.be.equal(undefined)
      expect(shouldValidate(rt.validate({}, test)).key).to.be.equal(undefined)
    })

    it('control group should not work', () => {
      const test = t.partial({
        key: t.boolean
      })

      expect(shouldValidate(rt.validate({ key: true }, test)).key).to.be.equal(true)
      expect(shouldValidate(rt.validate({ key: false }, test)).key).to.be.equal(false)
      shouldNotValidate(rt.validate({ key: null }, test))
      expect(shouldValidate(rt.validate({ key: undefined }, test)).key).to.be.equal(undefined)
      expect(shouldValidate(rt.validate({}, test)).key).to.be.equal(undefined)
    })
  })

  describe('stringNumber', () => {
    it('should work', () => {
      expect(shouldValidate(rt.validate(1, rt.stringNumber))).to.be.equal(1)
      expect(shouldValidate(rt.validate(-1, rt.stringNumber))).to.be.equal(-1)
      expect(shouldValidate(rt.validate(1.233, rt.stringNumber))).to.be.equal(1.233)
      expect(shouldValidate(rt.validate(-1.233, rt.stringNumber))).to.be.equal(-1.233)
      expect(shouldValidate(rt.validate(1e5, rt.stringNumber))).to.be.equal(1e5)
      expect(shouldValidate(rt.validate(-1e5, rt.stringNumber))).to.be.equal(-1e5)
      expect(shouldValidate(rt.validate(0, rt.stringNumber))).to.be.equal(0)
      expect(shouldValidate(rt.validate(NaN, rt.stringNumber))).to.be.NaN;
      expect(shouldValidate(rt.validate(Infinity, rt.stringNumber))).to.be.equal(Infinity)
      expect(shouldValidate(rt.validate(-Infinity, rt.stringNumber))).to.be.equal(-Infinity)

      expect(shouldValidate(rt.validate("1", rt.stringNumber))).to.be.equal(1)
      expect(shouldValidate(rt.validate("-1", rt.stringNumber))).to.be.equal(-1)
      expect(shouldValidate(rt.validate("1.233", rt.stringNumber))).to.be.equal(1.233)
      expect(shouldValidate(rt.validate("-1.233", rt.stringNumber))).to.be.equal(-1.233)
      expect(shouldValidate(rt.validate("1e5", rt.stringNumber))).to.be.equal(1e5)
      expect(shouldValidate(rt.validate("-1e5", rt.stringNumber))).to.be.equal(-1e5)
      expect(shouldValidate(rt.validate("0", rt.stringNumber))).to.be.equal(0)
      expect(shouldValidate(rt.validate("021", rt.stringNumber))).to.be.equal(21)
      expect(shouldValidate(rt.validate("0x32767", rt.stringNumber))).to.be.equal(0)
      expect(shouldValidate(rt.validate("aasdaNaN", rt.stringNumber))).to.be.NaN;
      expect(shouldValidate(rt.validate("", rt.stringNumber))).to.be.NaN;
      expect(shouldValidate(rt.validate("NaN", rt.stringNumber))).to.be.NaN;
      expect(shouldValidate(rt.validate("-NaN", rt.stringNumber))).to.be.NaN;
      expect(shouldValidate(rt.validate("Infinity", rt.stringNumber))).to.be.equal(Infinity)
      expect(shouldValidate(rt.validate("-Infinity", rt.stringNumber))).to.be.equal(-Infinity)

      shouldNotValidate(rt.validate({ key: null }, rt.stringNumber))
      shouldNotValidate(rt.validate(null, rt.stringNumber))
      shouldNotValidate(rt.validate(undefined, rt.stringNumber))
    })
  })

  describe('finiteNumber', () => {
    it('should work', () => {
      expect(shouldValidate(rt.validate(1, rt.finiteNumber))).to.be.equal(1)
      expect(shouldValidate(rt.validate(-1, rt.finiteNumber))).to.be.equal(-1)
      expect(shouldValidate(rt.validate(1.233, rt.finiteNumber))).to.be.equal(1.233)
      expect(shouldValidate(rt.validate(-1.233, rt.finiteNumber))).to.be.equal(-1.233)
      expect(shouldValidate(rt.validate(1e5, rt.finiteNumber))).to.be.equal(1e5)
      expect(shouldValidate(rt.validate(-1e5, rt.finiteNumber))).to.be.equal(-1e5)
      expect(shouldValidate(rt.validate(0, rt.finiteNumber))).to.be.equal(0)
      shouldNotValidate(rt.validate(NaN, rt.finiteNumber))
      shouldNotValidate(rt.validate(Infinity, rt.finiteNumber))
      shouldNotValidate(rt.validate(-Infinity, rt.finiteNumber))

      shouldNotValidate(rt.validate("1", rt.finiteNumber))
      shouldNotValidate(rt.validate("-1", rt.finiteNumber))
      shouldNotValidate(rt.validate("1.233", rt.finiteNumber))
      shouldNotValidate(rt.validate("-1.233", rt.finiteNumber))
      shouldNotValidate(rt.validate("1e5", rt.finiteNumber))
      shouldNotValidate(rt.validate("-1e5", rt.finiteNumber))
      shouldNotValidate(rt.validate("0", rt.finiteNumber))
      shouldNotValidate(rt.validate("021", rt.finiteNumber))
      shouldNotValidate(rt.validate("0x32767", rt.finiteNumber))
      shouldNotValidate(rt.validate("aasdaNaN", rt.finiteNumber))
      shouldNotValidate(rt.validate("", rt.finiteNumber))
      shouldNotValidate(rt.validate("NaN", rt.finiteNumber))
      shouldNotValidate(rt.validate("-NaN", rt.finiteNumber))
      shouldNotValidate(rt.validate("Infinity", rt.finiteNumber))
      shouldNotValidate(rt.validate("-Infinity", rt.finiteNumber))

      shouldNotValidate(rt.validate({ key: null }, rt.finiteNumber))
      shouldNotValidate(rt.validate(null, rt.finiteNumber))
      shouldNotValidate(rt.validate(undefined, rt.finiteNumber))
    })
  })

  describe('finiteStringNumber', () => {
    it('should work', () => {
      expect(shouldValidate(rt.validate(1, rt.finiteStringNumber))).to.be.equal(1)
      expect(shouldValidate(rt.validate(-1, rt.finiteStringNumber))).to.be.equal(-1)
      expect(shouldValidate(rt.validate(1.233, rt.finiteStringNumber))).to.be.equal(1.233)
      expect(shouldValidate(rt.validate(-1.233, rt.finiteStringNumber))).to.be.equal(-1.233)
      expect(shouldValidate(rt.validate(1e5, rt.finiteStringNumber))).to.be.equal(1e5)
      expect(shouldValidate(rt.validate(-1e5, rt.finiteStringNumber))).to.be.equal(-1e5)
      expect(shouldValidate(rt.validate(0, rt.finiteStringNumber))).to.be.equal(0)
      shouldNotValidate(rt.validate(NaN, rt.finiteStringNumber))
      shouldNotValidate(rt.validate(Infinity, rt.finiteStringNumber))
      shouldNotValidate(rt.validate(-Infinity, rt.finiteStringNumber))

      expect(shouldValidate(rt.validate("1", rt.finiteStringNumber))).to.be.equal(1)
      expect(shouldValidate(rt.validate("-1", rt.finiteStringNumber))).to.be.equal(-1)
      expect(shouldValidate(rt.validate("1.233", rt.finiteStringNumber))).to.be.equal(1.233)
      expect(shouldValidate(rt.validate("-1.233", rt.finiteStringNumber))).to.be.equal(-1.233)
      expect(shouldValidate(rt.validate("1e5", rt.finiteStringNumber))).to.be.equal(1e5)
      expect(shouldValidate(rt.validate("-1e5", rt.finiteStringNumber))).to.be.equal(-1e5)
      expect(shouldValidate(rt.validate("0", rt.finiteStringNumber))).to.be.equal(0)
      expect(shouldValidate(rt.validate("021", rt.finiteStringNumber))).to.be.equal(21)
      expect(shouldValidate(rt.validate("0x32767", rt.finiteStringNumber))).to.be.equal(0)
      shouldNotValidate(rt.validate("aasdaNaN", rt.finiteStringNumber))
      shouldNotValidate(rt.validate("", rt.finiteStringNumber))
      shouldNotValidate(rt.validate("NaN", rt.finiteStringNumber))
      shouldNotValidate(rt.validate("-NaN", rt.finiteStringNumber))
      shouldNotValidate(rt.validate("Infinity", rt.finiteStringNumber))
      shouldNotValidate(rt.validate("-Infinity", rt.finiteStringNumber))

      shouldNotValidate(rt.validate({ key: null }, rt.finiteStringNumber))
      shouldNotValidate(rt.validate(null, rt.finiteStringNumber))
      shouldNotValidate(rt.validate(undefined, rt.finiteStringNumber))
    })
  })
})
