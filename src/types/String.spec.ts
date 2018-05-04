import { expect } from 'chai';
import * as t from 'io-ts';
import { shouldNotValidate, shouldValidate } from '../test-helper.spec';
import { string } from './String';

// tslint:disable:no-unused-expression // chai to be NaN
// tslint:disable:no-construct // new String()

describe('types:String', () => {
  describe('string', () => {
    it('should work', () => {
      const test = string()

      expect(test.name).to.be.eql("string")
      expect(shouldValidate(test.decode("abc"))).to.be.eql("abc")
      expect(shouldValidate(test.decode(""))).to.be.eql("")
      expect(shouldValidate(test.decode(new String("abc")))).to.be.eql("abc")
      expect(shouldValidate(test.decode(new String("")))).to.be.eql("")
      expect(shouldValidate(test.decode(new String(null)))).to.be.eql("null")
      expect(shouldValidate(test.decode(new String(undefined)))).to.be.eql("undefined")
      shouldNotValidate(test.decode({ valueOf: () => "test" }))
      shouldNotValidate(test.decode({ toString: () => "test" }))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode([]))
      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('mimicked string should work', () => {
      const test = string

      expect(test.name).to.be.eql("string")
      expect(shouldValidate(test.decode("abc"))).to.be.eql("abc")
      expect(shouldValidate(test.decode(""))).to.be.eql("")
      expect(shouldValidate(test.decode(new String("abc")))).to.be.eql("abc")
      expect(shouldValidate(test.decode(new String("")))).to.be.eql("")
      expect(shouldValidate(test.decode(new String(null)))).to.be.eql("null")
      expect(shouldValidate(test.decode(new String(undefined)))).to.be.eql("undefined")
      shouldNotValidate(test.decode({ valueOf: () => "test" }))
      shouldNotValidate(test.decode({ toString: () => "test" }))
      shouldNotValidate(test.decode(0))
      shouldNotValidate(test.decode([]))
      shouldNotValidate(test.decode({}))
      shouldNotValidate(test.decode(Infinity))
      shouldNotValidate(test.decode(NaN))
      shouldNotValidate(test.decode(null))
      shouldNotValidate(test.decode(undefined))
    })

    it('length() should work', () => {
      const test = string().length(5)

      expect(test.name).to.be.eql("string(exact 5 chars)")
      expect(shouldValidate(test.decode("12345"))).to.be.eql("12345")
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode("123"))
      shouldNotValidate(test.decode("123456"))

      expect(shouldValidate(test.decode(new String("12345")))).to.be.eql("12345")
      shouldNotValidate(test.decode(new String("")))
      shouldNotValidate(test.decode(new String("123")))
      shouldNotValidate(test.decode(new String("123456")))
      shouldNotValidate(test.decode(undefined))
    })

    it('min() should work', () => {
      const test = string().min(5)

      expect(test.name).to.be.eql("string(>=5 chars)")
      expect(shouldValidate(test.decode("12345"))).to.be.eql("12345")
      shouldNotValidate(test.decode(""))
      shouldNotValidate(test.decode("123"))
      expect(shouldValidate(test.decode("123456"))).to.be.eql("123456")

      expect(shouldValidate(test.decode(new String("12345")))).to.be.eql("12345")
      shouldNotValidate(test.decode(new String("")))
      shouldNotValidate(test.decode(new String("123")))
      expect(shouldValidate(test.decode(new String("123456")))).to.be.eql("123456")

      shouldNotValidate(test.decode(undefined))
    })

    it('max() should work', () => {
      const test = string().max(5)

      expect(test.name).to.be.eql("string(<=5 chars)")
      expect(shouldValidate(test.decode("12345"))).to.be.eql("12345")
      expect(shouldValidate(test.decode(""))).to.be.eql("")
      expect(shouldValidate(test.decode("123"))).to.be.eql("123")
      shouldNotValidate(test.decode("123456"))

      expect(shouldValidate(test.decode(new String("12345")))).to.be.eql("12345")
      expect(shouldValidate(test.decode(new String("")))).to.be.eql("")
      expect(shouldValidate(test.decode(new String("123")))).to.be.eql("123")
      shouldNotValidate(test.decode(new String("123456")))
      shouldNotValidate(test.decode(undefined))
    })

    const regexpTestCases = (test: t.Type<string, string, t.mixed>) => {
      expect(shouldValidate(test.decode("12345"))).to.be.eql("12345")
      expect(shouldValidate(test.decode(""))).to.be.eql("")
      expect(shouldValidate(test.decode("123"))).to.be.eql("123")
      shouldNotValidate(test.decode("abc456"))

      expect(shouldValidate(test.decode(new String("12345")))).to.be.eql("12345")
      expect(shouldValidate(test.decode(new String("")))).to.be.eql("")
      expect(shouldValidate(test.decode(new String("123")))).to.be.eql("123")
      shouldNotValidate(test.decode(new String("abc456")))
      shouldNotValidate(test.decode(undefined))
    }

    it('regex(name) should work', () => {
      const test = string().regex(/^\d*$/, "digitals only")

      expect(test.name).to.be.eql("string(digitals only)")
      regexpTestCases(test)
    })

    it('regex() should work', () => {
      const test = string().regex(/^\d*$/)

      expect(test.name).to.be.eql("string(regexp /^\\d*$/)")
      regexpTestCases(test)
    })

    it('pattern(name) should work', () => {
      const test = string().pattern(/^\d*$/, "digitals only")

      expect(test.name).to.be.eql("string(digitals only)")
      regexpTestCases(test)
    })

    it('pattern() should work', () => {
      const test = string().pattern(/^\d*$/)

      expect(test.name).to.be.eql("string(regexp /^\\d*$/)")
      regexpTestCases(test)
    })

    it('regexp(name) should work', () => {
      const test = string().regexp(/^\d*$/, "digitals only")

      expect(test.name).to.be.eql("string(digitals only)")
      regexpTestCases(test)
    })

    it('regexp() should work', () => {
      const test = string().regexp(/^\d*$/)

      expect(test.name).to.be.eql("string(regexp /^\\d*$/)")
      regexpTestCases(test)
    })
  })
})