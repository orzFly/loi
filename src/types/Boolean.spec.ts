import { expect } from 'chai';
import * as t from 'io-ts';
import { forEach } from 'lodash';
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
      shouldNotValidate(test.decode("on"))
      shouldNotValidate(test.decode("off"))
      shouldNotValidate(test.decode("1"))
      shouldNotValidate(test.decode("0"))
      shouldNotValidate(test.decode("yyyyes"))
      shouldNotValidate(test.decode("nnnnno"))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(-1))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('mimicked boolean should work', () => {
      const test = boolean

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
      shouldNotValidate(test.decode("on"))
      shouldNotValidate(test.decode("off"))
      shouldNotValidate(test.decode("1"))
      shouldNotValidate(test.decode("0"))
      shouldNotValidate(test.decode("yyyyes"))
      shouldNotValidate(test.decode("nnnnno"))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode(1))
      shouldNotValidate(test.decode(-1))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('trueOnly() should work', () => {
      const test = boolean().trueOnly()

      expect(test.name).to.be.eql("boolean(true only)")
      expect(shouldValidate(test.decode(true))).to.be.eql(true)
      shouldNotValidate(test.decode(false))
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

    it('falseOnly() should work', () => {
      const test = boolean().falseOnly()

      expect(test.name).to.be.eql("boolean(false only)")
      shouldNotValidate(test.decode(true))
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

    forEach({
      "falseOnly().trueOnly()": [boolean().falseOnly().trueOnly(), "boolean(false only, true only)"],
      "trueOnly().falseOnly()": [boolean().trueOnly().falseOnly(), "boolean(true only, false only)"],
      "falseOnly().falseOnly().trueOnly()": [boolean().falseOnly().falseOnly().trueOnly(), "boolean(false only, false only, true only)"],
      "trueOnly().trueOnly().falseOnly()": [boolean().trueOnly().trueOnly().falseOnly(), "boolean(true only, true only, false only)"],
    } as { [key: string]: [t.Any, string] }, ([type, name], key) => {
      it(`${key} should work`, () => {
        const test = type

        expect(test.name).to.be.eql(name)
        shouldNotValidate(test.decode(true))
        shouldNotValidate(test.decode(false))
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
      expect(shouldValidate(test.decode("on"))).to.be.eql(true)
      expect(shouldValidate(test.decode("off"))).to.be.eql(false)
      expect(shouldValidate(test.decode("1"))).to.be.eql(true)
      expect(shouldValidate(test.decode("0"))).to.be.eql(false)
      shouldNotValidate(test.decode("yyyyes"))
      shouldNotValidate(test.decode("nnnnno"))
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

    forEach({
      "trueOnly().parseString().parseNumber()": [boolean().trueOnly().parseString().parseNumber(), "boolean(true only, parseString, parseNumber)"],
      "parseString().trueOnly().parseNumber()": [boolean().parseString().trueOnly().parseNumber(), "boolean(parseString, true only, parseNumber)"],
      "parseString().parseNumber().trueOnly()": [boolean().parseString().parseNumber().trueOnly(), "boolean(parseString, parseNumber, true only)"],
    } as { [key: string]: [t.Any, string] }, ([type, name], key) => {
      it(`${key} should work`, () => {
        const test = type

        expect(test.name).to.be.eql(name)
        expect(shouldValidate(test.decode(true))).to.be.eql(true)
        shouldNotValidate(test.decode(false))
        expect(shouldValidate(test.decode("true"))).to.be.eql(true)
        shouldNotValidate(test.decode("false"))
        expect(shouldValidate(test.decode("yes"))).to.be.eql(true)
        shouldNotValidate(test.decode("no"))
        expect(shouldValidate(test.decode("t"))).to.be.eql(true)
        shouldNotValidate(test.decode("f"))
        expect(shouldValidate(test.decode("y"))).to.be.eql(true)
        shouldNotValidate(test.decode("n"))
        shouldNotValidate(test.decode(0))
        expect(shouldValidate(test.decode(1))).to.be.eql(true)
        expect(shouldValidate(test.decode(-1))).to.be.eql(true)
        expect(shouldValidate(test.decode(Infinity))).to.be.eql(true)
        shouldNotValidate(test.decode(NaN))
        shouldNotValidate(test.decode(null))
        shouldNotValidate(test.decode(undefined))
      })
    })

    forEach({
      "falseOnly().parseString().parseNumber()": [boolean().falseOnly().parseString().parseNumber(), "boolean(false only, parseString, parseNumber)"],
      "parseString().falseOnly().parseNumber()": [boolean().parseString().falseOnly().parseNumber(), "boolean(parseString, false only, parseNumber)"],
      "parseString().parseNumber().falseOnly()": [boolean().parseString().parseNumber().falseOnly(), "boolean(parseString, parseNumber, false only)"],
    } as { [key: string]: [t.Any, string] }, ([type, name], key) => {
      it(`${key} should work`, () => {
        const test = type

        expect(test.name).to.be.eql(name)
        shouldNotValidate(test.decode(true))
        expect(shouldValidate(test.decode(false))).to.be.eql(false)
        shouldNotValidate(test.decode("true"))
        expect(shouldValidate(test.decode("false"))).to.be.eql(false)
        shouldNotValidate(test.decode("yes"))
        expect(shouldValidate(test.decode("no"))).to.be.eql(false)
        shouldNotValidate(test.decode("t"))
        expect(shouldValidate(test.decode("f"))).to.be.eql(false)
        shouldNotValidate(test.decode("y"))
        expect(shouldValidate(test.decode("n"))).to.be.eql(false)
        expect(shouldValidate(test.decode(0))).to.be.eql(false)
        shouldNotValidate(test.decode(1))
        shouldNotValidate(test.decode(-1))
        shouldNotValidate(test.decode(Infinity))
        expect(shouldValidate(test.decode(NaN))).to.be.eql(false)
        shouldNotValidate(test.decode(null))
        shouldNotValidate(test.decode(undefined))
      })
    })
  })
})