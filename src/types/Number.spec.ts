import { expect } from 'chai';
import * as t from '../iots';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { objectForEach } from '../utilties/lodash';
import { number } from './Number';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Number', () => {
  describe('number', () => {
    it('should work', () => {
      const test = number()

      expect(test.name).to.be.eql("number")
      expect(shouldValidate(test.decode(233))).to.be.eql(233)
      expect(shouldValidate(test.decode(1))).to.be.equal(1)
      expect(shouldValidate(test.decode(-1))).to.be.equal(-1)
      expect(shouldValidate(test.decode(1.233))).to.be.equal(1.233)
      expect(shouldValidate(test.decode(-1.233))).to.be.equal(-1.233)
      expect(shouldValidate(test.decode(1e5))).to.be.equal(1e5)
      expect(shouldValidate(test.decode(-1e5))).to.be.equal(-1e5)
      expect(shouldValidate(test.decode(0))).to.be.equal(0)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN;
      expect(shouldValidate(test.decode(Infinity))).to.be.equal(Infinity)
      expect(shouldValidate(test.decode(-Infinity))).to.be.equal(-Infinity)
    })

    it('mimicked number should work', () => {
      const test = number

      expect(test.name).to.be.eql("number")
      expect(shouldValidate(test.decode(233))).to.be.eql(233)
      expect(shouldValidate(test.decode(1))).to.be.equal(1)
      expect(shouldValidate(test.decode(-1))).to.be.equal(-1)
      expect(shouldValidate(test.decode(1.233))).to.be.equal(1.233)
      expect(shouldValidate(test.decode(-1.233))).to.be.equal(-1.233)
      expect(shouldValidate(test.decode(1e5))).to.be.equal(1e5)
      expect(shouldValidate(test.decode(-1e5))).to.be.equal(-1e5)
      expect(shouldValidate(test.decode(0))).to.be.equal(0)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN;
      expect(shouldValidate(test.decode(Infinity))).to.be.equal(Infinity)
      expect(shouldValidate(test.decode(-Infinity))).to.be.equal(-Infinity)
    })
    it('max() should work', () => {
      const test = number().max(10)

      expect(test.name).to.be.eql("number(<=10)")
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      shouldNotValidate(test.decode(11))
    })

    it('min() should work', () => {
      const test = number().min(0)

      expect(test.name).to.be.eql("number(>=0)")
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      shouldNotValidate(test.decode(-1))
    })

    it('min().max() should work', () => {
      const test = number().min(0).max(10)

      expect(test.name).to.be.eql("number(>=0, <=10)")
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(5))).to.be.eql(5)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      shouldNotValidate(test.decode(11))
      shouldNotValidate(test.decode(-1))
    })

    it('integer() should work', () => {
      const test = number().integer()

      expect(test.name).to.be.eql("number(integer)")
      expect(shouldValidate(test.decode(3))).to.be.eql(3)
      expect(shouldValidate(test.decode(3.0))).to.be.eql(3.0)
      expect(shouldValidate(test.decode(Math.pow(2, 53) - 1))).to.be.eql(Math.pow(2, 53) - 1)
      shouldNotValidate(test.decode(Math.pow(2, 53)))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode('3'))
      shouldNotValidate(test.decode(3.1))
    })

    it('default() should work', () => {
      const test = number().min(0).default(15)

      expect(test.name).to.be.eql("number(>=0, with default)")
      expect(shouldValidate(test.decode(0))).to.be.eql(0)
      expect(shouldValidate(test.decode(5))).to.be.eql(5)
      expect(shouldValidate(test.decode(10))).to.be.eql(10)
      expect(shouldValidate(test.decode(null))).to.be.eql(15)
      expect(shouldValidate(test.decode(undefined))).to.be.eql(15)
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode(-1))
    })

    it('finite() should work', () => {
      const test = number().finite()

      expect(test.name).to.be.eql("number(finite)")
      expect(shouldValidate(test.decode(1))).to.be.equal(1)
      expect(shouldValidate(test.decode(-1))).to.be.equal(-1)
      expect(shouldValidate(test.decode(1.233))).to.be.equal(1.233)
      expect(shouldValidate(test.decode(-1.233))).to.be.equal(-1.233)
      expect(shouldValidate(test.decode(1e5))).to.be.equal(1e5)
      expect(shouldValidate(test.decode(-1e5))).to.be.equal(-1e5)
      expect(shouldValidate(test.decode(0))).to.be.equal(0)
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))

      shouldNotValidate(test.decode("1"))
      shouldNotValidate(test.decode("-1"))
      shouldNotValidate(test.decode("1.233"))
      shouldNotValidate(test.decode("-1.233"))
      shouldNotValidate(test.decode("1e5"))
      shouldNotValidate(test.decode("-1e5"))
      shouldNotValidate(test.decode("0"))
      shouldNotValidate(test.decode("021"))
      shouldNotValidate(test.decode("0x32767"))
      shouldNotValidate(test.decode("aasdaNaN"))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode("NaN"))
      shouldNotValidate(test.decode("-NaN"))
      shouldNotValidate(test.decode("Infinity"))
      shouldNotValidate(test.decode("-Infinity"))

      shouldNotValidate(test.decode({ key: null }))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
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

      expect(shouldValidate(test.decode(1))).to.be.equal(1)
      expect(shouldValidate(test.decode(-1))).to.be.equal(-1)
      expect(shouldValidate(test.decode(1.233))).to.be.equal(1.233)
      expect(shouldValidate(test.decode(-1.233))).to.be.equal(-1.233)
      expect(shouldValidate(test.decode(1e5))).to.be.equal(1e5)
      expect(shouldValidate(test.decode(-1e5))).to.be.equal(-1e5)
      expect(shouldValidate(test.decode(0))).to.be.equal(0)
      expect(shouldValidate(test.decode(NaN))).to.be.NaN;
      expect(shouldValidate(test.decode(Infinity))).to.be.equal(Infinity)
      expect(shouldValidate(test.decode(-Infinity))).to.be.equal(-Infinity)

      expect(shouldValidate(test.decode("1"))).to.be.equal(1)
      expect(shouldValidate(test.decode("-1"))).to.be.equal(-1)
      expect(shouldValidate(test.decode("1.233"))).to.be.equal(1.233)
      expect(shouldValidate(test.decode("-1.233"))).to.be.equal(-1.233)
      expect(shouldValidate(test.decode("1e5"))).to.be.equal(1e5)
      expect(shouldValidate(test.decode("-1e5"))).to.be.equal(-1e5)
      expect(shouldValidate(test.decode("0"))).to.be.equal(0)
      expect(shouldValidate(test.decode("021"))).to.be.equal(21)
      expect(shouldValidate(test.decode("0x32767"))).to.be.equal(0)
      expect(shouldValidate(test.decode("aasdaNaN"))).to.be.NaN;
      expect(shouldValidate(test.decode(""))).to.be.NaN;
      expect(shouldValidate(test.decode("NaN"))).to.be.NaN;
      expect(shouldValidate(test.decode("-NaN"))).to.be.NaN;
      expect(shouldValidate(test.decode("Infinity"))).to.be.equal(Infinity)
      expect(shouldValidate(test.decode("-Infinity"))).to.be.equal(-Infinity)

      shouldNotValidate(test.decode({ key: null }))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('greater() should work', () => {
      const test = number().greater(10)

      expect(test.name).to.be.eql("number(>10)")
      expect(shouldValidate(test.decode(11))).to.be.eql(11)
      expect(shouldNotValidate(test.decode(1)))
      expect(shouldNotValidate(test.decode(10)))
    })

    it('less() should work', () => {
      const test = number().less(10)

      expect(test.name).to.be.eql("number(<10)")
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldNotValidate(test.decode(11)))
      expect(shouldNotValidate(test.decode(10)))
    })

    it('negative() should work', () => {
      const test = number().negative()

      expect(test.name).to.be.eql("number(-)")
      expect(shouldValidate(test.decode(-1))).to.be.eql(-1)
      expect(shouldValidate(test.decode(-11))).to.be.eql(-11)
      expect(shouldNotValidate(test.decode(1)))
      expect(shouldNotValidate(test.decode(0)))
    })

    it('positive() should work', () => {
      const test = number().positive()

      expect(test.name).to.be.eql("number(+)")
      expect(shouldValidate(test.decode(1))).to.be.eql(1)
      expect(shouldValidate(test.decode(11))).to.be.eql(11)
      expect(shouldNotValidate(test.decode(-1)))
      expect(shouldNotValidate(test.decode(0)))
    })

    objectForEach({
      "parseFloat().max()": [number().parseFloat().max(5), "number(parseFloat, <=5)"],
      "max().parseFloat()": [number().max(5).parseFloat(), "number(<=5, parseFloat)"],
      "parseFloat(), max().min()": [number().parseFloat().max(5).min(0), "number(parseFloat, <=5, >=0)"],
      "max().parseFloat().min()": [number().max(5).parseFloat().min(0), "number(<=5, parseFloat, >=0)"],
      "max().min().parseFloat()": [number().max(5).min(0).parseFloat(), "number(<=5, >=0, parseFloat)"],
    } as { [key: string]: [t.Any, string] }, ([type, name], key) => {
      it(`${key} should work`, () => {
        const test = type

        expect(test.name).to.be.eql(name)
        expect(shouldValidate(test.decode('0'))).to.be.eql(0)
        expect(shouldValidate(test.decode(0))).to.be.eql(0)
        expect(shouldValidate(test.decode(3.14))).to.be.eql(3.14)
        expect(shouldValidate(test.decode('3.14'))).to.be.eql(3.14)
        expect(shouldValidate(test.decode('314e-2'))).to.be.eql(3.14)
        expect(shouldValidate(test.decode('0.0314E+2'))).to.be.eql(3.14)
        expect(shouldValidate(test.decode('3.14more non-digit characters'))).to.be.eql(3.14)

        shouldNotValidate(test.decode(null))
        shouldNotValidate(test.decode(undefined))
        shouldNotValidate(test.decode('FF2'))
        shouldNotValidate(test.decode(5.14))
        shouldNotValidate(test.decode('5.14'))
        shouldNotValidate(test.decode('514e-2'))
        shouldNotValidate(test.decode('0.0514E+2'))
        shouldNotValidate(test.decode('5.14more non-digit characters'))
      })
    })

    it('parseFloat().finite() should work', () => {
      const test = number().parseFloat().finite()

      expect(test.name).to.be.eql("number(parseFloat, finite)")
      expect(shouldValidate(test.decode(1))).to.be.equal(1)
      expect(shouldValidate(test.decode(-1))).to.be.equal(-1)
      expect(shouldValidate(test.decode(1.233))).to.be.equal(1.233)
      expect(shouldValidate(test.decode(-1.233))).to.be.equal(-1.233)
      expect(shouldValidate(test.decode(1e5))).to.be.equal(1e5)
      expect(shouldValidate(test.decode(-1e5))).to.be.equal(-1e5)
      expect(shouldValidate(test.decode(0))).to.be.equal(0)
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(-Infinity))

      expect(shouldValidate(test.decode("1"))).to.be.equal(1)
      expect(shouldValidate(test.decode("-1"))).to.be.equal(-1)
      expect(shouldValidate(test.decode("1.233"))).to.be.equal(1.233)
      expect(shouldValidate(test.decode("-1.233"))).to.be.equal(-1.233)
      expect(shouldValidate(test.decode("1e5"))).to.be.equal(1e5)
      expect(shouldValidate(test.decode("-1e5"))).to.be.equal(-1e5)
      expect(shouldValidate(test.decode("0"))).to.be.equal(0)
      expect(shouldValidate(test.decode("021"))).to.be.equal(21)
      expect(shouldValidate(test.decode("0x32767"))).to.be.equal(0)
      shouldNotValidate(test.decode("aasdaNaN"))
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode("NaN"))
      shouldNotValidate(test.decode("-NaN"))
      shouldNotValidate(test.decode("Infinity"))
      shouldNotValidate(test.decode("-Infinity"))

      shouldNotValidate(test.decode({ key: null }))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('refinement() should work', () => {
      const test = number().refinement((i) => Number.isSafeInteger(i))

      expect(test.name).to.be.eql("number(custom refinement)")
      expect(shouldValidate(test.decode(3))).to.be.eql(3)
      expect(shouldValidate(test.decode(3.0))).to.be.eql(3.0)
      expect(shouldValidate(test.decode(Math.pow(2, 53) - 1))).to.be.eql(Math.pow(2, 53) - 1)
      shouldNotValidate(test.decode(Math.pow(2, 53)))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode('3'))
      shouldNotValidate(test.decode(3.1))
    })

    it('refinement(multiples of 0.5) should work', () => {
      const test = number().refinement((i) => Number.isSafeInteger(i * 2), "multiples of 0.5")

      expect(test.name).to.be.eql("number(multiples of 0.5)")
      expect(shouldValidate(test.decode(3))).to.be.eql(3)
      expect(shouldValidate(test.decode(3.0))).to.be.eql(3.0)
      expect(shouldValidate(test.decode(1.5))).to.be.eql(1.5)
      expect(shouldValidate(test.decode(2.5))).to.be.eql(2.5)
      expect(shouldValidate(test.decode(0.5))).to.be.eql(0.5)
      expect(shouldValidate(test.decode(-0.5))).to.be.eql(-0.5)
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(3.1))
      shouldNotValidate(test.decode(0.6))
      shouldNotValidate(test.decode(1.4))
      shouldNotValidate(test.decode(-1.4))
    })
  })
})