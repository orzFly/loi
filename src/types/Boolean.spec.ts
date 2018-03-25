import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { boolean } from './Boolean';

// tslint:disable:no-unused-expression // chai to be NaN

describe('types:Boolean', () => {
  describe('boolean', () => {
    it('should work', () => {
      const test = boolean()

      expect(test.name).to.be.eql("boolean")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      expect(shouldValidate(test.decode(false))).to.be.eql(false)
      shouldNotValidate(test.decode("true"))
      shouldNotValidate(test.decode("false"))
      shouldNotValidate(test.decode("yes"))
      shouldNotValidate(test.decode("no"))
      shouldNotValidate(test.decode("t"))
      shouldNotValidate(test.decode("f"))
      shouldNotValidate(test.decode("y"))
      shouldNotValidate(test.decode("n"))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(-1))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('parseString() should work', () => {
      const test = boolean().parseString()

      expect(test.name).to.be.eql("boolean(parseString)")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      expect(shouldValidate(test.decode(false))).to.be.eql(false)
      expect(shouldValidate(test.decode("true"))).to.be.eql(true)
      expect(shouldValidate(test.decode("false"))).to.be.eql(false)
      expect(shouldValidate(test.decode("yes"))).to.be.eql(true)
      expect(shouldValidate(test.decode("no"))).to.be.eql(false)
      expect(shouldValidate(test.decode("t"))).to.be.eql(true)
      expect(shouldValidate(test.decode("f"))).to.be.eql(false)
      expect(shouldValidate(test.decode("y"))).to.be.eql(true)
      expect(shouldValidate(test.decode("n"))).to.be.eql(false)
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(-1))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('parseNumber() should work', () => {
      const test = boolean().parseNumber()

      expect(test.name).to.be.eql("boolean(parseNumber)")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      expect(shouldValidate(test.decode(false))).to.be.eql(false)
      shouldNotValidate(test.decode("true"))
      shouldNotValidate(test.decode("false"))
      shouldNotValidate(test.decode("yes"))
      shouldNotValidate(test.decode("no"))
      shouldNotValidate(test.decode("t"))
      shouldNotValidate(test.decode("f"))
      shouldNotValidate(test.decode("y"))
      shouldNotValidate(test.decode("n"))
      expect(shouldValidate(test.decode(0))).to.be.eql(false)
      expect(shouldValidate(test.decode(1))).to.be.eql(true)
      expect(shouldValidate(test.decode(-1))).to.be.eql(true)
      expect(shouldValidate(test.decode(Infinity))).to.be.eql(true)
      expect(shouldValidate(test.decode(NaN))).to.be.eql(false)
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('parse() should work', () => {
      const test = boolean().parse()

      expect(test.name).to.oneOf(["boolean(parseString, parseNumber)", "boolean(parseNumber, parseString)"])
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      expect(shouldValidate(test.decode(false))).to.be.eql(false)
      expect(shouldValidate(test.decode("true"))).to.be.eql(true)
      expect(shouldValidate(test.decode("false"))).to.be.eql(false)
      expect(shouldValidate(test.decode("yes"))).to.be.eql(true)
      expect(shouldValidate(test.decode("no"))).to.be.eql(false)
      expect(shouldValidate(test.decode("t"))).to.be.eql(true)
      expect(shouldValidate(test.decode("f"))).to.be.eql(false)
      expect(shouldValidate(test.decode("y"))).to.be.eql(true)
      expect(shouldValidate(test.decode("n"))).to.be.eql(false)
      expect(shouldValidate(test.decode(0))).to.be.eql(false)
      expect(shouldValidate(test.decode(1))).to.be.eql(true)
      expect(shouldValidate(test.decode(-1))).to.be.eql(true)
      expect(shouldValidate(test.decode(Infinity))).to.be.eql(true)
      expect(shouldValidate(test.decode(NaN))).to.be.eql(false)
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })
  })
})